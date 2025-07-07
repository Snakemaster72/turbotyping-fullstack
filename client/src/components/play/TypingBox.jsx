import { useEffect, useRef, useState } from "react";

const TypingBox = ({ onInput, onComplete, mode, wordCount, setTypedText }) => {
  const [currentWord, setCurrentWord] = useState("");
  const [startTime, setStartTime] = useState(0);
  const inputRef = useRef(null);

  // Auto-focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    const now = Date.now();

    // Detect the change (insert or delete)
    const diff = value.length - currentWord.length;
    console.log(diff);
    console.log(value);
    console.log(currentWord);

    if (!startTime) {
      setStartTime(now);
    }

    let newChar = null;
    if (diff > 0) {
      // Insertion
      newChar = value.slice(-1);
      onInput({
        char: newChar,
        type: "insert",
        time: (now - startTime) / 1000,
      });
    } else {
      // Deletion
      onInput({
        char: currentWord.slice(-1),
        type: "delete",
        time: (now - startTime) / 1000,
      });
    }

    setTypedText((prev) => (prev + diff > 0 ? newChar : currentWord.slice(-1)));

    if (newChar === " ") {
      setCurrentWord("");
    } else setCurrentWord(value);

    if (mode === "count") {
      const wordsTyped = value.trim().split(/\s+/).filter(Boolean).length;
      if (wordsTyped >= wordCount) {
        onComplete();
      }
    }
  };

  return (
    <div className="mt-6">
      <textarea
        ref={inputRef}
        value={currentWord}
        onChange={handleChange}
        placeholder="Start typing here..."
        className="w-full border border-gray-300 rounded p-3 text-lg focus:outline-none"
        rows={5}
      />
    </div>
  );
};

export default TypingBox;
