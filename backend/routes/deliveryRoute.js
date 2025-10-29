import express from "express";
import {
  login,
  register,
  updateAgentLocation,
  verifyTokenEndpoint,
  logout
} from "../controllers/deliveryController.js";
import authDelivery from "../middleware/authDelivery.js";

const deliveryRouter = express.Router();

// Protected routes
deliveryRouter.post("/login", login);
deliveryRouter.post("/register", register);
deliveryRouter.post("/updateLocation", authDelivery, updateAgentLocation);
deliveryRouter.get("/verify", authDelivery, verifyTokenEndpoint);
deliveryRouter.post("/logout", authDelivery, logout);


export default deliveryRouter;
