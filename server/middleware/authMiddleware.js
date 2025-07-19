import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js"; // Adjust the path to your user model

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Get user from the token and attach to request object
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      next(); // Move to the next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };
