import { word } from "../utils/wordData.js";

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
