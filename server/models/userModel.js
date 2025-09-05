// models/User.js
import mongoose from "mongoose";

const categoryStatsSchema = new mongoose.Schema(
  {
    wpmAvg: { type: Number, default: 0 },
    accuracyAvg: { type: Number, default: 0 },
    totalTests: { type: Number, default: 0 },
    bestWPM: { type: Number, default: 0 },
    bestAccuracy: { type: Number, default: 0 },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,

    categoryStats: {
      count50: { type: categoryStatsSchema, default: () => ({}) },
      count100: { type: categoryStatsSchema, default: () => ({}) },
      count200: { type: categoryStatsSchema, default: () => ({}) },
      time15: { type: categoryStatsSchema, default: () => ({}) },
      time30: { type: categoryStatsSchema, default: () => ({}) },
      time60: { type: categoryStatsSchema, default: () => ({}) },
      quote: { type: categoryStatsSchema, default: () => ({}) },
      snippets: { type: categoryStatsSchema, default: () => ({}) },
    },

    completedTests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "TypingTest" },
    ],
    completedMatches: [
      { type: mongoose.Schema.Types.ObjectId, ref: "MultiplayerMatch" },
    ],

    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastLogin: { type: Date },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
