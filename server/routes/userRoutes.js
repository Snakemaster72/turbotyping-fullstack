import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
import {
  registerUser,
  loginUser,
  getMe,
  verifyEmail,
} from "../controllers/userController.js";

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/verify-email/:token", verifyEmail);

export default router;
