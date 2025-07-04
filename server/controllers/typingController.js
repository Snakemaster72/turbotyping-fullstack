import { updateUserStats } from "../services/userStatsService.js"; //this is to update the average user data after every test
import { calculateWPM } from "../utils/calculateWPM.js";
import axios from "axios";
import asyncHandler from "express-async-handler";
import { word } from "../utils/wordData.js";
// POST /api/test
// PUBLIC
export const typingController = asyncHandler(async (req, res) => {
  const { testData, prompt } = req.body;
  if (!testData && !prompt) {
    res.status(400);
    throw new Error("Invalid request");
  }
  const { testType } = testData;
  const { rawWpm, wpm, accuracy, totalTime, typedChar } = calculateWPM(
    testData,
    prompt,
  );

  const user = req.user;

  if (user) {
    await updateUserStats(user, testType, wpm, accuracy);
  }
  if (rawWpm && wpm && accuracy && totalTime && typedChar) {
    res.send({
      rawWpm,
      wpm,
      accuracy,
      totalTime,
      typedChar,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Input");
  }
});

export const getPrompt = (req, res) => {
  const { type, difficulty, count, timer } = req.query;
  if (!timer && !count) {
    res.status(400);
    throw new Error("Invalid requrest");
  }
  if ((count && parseInt(count) < 0) || (timer && parseInt(timer) < 0)) {
    res.status(400);
    throw new Error("Invalid request");
  }
  const listCount = count ? parseInt(count, 10) : 400;
  let i = 0;
  let wordArray = [];
  while (i < listCount) {
    wordArray.push(word[Math.floor(Math.random() * word.length)]);
    i++;
  }
  const prompt = wordArray.join(" ");
  if (type === "classic") {
    if (prompt) {
      res.send({ prompt: prompt, count: wordArray.length });
    }
  } else {
    res.status(400);
    throw new Error("Invalid request");
  }
};
