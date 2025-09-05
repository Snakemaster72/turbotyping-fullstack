import { useState } from "react";

const ModeSelection = ({ onSelect }) => {
  const [selectedValue, setSelectedValue] = useState("timer_15");

  const options = [
    { label: "Timer", group: "timer", value: null, isHeader: true },
    { label: "15", group: "timer", value: "timer_15" },
    { label: "30", group: "timer", value: "timer_30" },
    { label: "60", group: "timer", value: "timer_60" },
    { label: "Count", group: "count", value: null, isHeader: true },
    { label: "10", group: "count", value: "count_10" },
    { label: "20", group: "count", value: "count_20" },
    { label: "50", group: "count", value: "count_50" },
  ];

  const selectedGroup = selectedValue.split("_")[0];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt, i) => {
        const isActive = opt.isHeader
          ? opt.group === selectedGroup
          : opt.value === selectedValue;

        if (opt.isHeader) {
          return (
            <span
              key={i}
              className={`text-xl font-bold mr-2 ${
                isActive ? "text-[#fe8019]" : "text-[#928374]"
              }`}
            >
              {opt.label}
            </span>
          );
        }

        return (
          <button
            key={i}
            onClick={() => {
              if (opt.value) {
                setSelectedValue(opt.value);
                onSelect(opt.value);
              }
            }}
            className={`
              px-4 py-2 text-lg font-medium rounded-lg transition-colors
              ${isActive 
                ? "bg-[#504945] text-[#ebdbb2]" 
                : "text-[#a89984] hover:bg-[#3c3836]"
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default ModeSelection;
