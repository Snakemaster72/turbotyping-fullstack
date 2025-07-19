// utils/generatePrompt.js
import { word } from "../utils/wordData.js";

export function generatePrompt({ type, count }) {
  // use your logic to pick words
  //
  const listCount = count ? parseInt(count, 10) : 400;
  let i = 0;
  let wordArray = [];
  while (i < listCount) {
    wordArray.push(word[Math.floor(Math.random() * word.length)]);
    i++;
  }
  const prompt = wordArray.join(" ");
  return prompt;
}
