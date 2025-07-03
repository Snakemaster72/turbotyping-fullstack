import mongoose from "mongoose";

const typingTestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // the type tells it stores objectiDa defined object type in mongodb
    // ref means it will link to the user model

    // store the category of the test
    category: {
      type: String,
      enum: ["classic", "time15", "time30", "time60", "quote", "snippets"],
      required: true,
    },

    wpm: { type: Number, required: true },
    accuracy: { type: Number, required: true },
    duration: { type: Number, required: true }, //I don't know if I will need it for quotes and snippets
    charactersTyped: { type: Number },
    rawText: { type: String }, //for storing raw text
  },
  { timestamps: true },
);

export const TypingTest = mongoose.model("TypingTest", typingTestSchema);
