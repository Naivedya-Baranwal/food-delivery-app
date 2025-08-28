import express from "express";
import { login,verifyAdmin } from "../controllers/adminController.js";
import adminAuthMiddleware from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post("/login",login);
adminRouter.get("/verify",adminAuthMiddleware , verifyAdmin);

export default adminRouter;