import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    items:{type:Array,required:true},
    amount:{type:Number,required:true},
    address:{type:Object,required:true},
    status:{
        type:String,
        enum:["Pending","Food Processing","Out for delivery","Assigned","Delivered"],
        default:"Pending"
    },
    date:{type:Date,default:Date.now()},
    assignment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"deliveryAssignment",
        default:null
    },
    assignedDeliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deliveryAgent",
    default:null
  },
  acceptedAt:{
    type:Date,
    default:null
  },
  deliveredAt:{
    type:Date,
    default:null
  },
    payment:{type:Boolean,default:false},
    paymentMethod: { type: String, enum: ["Online", "COD"], default: "Online" },
    deliveryOtp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    availableAgents: {
      type: Array,
      default: []
    }
},{ timestamps: true })

const orderModel = mongoose.models.order || mongoose.model("order",orderSchema);
export default orderModel;

//old
// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//     userId:{type:String,required:true},
//     items:{type:Array,required:true},
//     amount:{type:Number,required:true},
//     address:{type:Object,required:true},
//     status:{type:String,default:"Food Processing"},
//     date:{type:Date,default:Date.now()},
//     payment:{type:Boolean,default:false},
//     paymentMethod: { type: String, enum: ["Online", "COD"], default: "Online" } 
// },{ timestamps: true })

// const orderModel = mongoose.models.order || mongoose.model("order",orderSchema);
// export default orderModel;