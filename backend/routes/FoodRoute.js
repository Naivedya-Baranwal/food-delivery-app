import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import adminAuthMiddleware from '../middleware/adminAuth.js'

const foodRouter = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "foodImages",  
    allowed_formats: ["jpg", "png", "jpeg", "PNG"],
  },
});

const upload = multer({storage: storage});


foodRouter.post("/add",adminAuthMiddleware,upload.single("image"),addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",adminAuthMiddleware,removeFood);

export default foodRouter;