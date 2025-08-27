import adminModel from "../models/adminModel.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

const login =async(req,res)=>{
    const {email,password}=req.body;
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
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
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
         console.error('Login error:', error); // ✅ ADD: Log actual error
        res.status(500).json({
            success: false,
            errors: { general: 'Login failed. Please try again.' }
        });
    }    

}

const createToken=(id)=>{
     return jwt.sign({id},process.env.JWT_SECRET)
}


const logout = async(req,res)=>{
       try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        })
        res.status(200).json({
            success: true,
            message: "logged out successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

const verifyAdmin = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({success: false, message: 'No token provided'});
    }
    
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminModel.findById(tokenDecode.id).select('-password');
    
    if (!admin) {
      return res.status(401).json({success: false, message: 'Admin not found'});
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      }
    });
  } catch (error) {
    res.status(401).json({success: false, message: 'Invalid token'});
  }
};

export { login, logout, verifyAdmin }