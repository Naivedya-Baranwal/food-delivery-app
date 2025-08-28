
import jwt from "jsonwebtoken"

const adminAuthMiddleware = async(req,res,next) => {
    const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
    if(!token){
        return res.status(400).json({success:false,message:"You are unauthorized"});
    }
    try {
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
         console.log('✅ Token verified successfully:', tokenDecode);
        req.adminId = tokenDecode.id;
        req.token = token; 
        next();
    } catch (error) {
        console.log('❌ Token verification failed:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid token. Please login again.'
        });
    }
    
}

export default adminAuthMiddleware

// import jwt from "jsonwebtoken"

// const adminAuthMiddleware = async(req,res,next) => {
//     const token = req.cookies.token;
//     if(!token){
//         return res.status(400).json({success:false,message:"You are unauthorized"});
//     }
//     try {
//         const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
//          console.log('✅ Token verified successfully:', tokenDecode);
//         req.adminId = tokenDecode.id;
//         next();
//     } catch (error) {
//         console.log('❌ Token verification failed:', error.message);
//         return res.status(401).json({
//             success: false,
//             message: 'Invalid token. Please login again.'
//         });
//     }
    
// }

// export default adminAuthMiddleware