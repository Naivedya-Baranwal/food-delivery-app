import express from "express"
import authMiddleware from "../middleware/auth.js"
import { listOrders, placeOrder, updateStatus, usersOrders, verifyOrder } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,usersOrders);
orderRouter.get("/list",listOrders);
orderRouter.post("/status",updateStatus);

export default orderRouter;