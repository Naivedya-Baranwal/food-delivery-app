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
        enum:["Pending","Food Processing","Out for delivery","Delivered"],
        default:"Pending"
    },
    date:{type:Date,default:Date.now()},
    assignment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"deliveryAssignment",
        default:null
    },
    payment:{type:Boolean,default:false},
    paymentMethod: { type: String, enum: ["Online", "COD"], default: "Online" },
    deliveryOTP: { type: String, default: null },
    otpExpiry: { type: Date, default: null }
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