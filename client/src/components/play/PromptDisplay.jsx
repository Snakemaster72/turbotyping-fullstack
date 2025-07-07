const PromptDisplay = ({ prompt, typedText }) => {
  const characters = prompt.split("");

  return (
    <div className="text-xl font-mono leading-8 flex flex-wrap border p-4 rounded bg-white shadow-inner min-h-[120px]">
      {characters.map((char, idx) => {
        let style = "";

        if (idx < typedText.length) {
          style = typedText[idx] === char ? "text-green-600" : "text-red-600";
        } else if (idx === typedText.length) {
          style = "bg-yellow-300"; // current character
        } else {
          style = "text-gray-400";
        }

        return (
          <span key={idx} className={`${style} whitespace-pre`}>
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default PromptDisplay;
