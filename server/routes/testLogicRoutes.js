import express from "express";

const router = express.Router();

import {
  getPrompt,
  typingController,
} from "../controllers/typingController.js";
import { optionalAuth } from "../middleware/optionalAuthMiddleware.js";

router.post("/",optionalAuth, typingController);
router.get("/prompt",  optionalAuth, getPrompt);

export default router;
