import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://naivedyab198:4nNSAwe9KAra7d0U@cluster0.ywbfp.mongodb.net/food-del').then(()=>console.log("DB Connected"));
