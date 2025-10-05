import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/FoodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import adminRouter from "./routes/adminRoute.js";
import http from "http";
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";
import deliveryRouter from "./routes/deliveryRoute.js";

// app config
const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})
app.set("socketio",io);

const port = process.env.PORT || 4000;


// middleware
app.use(express.json());

app.use(cors());
socketHandler(io);
// db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter);
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order",orderRouter);
app.use("/api/admin",adminRouter);
app.use("/api/delivery",deliveryRouter);

app.get("/",(req,res)=>{
    res.send("working correctly");
})

server.listen(port,()=>{
    console.log(`Server listening to http://localhost:${port}`)
})




//old
// import express from "express"
// import cors from "cors"
// import { connectDB } from "./config/db.js"
// import foodRouter from "./routes/FoodRoute.js";
// import userRouter from "./routes/userRoute.js";
// import 'dotenv/config'
// import cartRouter from "./routes/cartRoute.js";
// import orderRouter from "./routes/orderRoute.js";
// import adminRouter from "./routes/adminRoute.js";
// import http from "http";
// // import cookieParser from 'cookie-parser';

// // app config
// const app = express();
// const server = http.createServer(app);

// const port = process.env.PORT || 4000;


// // middleware
// app.use(express.json());

// // // ✅ allowlist of frontend domains
// // const allowlist = [
// //   "http://localhost:5173", // admin frontend
// //   "http://localhost:5174", // user frontend
// //   "https://food-delivery-app-frontend-rzxm.onrender.com",
// //   "https://food-delivery-app-admin-58ts.onrender.com",
// // ];
// // app.use(cookieParser());
// // app.use(
// //   cors({
// //     origin: (origin, cb) => {
// //       // Allow Postman/cURL (no origin header)
// //       if (!origin) return cb(null, true);

// //       if (allowlist.includes(origin)) {
// //         return cb(null, true); // allow specific origins
// //       }
// //      return cb(new Error("Not allowed by CORS")); // block everything else
// //     },
// //     credentials: true, // allow cookies
// //   })
// // );
// app.use(cors());

// // db connection
// connectDB();

// // api endpoints
// app.use("/api/food",foodRouter);
// app.use("/api/user",userRouter);
// app.use("/api/cart",cartRouter);
// app.use("/api/order",orderRouter);
// app.use("/api/admin",adminRouter);

// app.get("/",(req,res)=>{
//     res.send("working correctly");
// })

// server.listen(port,()=>{
//     console.log(`Server listening to http://localhost:${port}`)
// })



