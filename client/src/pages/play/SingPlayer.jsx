import axios from "axios";
import ModeSelection from "../../components/play/ModeSelection";
import TypingBox from "../../components/play/TypingBox";
import PromptDisplay from "../../components/play/PromptDisplay";
import ResultPage from "./ResultPage";
import { useState, useEffect, useRef } from "react";

import { GrPowerReset } from "react-icons/gr";
const SinglePlayer = () => {
  const [prompt, setPrompt] = useState("");
  const [inputLog, setInputLog] = useState([]); // rawText: {char, time, type}
  const [testStarted, setTestStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [testFinished, setTestFinished] = useState(false);
  const [result, setResult] = useState({}); // wpm, accuracy, etc.
  const [mode, setMode] = useState({ type: "timer", val: 15 }); // "word" or "timer"
  const [duration, setDuration] = useState(60); // timer mode: seconds
  const [wordCount, setWordCount] = useState(50); // word mode
  const [rawText, setRawText] = useState([]);
  const [typedText, setTypedText] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(false);
  const [error, setError] = useState(null);
  const [remaining, setRemaining] = useState(600);
  const [typingBoxkey, setTypingBoxKey] = useState(0);

  const intervalRef = useRef(null);
  const rawTextRef = useRef([]);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await axios.post("/api/typing", {
          testData: rawText,
          prompt: prompt,
        });

        console.log(response.data);
        setResult(response.data);
        console.log("result" + result);
      } catch (error) {
        console.log(error);
        setError(error.response?.data?.message || "Failed to load prompt");
      }
    };
    if (testFinished) fetchResult();
  }, [testFinished]);

  // Start countdown when startTime is set
  useEffect(() => {
    if (!startTime || mode.type === "count") return;
    setRemaining(mode.val);

    const endTime = startTime + mode.val * 1000; // 60s timer
    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
      setRemaining(remaining);

      if (remaining === 0) {
        clearInterval(intervalRef.current);
        handleComplete();
      }
    }, 250); // run every 1/4 second for accuracy

    return () => clearInterval(intervalRef.current);
  }, [startTime, mode]);
  useEffect(() => {
    setTypedText("");
    setRawText([]);
    rawTextRef.current = [];
    setStartTime(null);
    console.log(mode);
    setTestFinished(false);
    const fetchPrompt = async () => {
      try {
        setLoadingPrompt(true);
        setError(null);

        const res = await axios.get("/api/typing/prompt", {
          params:
            mode.type === "timer"
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
    setTestFinished(true);
    setStartTime(null);
    clearInterval(intervalRef.current); // 🔥 Stop timer
    console.log("Test Complete");
    console.log("Final rawText:", rawTextRef.current); // ✅ full data
  };

  const resetTest = () => {
    // 🧹 Stop the timer
    clearInterval(intervalRef.current);

    // 🧼 Reset test state
    setStartTime(null);
    setTestFinished(false);
    setTypedText("");
    setRawText([]);
    rawTextRef.current = [];
    setTypingBoxKey((prev) => prev + 1); // triggers full remount of TypingBox

    // ⏱ Reset timer display if in timer mode
    if (mode.type === "timer") {
      setRemaining(mode.val); // reset countdown to full duration
    }

    console.log("Test reset.");
  };

  return (
    <div className="flex flex-col justify-center items-center h-max w-full mt-20 ">
      <div className="w-7xl ">
        <h1 className="text-4xl">
          {" "}
          {startTime && mode.type === "timer"
            ? `${remaining} s`
            : "Start Typing...."}
        </h1>

        <ModeSelection
          onSelect={(selectedValue) => {
            const [type, val] = selectedValue.split("_");
            setMode({ type: type, val: val }); // "timer" or "count"
            if (type === "timer") setDuration(Number(val));
            else setWordCount(Number(val));
          }}
        />
      </div>
      <div>
        {testFinished ? (
          <ResultPage
            testFinished={testFinished}
            resetTest={() => resetTest()}
            resultData={result}
          />
        ) : (
          <>
            <PromptDisplay
              prompt={prompt}
              typedText={typedText}
              startTime={startTime}
              mode={mode}
            />
            <TypingBox
              prompt={prompt}
              mode={mode}
              typedText={typedText}
              setTypedText={setTypedText}
              startTime={startTime}
              setStartTime={setStartTime}
              wordCount={wordCount}
              onInput={(entry) => {
                rawTextRef.current.push(entry); // ✅ store all inputs
                setRawText([...rawTextRef.current]); // if you still need state for rendering
              }}
              onComplete={() => handleComplete()}
              key={typingBoxkey}
            />
          </>
        )}
      </div>
      <div
        className="mt-3 hover:bg-gray-200 p-2  rounded-full"
        onClick={() => resetTest()}
      >
        <GrPowerReset className="size-5" />
      </div>
    </div>
  );
};

export default SinglePlayer;
