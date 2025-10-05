import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {type : String, required : true},
    email : {type : String , required : true, unique : true},
    phone : {type : String , required : true, unique : true},
    password : {type : String , required : true},
    cartData : {type : Object , default:{}},
    socketId: {type: String},
    isOnline:{type:Boolean},
},{minimize:false,timestamps:true});

const userModel = mongoose.model.user || mongoose.model("user",userSchema);

export default  userModel;




//old
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name : {type : String, required : true},
//     email : {type : String , required : true, unique : true},
//     password : {type : String , required : true},
//     cartData : {type : Object , default:{}}
// },{minimize:false});

// const userModel = mongoose.model.user || mongoose.model("user",userSchema);

// export default  userModel;