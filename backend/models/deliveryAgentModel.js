import mongoose from "mongoose";

const deliveryAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  location:{
        type:{type:String,enum:['Point'],default:'Point'},
        coordinates:{type:[Number],default:[0,0]}
  },
  isAvailable: { type: Boolean, default: true },
  isOnline: { type: Boolean, default: false },
  currentOrderId: { type: String, default: null },
  todayDeliveries: { type: Number, default: 0 },
  totalDeliveries: { type: Number, default: 0 }
}, { timestamps: true });

deliveryAgentSchema.index({ location: '2dsphere' });

const deliveryAgentModel = mongoose.models.deliveryAgent || 
  mongoose.model("deliveryAgent", deliveryAgentSchema);

export default deliveryAgentModel;
