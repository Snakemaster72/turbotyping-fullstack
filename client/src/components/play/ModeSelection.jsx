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
    <div className="flex flex-row rounded-t-2xl border border-black w-min mt-10">
      {options.map((opt, i) => {
        const isActive = opt.isHeader
          ? opt.group === selectedGroup
          : opt.value === selectedValue;

        return (
          <button
            key={i}
            onClick={() => {
              if (opt.value) {
                setSelectedValue(opt.value);
                onSelect(opt.value); // notify parent
              }
            }}
            className={`text-2xl p-2 border-r border-black hover:bg-yellow-50 ${isActive ? "bg-yellow-100" : ""
              }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default ModeSelection;
