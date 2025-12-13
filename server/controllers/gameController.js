import asyncHandler from 'express-async-handler';
import { GameResult } from '../models/gameResultModel.js';

// @desc    Get user's game history
// @route   GET /api/games/my-history
// @access  Private
export const getMyHistory = asyncHandler(async (req, res) => {
  const history = await GameResult.find({ user: req.user.id })
    .sort({ createdAt: -1 }) // Most recent first
    .lean();
  
  res.status(200).json(history);
});

// @desc    Get leaderboard
// @route   GET /api/games/leaderboard
// @access  Public
export const getLeaderboard = asyncHandler(async (req, res) => {
  const leaderboard = await GameResult.find()
    .sort({ wpm: -1 }) // Highest WPM first
    .limit(10)
    .populate('user', 'username')
    .lean();
  
  res.status(200).json(leaderboard);
});
