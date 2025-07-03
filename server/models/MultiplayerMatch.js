import mongoose from "mongoose";
const playerResultScheme = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    wpm: { type: Number, required: true },
    accuracy: { type: Number, requried: true },
    charactersTyped: { type: Number },
  },
  { _id: false },
);

const multiplayerMatchSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true },
    category: {
      type: String,
      enum: ["classic", "time30"],
      required: true,
    },
    players: [playerResultSchema],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    rawText: { type: String },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const MultiplayerMatch = mongoose.model(
  "MultiplayerMatch",
  multiplayerMatchSchema,
);
