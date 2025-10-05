import jwt from "jsonwebtoken";

const authDelivery = async (req, res, next) => {
  const { token } = req.headers;
  
  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again" });
  }
  
  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.agentId = token_decode.id;
    next();
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

export default authDelivery;
