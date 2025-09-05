import { HiArrowRight } from "react-icons/hi";

const ResultPage = ({ testFinished, resetTest, resultData }) => {
  const { rawWpm, wpm, accuracy, totalTime, typedChar } = resultData;
  
  return (
    <>
      {/* Dark blurry background */}
      <div className="fixed inset-0 bg-[#1d2021]/90 backdrop-blur-md z-40"></div>

      {/* Modal container */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-50 p-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
        <div className="bg-[#282828] p-8 rounded-lg border-2 border-[#504945] w-[90%] max-w-4xl">
          {/* Header */}
          <h2 className="text-4xl font-bold mb-8 text-[#fe8019]">
            Test Complete!
          </h2>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Primary Stats */}
            <div className="space-y-8">
              <div className="text-center p-6 bg-[#1d2021] rounded-lg border-2 border-[#504945]">
                <h3 className="text-xl font-semibold text-[#ebdbb2] mb-2">WPM</h3>
                <p className="text-5xl font-bold text-[#b8bb26]">
                  {wpm}
                </p>
              </div>
              <div className="text-center p-6 bg-[#1d2021] rounded-lg border-2 border-[#504945]">
                <h3 className="text-xl font-semibold text-[#ebdbb2] mb-2">Accuracy</h3>
                <p className="text-5xl font-bold text-[#8ec07c]">
                  {accuracy}%
                </p>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 gap-4">
              <div className="p-6 bg-[#1d2021] rounded-lg border-2 border-[#504945]">
                <h3 className="text-lg font-semibold text-[#ebdbb2] mb-1">Raw WPM</h3>
                <p className="text-3xl font-bold text-[#fabd2f]">{rawWpm}</p>
              </div>
              <div className="p-6 bg-[#1d2021] rounded-lg border-2 border-[#504945]">
                <h3 className="text-lg font-semibold text-[#ebdbb2] mb-1">Time</h3>
                <p className="text-3xl font-bold text-[#83a598]">{totalTime}s</p>
              </div>
              <div className="p-6 bg-[#1d2021] rounded-lg border-2 border-[#504945]">
                <h3 className="text-lg font-semibold text-[#ebdbb2] mb-1">Characters</h3>
                <p className="text-3xl font-bold text-[#d3869b]">{typedChar}</p>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => resetTest()}
              className="px-8 py-4 text-xl font-bold bg-[#504945] text-[#ebdbb2] rounded-lg hover:bg-[#665c54] transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => resetTest(true)}
              className="px-8 py-4 text-xl font-bold bg-[#504945] text-[#ebdbb2] rounded-lg hover:bg-[#665c54] transition-colors flex items-center gap-2"
            >
              Next Test
              <HiArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultPage;
