const ResultPage = ({ testFinished, resetTest, resultData }) => {
  const { rawWpm, wpm, accuracy, totalTime, typedChar } = resultData;
  return (
    <>
      {/* Dark blurry background */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"></div>

      {/* Modal container */}
      <div className="fixed inset-0 flex flex-col items-center justify-center z-50 ">
        <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-7xl flex flex-col justify-between">
          {/* Header */}
          <h2 className="text-2xl font-bold mb-4 ">Typing Test Result</h2>

          <div className="flex flex-row mt-5 justify-between">
            {/* Stats Section */}
            <div className="flex flex-col gap-4 text-center ml-20 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">WPM</h3>
                <p className="text-2xl font-bold text-blue-600">{wpm}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Raw WPM</h3>
                <p className="text-2xl font-bold text-blue-600">{rawWpm}</p>
              </div>
            </div>

            {/* Graph Section */}
            <div className="bg-gray-100 rounded-lg p-4 h-60 mr-20 mb-6">
              <h4 className="text-center text-gray-600 mb-2">
                Performance Over Time
              </h4>
              {/* Replace this with your actual chart (e.g. Recharts, Chart.js, etc.) */}
              <div className="w-full h-full flex items-center justify-center text-gray-400 italic">
                [Graph Placeholder]
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-around mb-10">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Accuracy</h3>
              <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Time</h3>
              <p className="text-2xl font-bold text-purple-600">
                {totalTime} s
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Total Chars
              </h3>
              <p className="text-2xl font-bold text-orange-600">{typedChar}</p>
            </div>
          </div>

          {/* Footer Button */}
          <div className="flex justify-center">
            <button
              onClick={() => resetTest()}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultPage;
