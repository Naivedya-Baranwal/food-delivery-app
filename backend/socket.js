// socket/socketHandler.js
import {verifyToken} from "./utils/jwt.js";
import {detectUserType} from "./utils/userTypeDetector.js";
import deliveryAgentModel from "./models/deliveryAgentModel.js";
import orderModel from "./models/orderModel.js";
import deliveryAssignmentModel from "./models/deliveryAssignmentModel.js";
import adminModel from "./models/adminModel.js";
import { restaurant } from "./config/restaurant.js";

export const socketHandler = (io) => {
  io.on("connection", async (socket) => {
    console.log("🔌 New socket connection attempt:", socket.id);
    const token = socket.handshake.auth.token;

    const userId = verifyToken(token);

    if (!userId) {
      console.log("❌ Invalid token, disconnecting socket");
      socket.disconnect();
      return;
    }

    console.log("✅ Token verified, user ID:", userId);

    const userInfo = await detectUserType(userId);

    if (!userInfo) {
      console.log("❌ User not found in any model, disconnecting");
      socket.disconnect();
      return;
    }

    const { model: Model, userType } = userInfo;

    console.log(`✅ User type detected: ${userType}`);

    // Update socketId and isOnline
    try {
      await Model.findByIdAndUpdate(userId, {
        socketId: socket.id,
        isOnline: true
      });

      console.log(`✅ ${userType} connected:`, userId, socket.id);
    } catch (err) {
      console.error("❌ Error updating socket connection:", err);
      socket.disconnect();
      return;
    }

    socket.userInfo = { userId, userType, Model };

    // ✅ If delivery agent, check for waiting orders
    if (userType === 'deliveryAgent') {
      const agent = await deliveryAgentModel.findById(userId);
      if (agent && agent.isAvailable) {
        await assignAgentToWaitingOrders(io, agent, socket);
      }
    }

    // Handle disconnect
    socket.on("disconnect", async () => {
      try {
        await Model.findByIdAndUpdate(userId, {
          socketId: null,
          isOnline: false
        });

        console.log(`🔌 ${userType} disconnected:`, userId);
      } catch (err) {
        console.error("❌ Error handling disconnect:", err);
      }
    });
  });

  return io;
};

// ✅ UPDATED: Assign agent to waiting orders with assignment creation
async function assignAgentToWaitingOrders(io, agent, socket) {
  try {
    console.log(`🔍 Checking pending orders for agent: ${agent.name}`);

    const pendingOrders = await orderModel.find({
      status: 'Out for delivery',
      assignedDeliveryBoy: null,
    });

    if (pendingOrders.length === 0) {
      console.log('ℹ️ No pending orders found');
      return;
    }

    console.log(`📦 Found ${pendingOrders.length} pending orders`);

    for (const order of pendingOrders) {
      const distance = calculateDistance(
        agent.location.coordinates[1],
        agent.location.coordinates[0],
        order.address.latitude,
        order.address.longitude
      );

      const MAX_DISTANCE = 50000; // 50km

      console.log(`📏 Order ${order._id.toString().slice(-6)}: ${(distance/1000).toFixed(2)}km away`);

      if (distance <= MAX_DISTANCE && agent.isAvailable && agent.isOnline) {
        console.log(`✅ Agent ${agent.name} is within range of order ${order._id}`);

        // ✅ Check if assignment exists
        let assignment = order.assignment 
          ? await deliveryAssignmentModel.findOne({ _id: order.assignment, status: 'broadcasted' })
          : null;

        // ✅ CREATE assignment if it doesn't exist
        if (!assignment) {
          console.log(`⚠️ Order ${order._id.toString().slice(-6)} has NO assignment - CREATING one now`);
          
          assignment = await deliveryAssignmentModel.create({
            order: order._id,
            pickup: {
              name: restaurant.name,
              address: restaurant.address,
              latitude: restaurant.latitude,
              longitude: restaurant.longitude
            },
            drop: {
              address: order.address.location,
              latitude: order.address.latitude,
              longitude: order.address.longitude
            },
            broadCastedTo: [agent._id.toString()],
            status: 'broadcasted'
          });

          // Update order with assignment reference
          order.assignment = assignment._id;
          order.availableAgents = [{
            id: agent._id,
            name: agent.name,
            phone: agent.phone,
            latitude: agent.location.coordinates[1],
            longitude: agent.location.coordinates[0],
          }];
          await order.save();

          console.log(`✅ CREATED assignment ${assignment._id.toString().slice(-6)} for order ${order._id.toString().slice(-6)}`);
        } 
        // ✅ Assignment exists - add agent if not already there
        else {
          const agentIdString = agent._id.toString();
          const alreadyBroadcasted = assignment.broadCastedTo.includes(agentIdString);

          if (!alreadyBroadcasted) {
            console.log(`✅ Assignment EXISTS - adding agent to broadcast list`);
            
            assignment.broadCastedTo.push(agentIdString);
            await assignment.save();

            // Add to availableAgents
            const agentExists = order.availableAgents.some(
              a => a.id.toString() === agent._id.toString()
            );

            if (!agentExists) {
              order.availableAgents.push({
                id: agent._id,
                name: agent.name,
                phone: agent.phone,
                latitude: agent.location.coordinates[1],
                longitude: agent.location.coordinates[0],
              });
              await order.save();
            }

            console.log(`✅ Added agent to EXISTING assignment ${assignment._id.toString().slice(-6)}`);
          } else {
            console.log(`ℹ️ Agent already in broadcast list for order ${order._id.toString().slice(-6)}`);
          }
        }

        // ✅ Populate order for socket emission
        const populatedOrder = await orderModel
          .findById(order._id)
          .populate('assignedDeliveryBoy', 'name phone email');

        // ✅ Notify the agent
        if (socket) {
          socket.emit('newOrderAvailable', {
            assignment: assignment,
            order: populatedOrder,
            message: 'New order available for delivery!',
          });
          console.log(`📢 Notified agent ${agent.name} about order ${order._id.toString().slice(-6)}`);
        }

        // ✅ Notify admin
        const admin = await adminModel.findOne({
          email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
        });

        if (admin && admin.socketId && admin.isOnline) {
          io.to(admin.socketId).emit('agentAvailabilityUpdate', {
            orderId: order._id,
            order: populatedOrder,
            availableAgents: order.availableAgents,
            message: `Agent ${agent.name} is now available for this order`,
          });
          console.log(`📢 Notified admin about agent ${agent.name}`);
        }
      } else if (distance > MAX_DISTANCE) {
        console.log(`   Order ${order._id.toString().slice(-6)} is TOO FAR (${(distance/1000).toFixed(2)}km > 50km)`);
      }
    }
  } catch (error) {
    console.error('❌ Error assigning agent to waiting orders:', error);
    console.error('Stack trace:', error.stack);
  }
}

// Helper: Calculate distance (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}


