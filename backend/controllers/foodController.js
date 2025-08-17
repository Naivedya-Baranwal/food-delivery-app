import { error } from "console";
import foodModel from "../models/foodModel.js";
// import fs from 'fs'; 
import cloudinary from "../config/cloudinary.js";

// add food item
const addFood = async (req,res) =>{

    // let image_filename = `${req.file.filename}`;
    console.log(req.body);
    const food = new foodModel({
        name:req.body.name,
        description : req.body.description,
        price : req.body.price,
        category : req.body.category,
        image : req.file.path
    })

    try{
        await food.save();
          console.log("Saved food with image URL:", req.file.path);
        res.json({success:true,message:"Food Added"})
    } catch{
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

//all food list 
const listFood = async (req,res)=>{
    try{
        const foods = await foodModel.find({});
        res.json({success:true,data:foods});
    } catch{
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

//remove food item
const removeFood = async (req,res)=>{
    try{
        const food = await  foodModel.findById(req.body.id);
        // fs.unlink(`uploads/${food.image}`,()=>{})
        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }
    const publicId = food.image.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`foodImages/${publicId}`);

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food Removed"});
    } catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export {addFood,listFood,removeFood}
