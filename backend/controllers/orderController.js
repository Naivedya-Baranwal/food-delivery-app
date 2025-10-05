import deliveryAgentModel from "../models/deliveryAgentModel.js";
import deliveryAssignmentModel from "../models/deliveryAssignmentModel.js";
import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe";
import { restaurant } from "../config/restaurant.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order for frontend
const placeOrder = async (req, res) => {
    const frontend_url = process.env.FRONTEND_URL;
    try {
      const {
        userId,
        items,
        amount,
        address,
        paymentMethod = "Online", 
      } = req.body;
  
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      const newOrder = new orderModel({
        userId,
        name:user.name,
        email:user.email,
        phone:user.phone,
        items,
        amount,
        address,
        payment: paymentMethod === "COD",
        paymentMethod,
      });
  
      await newOrder.save();
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
  
      if (paymentMethod === "COD") {
        return res.json({ success: true, cod: true, message: "Order placed with COD" });
      }
  
      const line_items = items.map((item) => ({
        price_data: {
          currency: "inr",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));
  
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Delivery Charges" },
          unit_amount: 20 * 100,
        },
        quantity: 1,
      });
  
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      });
  
      res.json({ success: true, session_url: session.url });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
    }
  };
  
const verifyOrder = async (req,res)=>{
    const {orderId,success} = req.body;
    try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"Paid"})
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not Paid"})
        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"});
    }
}

// user orders for frontend
const usersOrders = async (req,res) =>{
    try {
        const orders = await orderModel.find({userId:req.body.userId}).sort({ createdAt: -1 });;
        res.json({success:true,data:orders});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

// listing orders for admin panel
const listOrders = async (req,res) => {
     try {
        const orders = await orderModel.find({}).sort({ createdAt: -1 });
        res.json({success:true,data:orders});
     } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
     }
}

// api for updating the order status
const updateStatus = async (req,res) =>{
        try {
          const {orderId,status}=req.body;
            const order =await orderModel.findById(orderId);
            let availableDeliveryAgents=[];
            if(status==="Out for delivery" || !order.assignment){
              const {longitude,latitude}=order.address;
            const nearByDeliveryAgent = await deliveryAgentModel.find({
                    location: {
                      $near: {
                        $geometry: { type: 'Point', coordinates: [Number(longitude), Number(latitude)] },
                        $maxDistance: 5000
                      }
                    },
                    isOnline: true,
                    isAvailable: true
             });
            const candidates = nearByDeliveryAgent.map(d => d._id);
             if(candidates.length==0){
              await orderModel.findByIdAndUpdate(orderId,{status});
              return res.status(200).json({success:true,message:"Status Updated but delivery Agent not available"});
             }
             const deliveryAssignment =await deliveryAssignmentModel.create({
                  order : order._id,
                  pickup:{
                    name:restaurant.name,
                    address:restaurant.address,
                    latitude:restaurant.latitude,
                    longitude:restaurant.longitude
                  },
                  drop:{
                   address:order.address.location,
                   latitude:order.address.latitude,
                   longitude:order.address.longitude
                  },
                  broadCastedTo:candidates,
             })
             order.assignment=deliveryAssignment._id;
          }
        availableDeliveryAgents = nearByDeliveryAgents.map(agent => ({
        id: agent._id,
        name: agent.name,
        phone: agent.phone,
        latitude: agent.location.coordinates?.[0],
        longitude: agent.location.coordinates?.[1]
        }));

          order.status=status;
          await order.save();
          res.json({success:true,message:"Status Updated",availableDeliveryAgents})
        } catch (error) {
            console.log(error);
            res.json({success:false,message:"Error"});
        }

}

export {placeOrder,verifyOrder, usersOrders,listOrders,updateStatus}



//old
// import orderModel from "../models/orderModel.js";
// import userModel from '../models/userModel.js';
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// //placing user order for frontend
// const placeOrder = async (req, res) => {
//     const frontend_url = process.env.FRONTEND_URL;
    
//     try {
//       const {
//         userId,
//         items,
//         amount,
//         address,
//         paymentMethod = "Online", 
//       } = req.body;
  
//       const newOrder = new orderModel({
//         userId,
//         items,
//         amount,
//         address,
//         payment: paymentMethod === "COD", 
//         status:"Order Placed" ,
//         paymentMethod,
//       });
  
//       await newOrder.save();
//       await userModel.findByIdAndUpdate(userId, { cartData: {} });
  
//       if (paymentMethod === "COD") {
//         return res.json({ success: true, cod: true, message: "Order placed with COD" });
//       }
  
//       const line_items = items.map((item) => ({
//         price_data: {
//           currency: "inr",
//           product_data: { name: item.name },
//           unit_amount: item.price * 100,
//         },
//         quantity: item.quantity,
//       }));
  
//       line_items.push({
//         price_data: {
//           currency: "inr",
//           product_data: { name: "Delivery Charges" },
//           unit_amount: 20 * 100,
//         },
//         quantity: 1,
//       });
  
//       const session = await stripe.checkout.sessions.create({
//         line_items,
//         mode: "payment",
//         success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//         cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//       });
  
//       res.json({ success: true, session_url: session.url });
//     } catch (error) {
//       console.log(error);
//       res.json({ success: false, message: "Error" });
//     }
//   };
  
// const verifyOrder = async (req,res)=>{
//     const {orderId,success} = req.body;
//     try {
//         if(success=="true"){
//             await orderModel.findByIdAndUpdate(orderId,{payment:true});
//             res.json({success:true,message:"Paid"})
//         }
//         else {
//             await orderModel.findByIdAndDelete(orderId);
//             res.json({success:false,message:"Not Paid"})
//         }
//     } catch (error) {
//         console.log(error)
//         res.json({success:false,message:"Error"});
//     }
// }

// // user orders for frontend
// const usersOrders = async (req,res) =>{
//     try {
//         const orders = await orderModel.find({userId:req.body.userId}).sort({ createdAt: -1 });;
//         res.json({success:true,data:orders});
//     } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"});
//     }
// }

// // listing orders for admin panel
// const listOrders = async (req,res) => {
//      try {
//         const orders = await orderModel.find({}).sort({ createdAt: -1 });
//         res.json({success:true,data:orders});
//      } catch (error) {
//         console.log(error);
//         res.json({success:false,message:"Error"});
//      }
// }

// // api for updating the order status
// const updateStatus = async (req,res) =>{
//         try {
//             await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
//             res.json({success:true,message:"Status Updated"})
//         } catch (error) {
//             console.log(error);
//             res.json({success:false,message:"Error"});
//         }

// }

// export {placeOrder,verifyOrder, usersOrders,listOrders,updateStatus}
