import express from "express";
import {
  login,
  register,
  updateAgentLocation
} from "../controllers/deliveryController.js";
import authDelivery from "../middleware/authDelivery.js";

const deliveryRouter = express.Router();

// Protected routes
deliveryRouter.post("/login", login);
deliveryRouter.post("/register", register);
deliveryRouter.post("/update-location", authDelivery, updateAgentLocation);

export default deliveryRouter;
