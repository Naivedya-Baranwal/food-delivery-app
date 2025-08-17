import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const foodRouter = express.Router();

//Image Storage Engine

// const storage = multer.diskStorage({
//     destination:"uploads",
//     filename:(req,file,cb)=>{
//         return cb(null,`${Date.now()}${file.originalname}`)
//     }
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "foodImages",  
    allowed_formats: ["jpg", "png", "jpeg", "PNG"],
  },
});

const upload = multer({storage: storage});


foodRouter.post("/add",upload.single("image"),addFood);
foodRouter.get("/list",listFood);
foodRouter.post("/remove",removeFood);

export default foodRouter;