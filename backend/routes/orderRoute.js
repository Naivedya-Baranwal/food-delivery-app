import express from "express"
import authMiddleware from "../middleware/auth.js"
import authDelivery from "../middleware/authDelivery.js"
import { listOrders, placeOrder, updateStatus, usersOrders, 
    verifyOrder,getDeliveryAssignment, acceptAssignment,getCurrentAssignment,getOrderById,verifyOtp,
    generateOtp ,getAgentDeliveryHistory, getTodayDeliveries   } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,usersOrders);
orderRouter.get("/list",listOrders);
orderRouter.post("/status",updateStatus);
orderRouter.get("/getOrderById/:orderId",authMiddleware,getOrderById);
orderRouter.get("/getDeliveryAssignments",authDelivery,getDeliveryAssignment);
orderRouter.post("/acceptAssignment/:assignmentId", authDelivery, acceptAssignment);
orderRouter.get("/getCurrentAssignment",authDelivery,getCurrentAssignment);
orderRouter.post("/verifyOtp",authDelivery,verifyOtp);
orderRouter.post("/generateOtp",authDelivery,generateOtp);

// ✅ Delivery history routes
orderRouter.get("/deliveryHistory", authDelivery, getAgentDeliveryHistory);
orderRouter.get("/todayDeliveries", authDelivery, getTodayDeliveries);

export default orderRouter;