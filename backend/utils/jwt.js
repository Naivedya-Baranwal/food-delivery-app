// utils/jwt.js
import jwt from "jsonwebtoken";

export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id; // return userId
    } catch (err) {
        console.log("Invalid token:", err.message);
        return null;
    }
};
