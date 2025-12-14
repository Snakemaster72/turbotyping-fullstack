import axios from "axios";
import ModeSelection from "../../components/play/ModeSelection";
import TypingBox from "../../components/play/TypingBox";
import PromptDisplay from "../../components/play/PromptDisplay";
import ResultPage from "./ResultPage";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { GrPowerReset } from "react-icons/gr";
import axiosInstance from "../../utils/axiosConfig";
const SinglePlayer = () => {
  const { theme } = useTheme();
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

  const [reset, setReset] = useState(false);
  const intervalRef = useRef(null);
  const rawTextRef = useRef([]);

  useEffect(() => {
    const fetchResult = async () => {
      try {
      const response = await axiosInstance.post("/api/test", {
          testType: mode.type + mode.val,
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

        const res = await axiosInstance.get("/api/test/prompt", {
          params:
            mode.type === "timer"
              ? { type: "classic", timer: duration ,_nocache: Date.now() }
              : { type: "classic", count: wordCount , _nocache: Date.now()},
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
  }, [mode, duration, wordCount, reset]);

  const handleComplete = () => {
    setTestFinished(true);
    setStartTime(null);
    clearInterval(intervalRef.current); // 🔥 Stop timer
    console.log("Test Complete");
    console.log("Final rawText:", rawTextRef.current); // ✅ full data
  };

  const resetTest = (newPrompt = false) => {
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

    // If newPrompt is true, force a new prompt by updating the mode
    if (newPrompt) {
      setMode(prev => ({...prev, val: prev.val})); // This will trigger useEffect to fetch new prompt
    }

    console.log("Test reset.");
  };

  return (
    <div 
      className="flex flex-col justify-start items-center min-h-screen w-full font-jetbrains" 
      style={{ 
        fontFamily: 'JetBrains Mono, monospace',
        backgroundColor: theme.bg,
        color: theme.text
      }}
    >
      <div className="w-full max-w-4xl px-4 mt-16">
        {/* Timer/Status Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-6xl font-bold" style={{ color: theme.primary }}>
            {startTime && mode.type === "timer" ? `${remaining}s` : "Ready"}
          </h1>
          <button 
            onClick={() => {resetTest(); setReset(!reset)}}
            className="p-4 rounded-lg transition-colors cursor-pointer"
            style={{ 
              color: theme.textSoft,
              backgroundColor: theme.bgSoft
            }}
          >
            <GrPowerReset className="size-6" />
          </button>
        </div>

        {/* Mode Selection */}
        <div className="mb-8">
          <ModeSelection
            onSelect={(selectedValue) => {
              const [type, val] = selectedValue.split("_");
              setMode({ type, val });
              if (type === "timer") setDuration(Number(val));
              else setWordCount(Number(val));
            }}
          />
        </div>
      </div>

      <div className="w-full max-w-4xl px-4">
        {testFinished ? (
          <ResultPage
            testFinished={testFinished}
            resetTest={resetTest}
            resultData={result}
          />
        ) : (
          <div 
            className="rounded-lg p-8 border-2" 
            style={{ 
              backgroundColor: theme.bgDark,
              borderColor: theme.border
            }}
          >
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
                rawTextRef.current.push(entry);
                setRawText([...rawTextRef.current]);
              }}
              onComplete={handleComplete}
              key={typingBoxkey}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePlayer;
