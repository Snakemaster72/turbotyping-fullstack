import axios from "axios";
import ModeSelection from "../../components/play/ModeSelection";
import TypingBox from "../../components/play/TypingBox";
import PromptDisplay from "../../components/play/PromptDisplay";
import { useState, useEffect } from "react";

const SinglePlayer = () => {
  const [prompt, setPrompt] = useState("");
  const [inputLog, setInputLog] = useState([]); // rawText: {char, time, type}
  const [testStarted, setTestStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [testFinished, setTestFinished] = useState(false);
  const [result, setResult] = useState(null); // wpm, accuracy, etc.
  const [mode, setMode] = useState("word"); // "word" or "timer"
  const [duration, setDuration] = useState(60); // timer mode: seconds
  const [wordCount, setWordCount] = useState(50); // word mode
  const [rawText, setRawText] = useState([]);
  const [typedText, setTypedText] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        setLoadingPrompt(true);
        setError(null);

        const res = await axios.get("/api/typing/prompt", {
          params:
            mode === "timer"
              ? { type: "classic", timer: duration }
              : { type: "classic", count: wordCount },
        });

        setPrompt(res.data.prompt);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load prompt");
      } finally {
        setLoadingPrompt(false);
      }
    };

    fetchPrompt();
  }, [mode, duration, wordCount]);

  const handleComplete = () => {
    console.log("Test Complete");
    console.log(rawText);
  };

  return (
    <div className="flex flex-col justify-center items-center h-max w-full m-20 ">
      <div className="w-7xl">
        <h1 className="text-4xl"> Start Typing.... </h1>
        <ModeSelection
          onSelect={(selectedValue) => {
            const [type, val] = selectedValue.split("_");
            setMode(type); // "timer" or "count"
            if (type === "timer") setDuration(Number(val));
            else setWordCount(Number(val));
          }}
        />
      </div>
      <div>
        <PromptDisplay prompt={prompt} typedText={typedText} />
        <TypingBox
          prompt={prompt}
          mode={mode}
          typedText={typedText}
          setTypedText={setTypedText}
          wordCount={wordCount}
          onInput={(entry) => {
            setRawText((prev) => [...prev, entry]);
            console.log(typedText);
          }}
          onComplete={() => handleComplete()}
        />
      </div>
    </div>
  );
};

export default SinglePlayer;
