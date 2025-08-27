import express from "express";
import { login, logout,verifyAdmin } from "../controllers/adminController.js";


const adminRouter = express.Router();

adminRouter.post("/login",login);
adminRouter.post("/logout",logout);
adminRouter.get("/verify", verifyAdmin);

export default adminRouter;