import asyncHandler from "express-async-handler";

// middleware/optionalAuth.js
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (err) {
      // Don't throw error — just continue without req.user
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
});
