import { useEffect, useRef, useState } from "react";

const PromptDisplay = ({ prompt, typedText }) => {
  const containerRef = useRef(null);
  const spanRefs = useRef([]);
  const [offset, setOffset] = useState(0);

  const text = prompt;

  useEffect(() => {
    const container = containerRef.current;
    const caretSpan = spanRefs.current[typedText.length];

    if (container && caretSpan) {
      const caretX = caretSpan.offsetLeft;
      const caretRight = caretX + caretSpan.offsetWidth;

      const containerWidth = container.offsetWidth;

      // Scroll left when caret exceeds 60% of container width
      if (caretRight - offset > containerWidth * 0.6) {
        setOffset(caretRight - containerWidth * 0.6);
      }
    }
  }, [typedText]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden border p-4 rounded bg-white shadow-inner h-[100px] w-full max-w-7xl"
    >
      <div
        className="whitespace-nowrap font-mono text-xl transition-transform duration-100 ease-out"
        style={{ transform: `translateX(-${offset}px)` }}
      >
        {text.split("").map((char, idx) => {
          let style = "";

          if (idx < typedText.length) {
            style = typedText[idx] === char ? "text-green-600" : "text-red-600";
          } else if (idx === typedText.length) {
            style = "bg-yellow-300"; // current character
          } else {
            style = "text-gray-400";
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
