import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";

export const updateUserStats = asyncHandler(
  async (userId, testType, wpm, accuracy) => {
    //get user moder/data
    //get typing test data
    //update user stats

    const user = await User.findById(userId);
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    const stats = user.categoryStats[testType] || {
      wpmAvg: 0,
      accuracyAvg: 0,
      totalTests: 0,
      bestWPM: 0,
      bestAccuracy: 0,
    };
    const { wpmAvg, accuracyAvg, totalTests, bestWPM, bestAccuracy } = stats;
    const newTotal = totalTests + 1;
    const newWpmAvg = (wpmAvg * totalTests + wpm) / newTotal;
    const newAccuracyAvg = (accuracyAvg * totalTests + accuracy) / newTotal;
    const newBestWpm = Math.max(bestWPM || 0, wpm);
    const newBestAccuracy = Math.max(bestAccuracy || 0, accuracy);

    user.categoryStats[testType] = {
      wpmAvg: newWpmAvg,
      accuracyAvg: newAccuracyAvg,
      totalTests: newTotal,
      bestWPM: newBestWpm,
      bestAccuracy: newBestAccuracy,
    };
    user.save();
  },
);
