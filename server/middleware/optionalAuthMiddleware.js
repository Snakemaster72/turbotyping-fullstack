import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

// middleware/optionalAuth.js
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('Auth Header:', authHeader);
  
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      console.log('Token found:', token ? 'yes' : 'no');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);
      
      const user = await User.findById(decoded.id).select("-password");
      console.log('User found:', user ? 'yes' : 'no');
      
      req.user = user;
    } catch (err) {
      // Don't throw error — just continue without req.user
      console.error('Auth error:', err.message);
      req.user = null;
    }
  } else {
    console.log('No auth header or not Bearer');
    req.user = null;
  }

  next();
});
