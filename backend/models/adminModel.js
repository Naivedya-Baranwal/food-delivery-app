import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    socketId: { type: String, default: null },   
    isOnline: { type: Boolean, default: false }
}, { timestamps: true });

const adminModel = mongoose.model.admin || mongoose.model('admin', adminSchema);

export default adminModel;