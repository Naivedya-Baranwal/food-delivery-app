import deliveryAgentModel from "../models/deliveryAgentModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import validator from "validator"
import orderModel from "../models/orderModel.js";

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

// ✅ LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find agent
        const agent = await deliveryAgentModel.findOne({ email });
        if (!agent) {
            return res.status(401).json({
                success: false,
                message: "Agent doesn't exist"
            });
        }

        // Compare password (await is important!)
        const isMatch = await bcrypt.compare(password, agent.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Update agent status to online
        await deliveryAgentModel.findByIdAndUpdate(agent._id, { 
            isOnline: true,
            isAvailable: true
        });

        // Generate token
        const token = createToken(agent._id);

        // ✅ Success response (200)
        res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later"
        });
    }
};

// ✅ LOGOUT - Update agent status
const logout = async (req, res) => {
    try {
        const agentId = req.body.agentId; // From authDelivery middleware

        await deliveryAgentModel.findByIdAndUpdate(agentId, {
            isOnline: false,
            isAvailable: false
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Error logging out"
        });
    }
};

// ✅ REGISTER
const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validation
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if agent exists
        const exists = await deliveryAgentModel.findOne({ email });
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Agent already exists"
            });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        // Validate phone
        if (!validator.isMobilePhone(phone, 'any')) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid phone number"
            });
        }

        // Validate password
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create agent
        const agent = new deliveryAgentModel({
            name,
            email,
            phone,
            password: hashedPassword
        });

        await agent.save();

        // ✅ Success response (201)
        res.status(201).json({
            success: true,
            message: "Registration successful! Please login to continue"
        });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Server error. Please try again later"
        });
    }
};

// controllers/deliveryController.js

const updateAgentLocation = async (req, res) => {
  try {
    const { lat, lon, agentId } = req.body;
    
    console.log("📍 Update location request:", { lat, lon, agentId });

    // Validate inputs
    if (!lat || !lon || !agentId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: lat, lon, agentId"
      });
    }

    // Validate coordinates
    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates - must be numbers"
      });
    }

    const latitude = Number(lat);
    const longitude = Number(lon);

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude - must be between -90 and 90"
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude - must be between -180 and 180"
      });
    }

    const agent = await deliveryAgentModel.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    // Update location - GeoJSON format: [longitude, latitude]
    const updatedAgent = await deliveryAgentModel.findByIdAndUpdate(
      agentId,
      {
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      },
      { new: true }
    );

    console.log("✅ Location updated:", updatedAgent.location);

    // ✅ NEW: Emit location update via socket
    const io = req.app.get('io');
    
    // Find if agent has an active order
    const activeOrder = await orderModel.findOne({
      assignedDeliveryBoy: agentId,
      status: { $in: ['Assigned', 'Picked Up', 'Out for delivery'] }
    });

    if (activeOrder) {
      console.log(`📡 Broadcasting location for order: ${activeOrder._id}`);
      
      // Emit to all users tracking this order
      io.emit('agentLocationUpdate', {
        orderId: activeOrder._id.toString(),
        agentId: agentId,
        location: {
          latitude: latitude,
          longitude: longitude
        },
        timestamp: new Date()
      });
      
      console.log(`📢 Location broadcasted for order ${activeOrder._id}`);
    }

    return res.status(200).json({
      success: true,
      message: "Location updated successfully",
      location: updatedAgent.location
    });
    
  } catch (error) {
    console.error("❌ Update location error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update location: " + error.message
    });
  }
};



// controllers/deliveryController.js

// const updateAgentLocation = async (req, res) => {
//   try {
//     const { lat, lon, agentId } = req.body;
    
//     console.log("📍 Update location request:", { lat, lon, agentId });

//     // ✅ Validate inputs
//     if (!lat || !lon || !agentId) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing required fields: lat, lon, agentId"
//       });
//     }

//     // ✅ Validate coordinates
//     if (isNaN(lat) || isNaN(lon)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid coordinates - must be numbers"
//       });
//     }

//     const latitude = Number(lat);
//     const longitude = Number(lon);

//     // ✅ Validate coordinate ranges
//     if (latitude < -90 || latitude > 90) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid latitude - must be between -90 and 90"
//       });
//     }

//     if (longitude < -180 || longitude > 180) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid longitude - must be between -180 and 180"
//       });
//     }

//     const agent = await deliveryAgentModel.findById(agentId);
//     if (!agent) {
//       return res.status(404).json({
//         success: false,
//         message: "Agent not found"
//       });
//     }

//     // ✅ Update location - GeoJSON format: [longitude, latitude]
//     const updatedAgent = await deliveryAgentModel.findByIdAndUpdate(
//       agentId,
//       {
//         location: {
//           type: 'Point',
//           coordinates: [longitude, latitude] // [lon, lat] order for GeoJSON
//         }
//       },
//       { new: true }
//     );

//     console.log("✅ Location updated:", updatedAgent.location);

//     return res.status(200).json({
//       success: true,
//       message: "Location updated successfully",
//       location: updatedAgent.location
//     });
    
//   } catch (error) {
//     console.error("❌ Update location error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to update location: " + error.message
//     });
//   }
// };


  // ✅ VERIFY TOKEN - Fetch user data
const verifyTokenEndpoint = async (req, res) => {
    try {
        const agentId = req.body.agentId; // From authAgent middleware

        const agent = await deliveryAgentModel
            .findById(agentId)
            .select('-password'); // Exclude password

        if (!agent) {
            return res.status(401).json({
                success: false,
                message: "Agent not found or token invalid"
            });
        }

        // ✅ Return user data
        res.status(200).json({
            success: true,
            message: "Token verified",
            agent: {
                id: agent._id,
                name: agent.name,
                email: agent.email,
                phone: agent.phone,
                isOnline: agent.isOnline,
                isAvailable: agent.isAvailable,
                location: agent.location,
                todayDeliveries: agent.todayDeliveries,
                totalDeliveries: agent.totalDeliveries
            }
        });

    } catch (error) {
        console.error("Verify token error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


export {
  login,
  register,
  updateAgentLocation,
  verifyTokenEndpoint,
  logout
};
