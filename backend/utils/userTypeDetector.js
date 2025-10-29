// utils/userTypeDetector.js
import userModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";
import deliveryAgentModel from "../models/deliveryAgentModel.js";

/**
 * Detects user type by checking which model contains the userId
 * @param {string} userId - The user ID from decoded token
 * @returns {Promise<{model: Model, userType: string} | null>}
 */
export const detectUserType = async (userId) => {
  try {
    // Check in parallel for better performance
    const [user, admin, agent] = await Promise.all([
      userModel.findById(userId).select('_id').lean(),
      adminModel.findById(userId).select('_id').lean(),
      deliveryAgentModel.findById(userId).select('_id').lean()
    ]);

    if (user) {
      console.log("✅ Detected user type: Customer");
      return { model: userModel, userType: "user" };
    }

    if (admin) {
      console.log("✅ Detected user type: Admin");
      return { model: adminModel, userType: "admin" };
    }

    if (agent) {
      console.log("✅ Detected user type: Delivery Agent");
      return { model: deliveryAgentModel, userType: "deliveryAgent" };
    }

    console.log("❌ User ID not found in any model");
    return null;

  } catch (error) {
    console.error("❌ Error detecting user type:", error);
    return null;
  }
};
