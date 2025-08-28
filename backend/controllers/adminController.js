import adminModel from "../models/adminModel.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

// const login =async(req,res)=>{
//     const {email,password}=req.body;
//     try {
//         const admin = await adminModel.findOne({email});
//         if(!admin){
//            return res.status(400).json({success:false,message:'Invalid Credentials'});
//         }        
//         const isMatch = await bcrypt.compare(password,admin.password);
//         if(!isMatch){
//             return res.status(400).json({success:false,message:'Invalid Credentials'});
//         }
//         const token = createToken(admin._id);
//          const isProd = process.env.NODE_ENV === 'production';

//          res.cookie('token', token, {
//             httpOnly: true,
//             secure: isProd,               // secure only in prod
//             sameSite: isProd ? 'none' : 'lax', // 'none' for cross-site in prod, 'lax' for localhost
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//             path: '/',                    // ensure consistent path for delete
//         });
//          res.status(200).json({
//             success: true,
//             user: {
//                 id: admin._id,
//                 name: admin.name,
//                 email: admin.email,
//             },
//             message:'logged In successfully'
//         });
//     } catch (error) {
//          console.error('Login error:', error); // ✅ ADD: Log actual error
//         res.status(500).json({
//             success: false,
//             errors: { general: 'Login failed. Please try again.' }
//         });
//     }    

// }

const login = async(req,res) => {
    const {email,password} = req.body;
    try {
        const admin = await adminModel.findOne({email});
        if(!admin){
           return res.status(400).json({success:false,message:'Invalid Credentials'});
        }        
        const isMatch = await bcrypt.compare(password,admin.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:'Invalid Credentials'});
        }
        const token = createToken(admin._id);
        
        // ✅ Fixed cookie settings for Render
        if (process.env.NODE_ENV === 'production') {
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000,
                // ❌ Remove domain setting - let browser handle it
            });
        } else {
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
        }
        
        res.status(200).json({
            success: true,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
            },
            message:'logged In successfully'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            errors: { general: 'Login failed. Please try again.' }
        });
    }    
}

const createToken=(id)=>{
     return jwt.sign({id},process.env.JWT_SECRET)
}


// const logout = async(req,res)=>{
//        try {
     
//          const isProd = process.env.NODE_ENV === 'production';
//         res.clearCookie('token', {
//             httpOnly: true,
//             secure: isProd,
//             sameSite: isProd ? 'none' : 'lax',
//             path: '/',                   // must match the path used in login
//         });
//         res.status(200).json({
//             success: true,
//             message: "logged out successfully"
//         })
//     } catch (error) {
//         console.log(error);
//           res.status(500).json({ success: false, message: "logout failed" });
//     }
// }
const logout = async(req,res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });
        } else {
            res.clearCookie("token", {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
            });
        }
        
        res.status(200).json({
            success: true,
            message: "logged out successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
}



// const verifyAdmin = async (req, res) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({success: false, message: 'No token provided'});
//     }
    
//     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
//     const admin = await adminModel.findById(tokenDecode.id).select('-password');
    
//     if (!admin) {
//       return res.status(401).json({success: false, message: 'Admin not found'});
//     }
    
//     res.status(200).json({
//       success: true,
//       user: {
//         id: admin._id,
//         name: admin.name,
//         email: admin.email,
//       }
//     });
//   } catch (error) {
//     res.status(401).json({success: false, message: 'Invalid token'});
//   }
// };
const verifyAdmin = async (req, res) => {
  console.log('🍪 All cookies:', req.cookies);
  console.log('🔍 Token from cookies:', req.cookies.token);
  console.log('📍 Request headers:', req.headers.cookie);
  
  try {
    const token = req.cookies.token;
    if (!token) {
      console.log('❌ No token found in cookies');
      return res.status(401).json({success: false, message: 'No token provided'});
    }
    
    console.log('✅ Token found, verifying...');
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminModel.findById(tokenDecode.id).select('-password');
    
    if (!admin) {
      console.log('❌ Admin not found in database');
      return res.status(401).json({success: false, message: 'Admin not found'});
    }
    
    console.log('✅ Admin verified successfully:', admin.email);
    res.status(200).json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      }
    });
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    res.status(401).json({success: false, message: 'Invalid token'});
  }
};

export { login, logout, verifyAdmin }