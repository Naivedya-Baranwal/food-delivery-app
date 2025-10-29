import deliveryAgentModel from "../models/deliveryAgentModel.js";
import deliveryAssignmentModel from "../models/deliveryAssignmentModel.js";
import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import adminModel from "../models/adminModel.js";
import Stripe from "stripe";
import { restaurant } from "../config/restaurant.js";
import { sendOtpMail } from "../utils/mail.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Helper function to notify admin
const notifyAdminNewOrder = async (io, order) => {
  try {
    const admin = await adminModel.findOne({
      email: process.env.ADMIN_EMAIL || "admin@gmail.com"
    });

    if (admin && admin.socketId && admin.isOnline) {
      console.log("✅ Admin is online, sending notification to:", admin.socketId);

      io.to(admin.socketId).emit('newOrder', {
        order: order,
        message: `New order from ${order.name}!`,
        amount: order.amount,
        paymentMethod: order.paymentMethod,
        timestamp: new Date()
      });

      console.log("📢 Socket notification sent successfully");
    } else {
      console.log("ℹ️ Admin offline - order saved, will see on login");
    }
  } catch (error) {
    console.error("⚠️ Error notifying admin:", error);
  }
};


//placing user order for frontend
export const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL;
  try {
    const {
      userId,
      items,
      amount,
      address,
      paymentMethod = "Online",
    } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const newOrder = new orderModel({
      userId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      items,
      amount,
      address,
      payment: paymentMethod === "COD",
      paymentMethod,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // ✅ COD Payment - Notify admin immediately (order is confirmed)
    if (paymentMethod === "COD") {
      const io = req.app.get('io');
      await notifyAdminNewOrder(io, newOrder);

      return res.json({
        success: true,
        cod: true,
        message: "Order placed successfully with COD"
      });
    }
    // ✅ Online Payment - Create Stripe session (don't notify yet)
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 20 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    const io = req.app.get('io');
    if (success == "true") {
      // ✅ Payment successful - Update order
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({
          success: false,
          message: "Order not found"
        });
      }

      console.log("✅ Payment verified for order:", orderId);

      // ✅ NOW notify admin (payment is confirmed)
      await notifyAdminNewOrder(io, updatedOrder);

      res.json({
        success: true,
        message: "Payment verified successfully"
      });
    }
    else {
      b
      const deletedOrder = await orderModel.findByIdAndDelete(orderId);

      if (deletedOrder) {
        console.log("❌ Payment failed, order deleted:", orderId);
      }

      res.json({
        success: false,
        message: "Payment verification failed"
      });
    }
  } catch (error) {
    console.error("❌ Error verifying order:", error);
    res.json({ success: false, message: "Error verifying payment" });
  }
}

// user orders for frontend
export const usersOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({
      userId: req.body.userId,
      $or: [
        { payment: true },
        { paymentMethod: "COD" }
      ]
    })
      .sort({ createdAt: -1 });;
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({
        $or: [
          { payment: true },
          { paymentMethod: "COD" }
        ]
      })
      .populate("assignedDeliveryBoy", "name phone email")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ Error listing orders:", error);
    res.json({ success: false, message: "Error listing orders" });
  }
};

// api for updating the order status
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Input validation
    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Order ID and status are required"
      });
    }

    console.log(`📝 Attempting to update order ${orderId} status to: ${status}`);

    // Validate status value
    const validStatuses = [
      "Food Processing",
      "Out for delivery",
      "Delivered",
      "Cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    // Find order
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    let availableDeliveryAgents = [];

    // Handle "Out for delivery" status
    if (status === "Out for delivery") {
      // Validate order has required address data
      if (!order.address || !order.address.latitude || !order.address.longitude) {
        console.error("❌ Order lacks address coordinates:", orderId);
        return res.status(400).json({
          success: false,
          message: "Order lacks required address coordinates"
        });
      }

      try {
        // Find nearby delivery agents
        const nearByDeliveryAgent = await deliveryAgentModel.find({
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [
                  Number(order.address.longitude),
                  Number(order.address.latitude)
                ]
              },
              $maxDistance: 500000 // 500km
            }
          },
          isOnline: true,
          isAvailable: true
        }).select('_id name phone location socketId isOnline');

        console.log(`✅ Found ${nearByDeliveryAgent.length} nearby agents`);

        const candidates = nearByDeliveryAgent.map(d => String(d._id));

        // No agents available case
        if (candidates.length === 0) {
          order.status = status;
          order.availableAgents = [];
          await order.save();
          return res.status(200).json({
            success: true,
            message: "Status updated but no delivery agents are currently available"
          });
        }

        // Create delivery assignment
        const deliveryAssignment = await deliveryAssignmentModel.create({
          order: order._id,
          pickup: {
            name: restaurant.name,
            address: restaurant.address,
            latitude: restaurant.latitude,
            longitude: restaurant.longitude
          },
          drop: {
            address: order.address.location || '',
            latitude: order.address.latitude,
            longitude: order.address.longitude
          },
          broadCastedTo: candidates,
          status: 'broadcasted'
        });

        // Update order with assignment and agents
        availableDeliveryAgents = nearByDeliveryAgent.map(agent => ({
          id: agent._id,
          name: agent.name,
          phone: agent.phone,
          latitude: agent.location?.coordinates?.[1] || null,
          longitude: agent.location?.coordinates?.[0] || null
        }));

        order.assignment = deliveryAssignment._id;
        order.availableAgents = availableDeliveryAgents;
        order.status = status;

        await order.save();

        // Socket notifications
        const io = req.app.get('io');
        if (!io) {
          console.warn("⚠️ Socket.io instance not available");
        } else {
          const populatedOrder = await orderModel
            .findById(order._id)
            .populate('assignedDeliveryBoy', 'name phone email');

          // Notify available agents
          for (const agent of nearByDeliveryAgent) {
            if (agent.socketId && agent.isOnline) {
              io.to(agent.socketId).emit('newOrderAvailable', {
                assignment: deliveryAssignment,
                order: populatedOrder,
                message: 'New order available for delivery!'
              });
              console.log(`📢 Notified agent ${agent.name} about order ${order._id}`);
            }
          }

          // Notify admin
          const admin = await adminModel.findOne({
            email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
            isOnline: true
          });

          if (admin?.socketId) {
            io.to(admin.socketId).emit('agentAvailabilityUpdate', {
              orderId: order._id,
              order: populatedOrder,
              availableAgents: order.availableAgents,
              message: `${availableDeliveryAgents.length} agents are available for this order`
            });
          }
        }

        return res.json({
          success: true,
          message: "Status updated and delivery agents notified",
          availableDeliveryAgents
        });

      } catch (dbError) {
        console.error("❌ Database error finding agents:", dbError);
        return res.status(500).json({
          success: false,
          message: "Error finding delivery agents",
          error: dbError.message
        });
      }
    }

    // Handle other status updates
    order.status = status;
    await order.save();

    console.log(`✅ Updated order ${orderId} status to ${status}`);

    return res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: {
        id: order._id,
        status: order.status
      }
    });

  } catch (error) {
    console.error("❌ Error updating status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating order status",
      error: error.message
    });
  }
};


export const getDeliveryAssignment = async (req, res) => {
  const agentId = req.body.agentId;

  try {
    console.log("📦 Fetching assignments for agent:", agentId);

    const agent = await deliveryAgentModel.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    console.log("✅ Agent found:", agent.name, "| Available:", agent.isAvailable);

    if (!agent.isAvailable) {
      console.log("⏸️ Agent is busy, returning empty list");
      return res.status(200).json({
        success: true,
        data: [],
        message: "You are currently busy with another delivery"
      });
    }

    const agentLat = agent.location?.coordinates?.[1];
    const agentLon = agent.location?.coordinates?.[0];

    if (!agentLat || !agentLon) {
      console.log("⚠️ Agent location not available");
      return res.status(200).json({
        success: true,
        data: [],
        message: "Location not available. Please enable GPS."
      });
    }

    console.log("📍 Agent location:", { lat: agentLat, lon: agentLon });

    // ✅ CRITICAL FIX: Find ALL pending orders with proper query
    const pendingOrders = await orderModel.find({
      status: "Out for delivery",
      assignedDeliveryBoy: null,
      $or: [
        { payment: true },
        { paymentMethod: "COD" }
      ]
    }).lean(); // ✅ Add .lean() for better performance

    console.log(`📦 Found ${pendingOrders.length} total pending orders`);

    // ✅ DEBUG: Log each order
    pendingOrders.forEach(order => {
      console.log(`   Order ${order._id.toString().slice(-6)}: assignment=${order.assignment}, status=${order.status}`);
    });

    const validAssignments = [];
    const MAX_DISTANCE = 50000; // 50km

    for (const order of pendingOrders) {
      // ✅ Check if order has assignment field
      if (!order.assignment) {
        console.log(`⚠️ Order ${order._id.toString().slice(-6)} has no assignment field - skipping`);
        continue;
      }

      // ✅ Fetch assignment
      const assignment = await deliveryAssignmentModel.findById(order.assignment);

      if (!assignment) {
        console.log(`⚠️ Assignment not found for order ${order._id.toString().slice(-6)}`);
        continue;
      }

      if (assignment.status !== "broadcasted") {
        console.log(`⚠️ Assignment ${assignment._id.toString().slice(-6)} status is ${assignment.status}, not broadcasted`);
        continue;
      }

      // Calculate distance
      const distance = calculateDistance(
        agentLat,
        agentLon,
        order.address.latitude,
        order.address.longitude
      );

      console.log(`📏 Order ${order._id.toString().slice(-6)}: ${(distance / 1000).toFixed(2)}km away`);

      // ✅ If within range
      if (distance <= MAX_DISTANCE) {
        // Check if already broadcasted
        const alreadyBroadcasted = assignment.broadCastedTo.some(
          id => id.toString() === agentId.toString()
        );

        console.log(`Agent ${alreadyBroadcasted ? 'ALREADY' : 'NOT YET'} in broadCastedTo for order ${order._id.toString().slice(-6)}`);

        // ✅ Add agent to broadcast list if not already there
        if (!alreadyBroadcasted) {
          console.log(`✅ Adding agent to broadcast list for order ${order._id.toString().slice(-6)}`);

          assignment.broadCastedTo.push(agentId);
          await assignment.save();

          // Add to order's availableAgents
          const agentExists = order.availableAgents && order.availableAgents.some(
            a => a.id && a.id.toString() === agentId.toString()
          );

          if (!agentExists) {
            const updatedOrder = await orderModel.findById(order._id);
            updatedOrder.availableAgents.push({
              id: agent._id,
              name: agent.name,
              phone: agent.phone,
              latitude: agentLat,
              longitude: agentLon
            });
            await updatedOrder.save();
            console.log(`✅ Added agent to order's availableAgents list`);
          }
        }

        // ✅ Populate and add to results
        const populatedAssignment = await deliveryAssignmentModel
          .findById(assignment._id)
          .populate("order");

        validAssignments.push(populatedAssignment);
        console.log(`✅ Added order ${order._id.toString().slice(-6)} to valid assignments`);
      } else {
        console.log(`   Order ${order._id.toString().slice(-6)} is TOO FAR (${(distance / 1000).toFixed(2)}km > 50km)`);
      }
    }

    console.log(`✅ Returning ${validAssignments.length} valid assignments`);

    if (validAssignments.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No orders available in your area (50km radius)"
      });
    }

    return res.json({
      success: true,
      data: validAssignments,
      message: `${validAssignments.length} order(s) available for delivery`
    });

  } catch (error) {
    console.error("❌ Get assignments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch assignments: " + error.message
    });
  }
};

export const acceptAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const agentId = req.body.agentId; // From auth middleware

    console.log("📦 Accepting assignment:", { assignmentId, agentId });

    // ✅ 1. Find the assignment
    const assignment = await deliveryAssignmentModel.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    // ✅ 2. Check if assignment is still broadcasted
    if (assignment.status !== "broadcasted") {
      return res.status(400).json({
        success: false,
        message: "Assignment already accepted by another agent"
      });
    }

    // ✅ 3. Check if agent is already busy with another order
    const alreadyAssigned = await deliveryAssignmentModel.findOne({
      assignedTo: agentId,
      status: { $nin: ["broadcasted", "Delivered"] }
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "You are already assigned to another order"
      });
    }

    // ✅ 4. Assign to this agent
    assignment.assignedTo = agentId;
    assignment.status = "Assigned";
    await assignment.save();

    // ✅ 5. Update agent availability
    await deliveryAgentModel.findByIdAndUpdate(agentId, {
      isAvailable: false,
      currentOrderId: assignment.order
    });

    // ✅ 6. Update order status to "Picked Up"
    await orderModel.findByIdAndUpdate(assignment.order, {
      status: "Out for delivery",
      assignedDeliveryBoy: agentId,
      acceptedAt: new Date(),
      availableAgents: []
    });

    // ✅ NEW: Notify all other agents that this order is no longer available
    const io = req.app.get('io');
    const otherAgentIds = assignment.broadCastedTo.filter(
      id => id.toString() !== agentId.toString()
    );

    for (const otherAgentId of otherAgentIds) {
      const otherAgent = await deliveryAgentModel.findById(otherAgentId);
      if (otherAgent && otherAgent.socketId && otherAgent.isOnline) {
        io.to(otherAgent.socketId).emit('orderAcceptedByOther', {
          assignmentId: assignment._id,
          orderId: assignment.order,
          message: 'This order has been accepted by another agent'
        });
        console.log(`📢 Notified agent ${otherAgent.name} that order was taken`);
      }
    }

    // ✅ Notify admin
    const admin = await adminModel.findOne({ isOnline: true });
    if (admin && admin.socketId) {
      const populatedOrder = await orderModel
        .findById(assignment.order)
        .populate('assignedDeliveryBoy', 'name phone email');

      io.to(admin.socketId).emit('orderAssigned', {
        orderId: assignment.order,
        order: populatedOrder,
        agentId: agentId,
        message: 'Order has been assigned'
      });
      console.log(`📢 Notified admin that order was assigned`);
    }

    console.log("✅ Assignment accepted successfully");
    return res.status(200).json({
      success: true,
      message: "Assignment accepted successfully",
      assignmentId: assignment._id
    });

  } catch (error) {
    console.error("❌ Accept assignment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to accept assignment"
    });
  }
};

export const getCurrentAssignment = async (req, res) => {
  try {
    const agentId = req.body.agentId;

    console.log("📦 Fetching current assignment for agent:", agentId);

    const assignment = await deliveryAssignmentModel
      .findOne({
        assignedTo: agentId,
        status: "Assigned"
      })
      .populate("order")
      .populate("assignedTo", "name email phone location");

    // ✅ No assignment is not an error - return null
    if (!assignment) {
      console.log("ℹ️ No active assignment for agent");
      return res.status(200).json({
        success: true,
        assignment: null,
        deliveryAgentLocation: null,
        UserLocation: null,
        message: "No active assignment"
      });
    }

    // ✅ Check if order exists
    if (!assignment.order) {
      console.warn("⚠️ Assignment has no order");
      return res.status(400).json({
        success: false,
        message: 'Order not found for this assignment'
      });
    }

    console.log("✅ Found active assignment:", assignment._id);

    // Extract locations
    let deliveryAgentLocation = { lat: null, lon: null };
    if (assignment.assignedTo?.location?.coordinates?.length === 2) {
      deliveryAgentLocation.lat = assignment.assignedTo.location.coordinates[1];
      deliveryAgentLocation.lon = assignment.assignedTo.location.coordinates[0];
    }

    let UserLocation = { lat: null, lon: null };
    if (assignment.order?.address) {
      UserLocation.lat = assignment.order.address.latitude;
      UserLocation.lon = assignment.order.address.longitude;
    }

    return res.status(200).json({
      success: true,
      assignment,
      deliveryAgentLocation,
      UserLocation
    });

  } catch (error) {
    console.error("❌ Get assignment error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get assignment data"
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId)
      .populate("assignedDeliveryBoy")
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Error fetching order data" });
  }
}

// Generate OTP for order delivery
export const generateOtp = async (req, res) => {
  const { orderId } = req.body;

  try {
    console.log(`🔄 Generating OTP for order: ${orderId}`);

    // Validate orderId
    if (!orderId) {
      return res.status(400).json({ 
        success: false, 
        message: "Order ID is required" 
      });
    }

    // Find order with timeout
    const order = await Promise.race([
      orderModel.findById(orderId),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      )
    ]);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    if (!order.email) {
      return res.status(400).json({ 
        success: false, 
        message: "Order has no associated email address" 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    // Update order first
    order.deliveryOtp = otp;
    order.otpExpiry = expiry;

    try {
      await Promise.race([
        order.save(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Save timeout')), 5000)
        )
      ]);

      console.log(`✅ OTP saved for order: ${orderId}`);

      // Try to send email with timeout
      try {
        await Promise.race([
          sendOtpMail(order.email, otp),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Email timeout')), 10000)
          )
        ]);

        console.log(`✅ OTP email sent to: ${order.email}`);
        
        return res.status(200).json({
          success: true,
          message: "OTP generated and sent successfully",
          email: order.email
        });
      } catch (emailError) {
        console.error("❌ Error sending OTP email:", emailError);
        
        // Return success even if email fails (OTP is saved)
        return res.status(200).json({
          success: true,
          message: "OTP generated but email delivery failed. Check order status or try again.",
          email: order.email
        });
      }
    } catch (saveError) {
      console.error("❌ Error saving OTP:", saveError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to save OTP" 
      });
    }
  } catch (error) {
    console.error("❌ Error generating OTP:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message === 'Database timeout' 
        ? "Server is taking too long to respond. Please try again."
        : "Error generating OTP"
    });
  }
};

// ✅ UPDATED Helper function for broadcasting
async function broadcastWaitingOrdersToAgent(io, agent) {
  try {
    const pendingOrders = await orderModel.find({
      status: 'Out for delivery',
      assignedDeliveryBoy: null,
    });

    console.log(`🔍 Found ${pendingOrders.length} pending orders for broadcast check`);

    for (const order of pendingOrders) {
      const distance = calculateDistance(
        agent.location.coordinates[1],
        agent.location.coordinates[0],
        order.address.latitude,
        order.address.longitude
      );

      console.log(`📏 Order ${order._id.toString().slice(-6)}: ${(distance / 1000).toFixed(2)}km away`);

      if (distance <= 50000) {
        // ✅ Check if assignment exists
        let assignment = order.assignment
          ? await deliveryAssignmentModel.findOne({ order: order._id, status: 'broadcasted' })
          : null;

        // ✅ CREATE assignment if it doesn't exist
        if (!assignment) {
          console.log(`⚠️ Order ${order._id.toString().slice(-6)} has no assignment - CREATING one now`);

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

          console.log(`✅ Created assignment ${assignment._id.toString().slice(-6)} for order ${order._id.toString().slice(-6)}`);
        }
        // ✅ Assignment exists - add agent if not already there
        else if (!assignment.broadCastedTo.includes(agent._id.toString())) {
          assignment.broadCastedTo.push(agent._id.toString());
          await assignment.save();

          order.availableAgents.push({
            id: agent._id,
            name: agent.name,
            phone: agent.phone,
            latitude: agent.location.coordinates[1],
            longitude: agent.location.coordinates[0],
          });
          await order.save();

          console.log(`✅ Added agent to existing assignment ${assignment._id.toString().slice(-6)}`);
        }

        // Populate order for socket emission
        const populatedOrder = await orderModel
          .findById(order._id)
          .populate('assignedDeliveryBoy', 'name phone email');

        // Notify agent
        if (agent.socketId && agent.isOnline) {
          io.to(agent.socketId).emit('newOrderAvailable', {
            assignment,
            order: populatedOrder,
            message: 'New order available!',
          });
          console.log(`📢 Notified agent ${agent.name} about order ${order._id.toString().slice(-6)}`);
        }

        // Notify admin
        const admin = await adminModel.findOne({ isOnline: true });
        if (admin && admin.socketId) {
          io.to(admin.socketId).emit('agentAvailabilityUpdate', {
            orderId: order._id,
            order: populatedOrder,
            availableAgents: order.availableAgents,
            message: `Agent ${agent.name} is now available`,
          });
          console.log(`📢 Notified admin about agent ${agent.name}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error broadcasting:', error);
  }
}

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

// Verify OTP by delivery agent
export const verifyOtp = async (req, res) => {
  const { agentId, otp } = req.body;

  try {
    // 1. Find active order for agent
    const order = await orderModel.findOne({
      assignedDeliveryBoy: agentId,
      status: { $ne: "Delivered" },
    });

    console.log("📦 Order found:", order?._id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No active order for this agent"
      });
    }

    // 2. Validate OTP
    if (!order.deliveryOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not generated yet"
      });
    }

    if (new Date() > order.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP"
      });
    }

    if (order.deliveryOtp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again"
      });
    }

    // 3. Get current date info for daily reset check
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 4. Update delivery agent stats
    const agent = await deliveryAgentModel.findById(agentId);

    if (agent) {
      const lastReset = agent.lastResetDate ? new Date(agent.lastResetDate) : null;
      const shouldReset = !lastReset || lastReset < todayStart;

      if (shouldReset) {
        agent.todayDeliveries = 1;
        agent.lastResetDate = todayStart;
      } else {
        agent.todayDeliveries = (agent.todayDeliveries || 0) + 1;
      }

      agent.totalDeliveries = (agent.totalDeliveries || 0) + 1;
      agent.isAvailable = true;
      agent.currentOrderId = null;

      await agent.save();
      console.log("✅ Agent updated:", {
        todayDeliveries: agent.todayDeliveries,
        totalDeliveries: agent.totalDeliveries
      });
    }

    // 5. Update order status
    order.status = "Delivered";
    order.deliveredAt = new Date();
    await order.save();

    // 6. Update and delete delivery assignment
    const assignment = await deliveryAssignmentModel.findOne({
      order: order._id
    });

    if (assignment) {
      await deliveryAssignmentModel.findByIdAndDelete(assignment._id);
      console.log("🗑️ Assignment deleted:", assignment._id);
    }

    // ✅ 7. Get socket instance
    const io = req.app.get('io');

    // ✅ 8. Notify admin about delivery completion
    const admin = await adminModel.findOne({
      email: process.env.ADMIN_EMAIL || 'admin@gmail.com',
    });

    if (admin && admin.socketId && admin.isOnline) {
      const populatedOrder = await orderModel
        .findById(order._id)
        .populate('assignedDeliveryBoy', 'name phone email');

      io.to(admin.socketId).emit('orderDelivered', {
        orderId: order._id,
        order: populatedOrder,
        deliveredAt: order.deliveredAt,
        agentName: agent?.name,
        message: `Order #${order._id.toString().slice(-6)} has been delivered by ${agent?.name}`,
      });
      console.log(`📢 Notified admin about order ${order._id} delivery`);
    }
    // ✅ NEW: Notify USER (customer) about delivery completion
    const customer = await userModel.findById(order.user);

    if (customer && customer.socketId && customer.isOnline) {
      io.to(customer.socketId).emit('orderDelivered', {
        orderId: order._id.toString(),
        status: 'Delivered',
        deliveredAt: order.deliveredAt,
        agentName: agent?.name,
        message: `Your order has been delivered! 🎉`,
      });
      console.log(`📢 Notified customer ${customer.email} about order delivery`);
    }
    // ✅ 9. Check for waiting orders after delivery completion
    if (agent && agent.isAvailable && agent.isOnline) {
      await broadcastWaitingOrdersToAgent(io, agent);
    }
    // In verifyOtp function, after broadcastWaitingOrdersToAgent

    // ✅ Notify agent to refresh assignments
    if (agent && agent.socketId && agent.isOnline) {
      console.log(`📢 Notifying agent ${agent.name} to check for new orders`);

      io.to(agent.socketId).emit('deliveryCompleted', {
        message: 'Delivery completed! Checking for new orders...',
        agentId: agent._id,
        todayDeliveries: agent.todayDeliveries,
        totalDeliveries: agent.totalDeliveries
      });

      console.log(`✅ Agent ${agent.name} notified to refresh assignments`);
    }

    // 10. Send success response
    return res.status(200).json({
      success: true,
      message: "Order delivered successfully! 🎉",
      order: {
        _id: order._id,
        status: order.status,
        deliveredAt: order.deliveredAt,
        amount: order.amount
      },
      agentStats: {
        todayDeliveries: agent?.todayDeliveries || 0,
        totalDeliveries: agent?.totalDeliveries || 0,
        isAvailable: true
      }
    });

  } catch (error) {
    console.error("❌ Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "Server error while verifying OTP"
    });
  }
};


// ✅ Get delivery history for agent
export const getAgentDeliveryHistory = async (req, res) => {
  try {
    const agentId = req.body.agentId; // From auth middleware
    const { page = 1, limit = 20 } = req.query;

    console.log("📦 Fetching delivery history for agent:", agentId);

    // Get all delivered orders by this agent
    const orders = await orderModel
      .find({
        assignedDeliveryBoy: agentId,
        status: "Delivered"
      })
      .sort({ deliveredAt: -1 }) // Most recent first
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('_id items amount address deliveredAt date name phone');

    // Get total count for pagination
    const total = await orderModel.countDocuments({
      assignedDeliveryBoy: agentId,
      status: "Delivered"
    });

    console.log(`✅ Found ${orders.length} delivered orders out of ${total} total`);

    return res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("❌ Error fetching delivery history:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch delivery history"
    });
  }
};

// ✅ Get today's delivery statistics for agent
export const getTodayDeliveries = async (req, res) => {
  try {
    const agentId = req.body.agentId;

    // Get today's start time
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Get today's delivered orders
    const todayOrders = await orderModel
      .find({
        assignedDeliveryBoy: agentId,
        status: "Delivered",
        deliveredAt: { $gte: todayStart }
      })
      .select('_id amount deliveredAt');

    // Calculate total earnings today
    const todayEarnings = todayOrders.reduce((sum, order) => sum + order.amount, 0);

    console.log(`✅ Today: ${todayOrders.length} deliveries, ₹${todayEarnings} earned`);

    return res.status(200).json({
      success: true,
      data: {
        count: todayOrders.length,
        totalEarnings: todayEarnings,
        orders: todayOrders
      }
    });

  } catch (error) {
    console.error("❌ Error fetching today's deliveries:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch today's deliveries"
    });
  }
};

