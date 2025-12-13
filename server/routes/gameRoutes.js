import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getMyHistory, getLeaderboard } from '../controllers/gameController.js';

const router = express.Router();

// History route (protected - requires authentication)
router.get('/my-history', protect, getMyHistory);

// Leaderboard route (public)
router.get('/leaderboard', getLeaderboard);

export default router;
