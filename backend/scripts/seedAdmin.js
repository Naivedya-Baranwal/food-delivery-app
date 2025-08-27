import bcrypt from "bcrypt";
import adminModel from "../models/adminModel.js";
import { connectDB } from "../config/db.js";

const seedAdmin = async () => {
    try {
        await connectDB();
        const existingAdmin = await adminModel.findOne({ email: "admin@gmail.com" });
        if (existingAdmin) {
            console.log("⚠️ Admin already exists");
            process.exit();
        }
        const hashedPassword = await bcrypt.hash("admin@123", 10);
        const admin = new adminModel({
            name: "Naivedya",
            email: "admin@gmail.com",
            password: hashedPassword,
        });
        await admin.save();
        console.log("✅ Admin created successfully");
        process.exit();
    } catch (err) {
        console.error("❌ Error seeding admin:", err);
        process.exit(1);
    }

}
seedAdmin();