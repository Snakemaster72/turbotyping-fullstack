import { useEffect, useRef, useState } from "react";

const TypingBox = ({
  onInput,
  onComplete,
  mode,
  wordCount,
  typedText,
  setTypedText,
  startTime,
  setStartTime,
  prompt,
}) => {
  const [currentWord, setCurrentWord] = useState("");
  const inputRef = useRef(null);
  const prevModeRef = useRef(mode);

  // Auto-focus input when component mounts
  useEffect(() => {
    if (prevModeRef.current !== mode) {
      // Reset state
      setTypedText("");
      setCurrentWord("");
      setStartTime(0);

      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }

      prevModeRef.current = mode; // Update ref to new mode
    }
  }, [mode]);

  const handleChange = (e) => {
    const value = e.target.value;
    const now = Date.now();

    // Detect the change (insert or delete)
    const diff = value.length - currentWord.length;
    // console.log(diff);
    //  console.log(value);

    if (!startTime) {
      console.log("test started");
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
    }

    //Deletion is ignored for now : will tackled later, won't be necessary for wpm
    else {
      // Deletion
      onInput({
        diff: diff,
        char: currentWord.slice(diff),
        type: "delete",
        time: (now - startTime) / 1000,
      });
    }

    setTypedText((prev) => (diff > 0 ? prev + newChar : prev.slice(0, diff)));
    setCurrentWord(value);
    const promptWords = prompt.slice(0, typedText.length).split(" ");
    const promptLastWord = promptWords[promptWords.length - 1];
    const lastInputWordArray = currentWord.split(" ");
    const lastInputWord = lastInputWordArray[lastInputWordArray.length - 1];
    // console.log("Last Word" + promptLastWord);

    if (newChar === " ") {
      if (lastInputWord === promptLastWord) setCurrentWord("");
    }
    console.log(typedText.length);
    console.log(prompt.length);

    // console.log(currentWord);
    if (mode.type === "count") {
      if (typedText.length + 1 >= prompt.length) {
        onComplete();
      }
    }
  };

  return (
    <div className="mt-6 h-min">
      <textarea
        ref={inputRef}
        value={currentWord}
        onChange={handleChange}
        placeholder={startTime ? "" : "Start Typing here..."}
        className="w-full border border-gray-300 rounded p-3 text-lg focus:outline-none"
        rows={1}
      />
    </div>
  );
};

export default TypingBox;
