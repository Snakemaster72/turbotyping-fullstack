import mongoose from 'mongoose';

const gameResultSchema = new mongoose.Schema({
   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // the type tells it stores objectiDa defined object type in mongodb
    // ref means it will link to the user model

    // store the category of the test
    category: {
      mode: {
      type: String,
      enum: ["classic", "time15", "time30", "time60", "quote", "snippets"],
      required: true,
      },
        duration: Number, // in seconds, for time-based modes   
        wordCount: Number, // for word-count-based modes
    },

    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    duration: { type: Number, required: true }, //I don't know if I will need it for quotes and snippets
    charactersTyped: { type: Number },
    rawText: { type: String }, //for storing raw text
  },
  { timestamps: true }
);

export const GameResult = mongoose.model('GameResult', gameResultSchema);
