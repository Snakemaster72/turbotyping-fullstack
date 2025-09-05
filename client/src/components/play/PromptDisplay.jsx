import { useEffect, useRef, useState } from "react";

const PromptDisplay = ({ prompt, typedText, startTime, mode }) => {
  const containerRef = useRef(null);
  const spanRefs = useRef([]);
  const [offset, setOffset] = useState(0);
  const prevModeRef = useRef(mode);

  const text = prompt;

  useEffect(() => {
    if (prevModeRef.current !== mode) {
      setOffset(0);
    }
    prevModeRef.current = mode;

    const container = containerRef.current;
    const caretSpan = spanRefs.current[typedText.length];

    if (container && caretSpan) {
      const caretX = caretSpan.offsetLeft;
      const caretRight = caretX + caretSpan.offsetWidth;
      const containerWidth = container.offsetWidth;

      if (caretRight - offset > containerWidth * 0.6) {
        setOffset(caretRight - containerWidth * 0.6);
      }
    }
  }, [typedText]);

  if (!text) {
    return (
      <div className="relative overflow-hidden mb-6 bg-[#282828] rounded-lg border border-[#504945] p-6">
        <div className="text-[#928374] text-2xl">Loading prompt...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden mb-6 bg-[#282828] rounded-lg border border-[#504945]"
    >
      <div
        className="whitespace-pre font-mono text-2xl p-6 transition-transform duration-100 ease-out"
        style={{
          transform: `translateX(-${offset}px)`,
          fontFamily: "JetBrains Mono, monospace",
        }}
      >
        {text.split("").map((char, idx) => {
          let style = "";

          if (idx < typedText.length) {
            style =
              typedText[idx] === char
                ? "text-[#b8bb26]" // Gruvbox green for correct
                : "text-[#fb4934]"; // Gruvbox red for wrong
          } else if (idx === typedText.length) {
            style = "bg-[#504945] text-[#ebdbb2]"; // Gruvbox cursor
          } else {
            style = "text-[#ebdbb2]"; // Gruvbox light text for untyped
          }

          return (
            <span
              key={idx}
              ref={(el) => (spanRefs.current[idx] = el)}
              className={`${style}`}
            >
              {char}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default PromptDisplay;
