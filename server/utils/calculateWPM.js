export const calculateWPM = (rawText, prompt) => {
  if (!rawText.length) {
    return {
      wpm: 0,
      rawWpm: 0,
      accuracy: 0,
      totalTime: 0,
      typedChar: 0,
    };
  }
  let inputText = "";
  for (let i of rawText) {
    if (i.type === "insert") inputText += i.char;
    else if (i.type === "delete") inputText = inputText.slice(0, -1);
  }
  const typedChar = inputText.length;
  let correctChars = 0;
  for (let i = 0; i < Math.min(inputText.length, prompt.length); i++) {
    if (prompt[i] === inputText[i]) correctChars++;
  }
  const totalTime = rawText[rawText.length - 1].time;
  const durationMinutes = totalTime / 60000;

  const rawWpm = typedChar / 5 / totalTime;
  const wpm = correctChars / 5 / totalTime;
  const accuracy = typedChar === 0 ? 0 : (correctChars / typedChard) * 100;
  return {
    rawWpm,
    wpm,
    accuracy,
    totalTime,
    typedChar,
  };
};
