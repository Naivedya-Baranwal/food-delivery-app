// models/deliveryAssignmentModel.js
import mongoose from "mongoose";

const deliveryAssignmentModelSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "order",
    required: true
  },
  pickup: {
    name: String,
    address: String,
    latitude: Number,
    longitude: Number
  },
  drop: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deliveryAgent",
    default:null
  },
  broadCastedTo:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"deliveryAgent"
  }],
  status: {
    type: String,
    enum: ["broadcasted","Assigned", "Picked Up", "Delivered"],
    default: "broadcasted"
  },
  acceptedAt:{
    type:Date,
    default:null
  },
  estimatedDeliveryTime: { type: Date, default: null }, 
  deliveredAt: { type: Date, default: null }  
}, { timestamps: true });

const deliveryAssignmentModel =
  mongoose.models.deliveryAssignment ||
  mongoose.model("deliveryAssignment", deliveryAssignmentModelSchema);

export default deliveryAssignmentModel;
