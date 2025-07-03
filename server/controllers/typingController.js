import updateUserStats from "../services/userStatsService.js"; //this is to update the average user data after every test
import { calculateWPM } from "../utils/calculateWPM.js";
import axios from 'axios'

export const typingController = (req, res) => {
  const rawText = req.body;
};



export const getPrompt = (req, res) => {
  { type, difficulty, count } = req.body;
  if (type === quotes) {

  }

}
