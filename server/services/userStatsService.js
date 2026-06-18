import { User } from "../models/userModel.js";

export const updateUserStats = async (user, testType, wpm, accuracy) => {
  const stats = user.categoryStats[testType] || {
    wpmAvg: 0,
    accuracyAvg: 0,
    totalTests: 0,
    bestWPM: 0,
    bestAccuracy: 0,
  };

  const newTotal = stats.totalTests + 1;

  user.categoryStats[testType] = {
    wpmAvg: (stats.wpmAvg * stats.totalTests + wpm) / newTotal,
    accuracyAvg: (stats.accuracyAvg * stats.totalTests + accuracy) / newTotal,
    totalTests: newTotal,
    bestWPM: Math.max(stats.bestWPM || 0, wpm),
    bestAccuracy: Math.max(stats.bestAccuracy || 0, accuracy),
  };

  user.markModified('categoryStats');
  await user.save();
};
