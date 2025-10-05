import deliveryAgentModel from "../models/deliveryAgentModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import validator from "validator"

//login delivery agent
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const agent = await deliveryAgentModel.findOne({ email });
    if (!agent) return res.json({ success: false, message: "Agent not found" });
    
    if (!bcrypt.compare(password, agent.password)) {
      return res.json({ success: false, message: "Invalid password" });
    }
    // Update agent status to online
    await deliveryAgentModel.findByIdAndUpdate(agent._id, {isOnline: true});

    const token = createToken(agent._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const createToken=(id)=>{
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
      });
}

//register deliveryAgent
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
     const exists = await deliveryAgentModel.findOne({email});
        if(exists)return res.json({success:false,message:"Agent already exists"})
        
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please enter a valid email"})
        }
        if(!validator.isMobilePhone(phone)){
            return res.json({success:false,message:"Please enter a valid phone number"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Please enter a strong password"})
        }
     const salt = await bcrypt.genSalt(10) 
     const hashedPassword = await bcrypt.hash(password,salt);
     const agent = new deliveryAgentModel({
      name,
      email,
      phone,
      password: hashedPassword
    });
    await agent.save();
    res.json({ success: true, message: "Agent registered" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// Update location
const updateAgentLocation = async (req, res) => {
  try {
    const {lat,lon,agentId} = req.body;
    const agent = await deliveryAgentModel.findById(agentId);
    if(!agent){
        return res.json({success:false,message:"Agent not found"})
    }
    await deliveryAgentModel.findByIdAndUpdate(agent._id,{
        location:{
            type:'Point',
            coordinates:[lon,lat]
        }
    }, {new :true})
    return res.status(200).json({success:true,message:"Location updated"})
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  login,
  register,
  updateAgentLocation
};
