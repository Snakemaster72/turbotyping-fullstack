import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js"; // Adjust the path to your user model

const protect = asyncHandler(async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        // Token was valid but the user was deleted from the DB
        return res.status(401).json({ error: "USER_NOT_FOUND", message: "User not found." });
      }

      return next();
    } catch (error) {
      // Distinguish expired tokens from completely invalid ones so the
      // frontend can decide whether to show "session expired" vs a generic error
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "TOKEN_EXPIRED", message: "Your session has expired. Please log in again." });
      }
      // JsonWebTokenError, NotBeforeError, or anything else
      return res.status(401).json({ error: "TOKEN_INVALID", message: "Invalid token." });
    }
  }

  // No Bearer token present in the request at all
  return res.status(401).json({ error: "TOKEN_MISSING", message: "Not authorized, no token." });
});

export { protect };
