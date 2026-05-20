import React, { useState, useEffect } from "react";

const Console = ({
  output,
  executionStats,
  problem,
  testcaseResults,
  activeConsoleTab,
  setActiveConsoleTab,
}) => {
  const [selectedCase, setSelectedCase] = useState(0);

  useEffect(() => {
    setSelectedCase(0);
  }, [problem]);

  return (
    <div className="h-full bg-gray-900 border-t border-gray-700 flex flex-col">
      {/* Tabs Header */}
      <div className="flex items-center gap-1 px-4 pt-2 bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => setActiveConsoleTab("testcases")}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
            activeConsoleTab === "testcases"
              ? "bg-gray-900 text-gray-100"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
          }`}
        >
          Test Cases
        </button>

        <button
          onClick={() => setActiveConsoleTab("output")}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
            activeConsoleTab === "output"
              ? "bg-gray-900 text-green-400"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
          }`}
        >
          Output
        </button>

        <button
          onClick={() => setActiveConsoleTab("stats")}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
            activeConsoleTab === "stats"
              ? "bg-gray-900 text-blue-400"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
          }`}
        >
          Execution Stats
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
        {/* TESTCASES */}
        {activeConsoleTab === "testcases" && (
          <div className="space-y-4">
            {/* STATUS HEADER */}
            {output && output.includes("Status:") && (
              <div className="mb-2">
                <h3
                  className={`text-xl font-bold ${
                    output.includes("Status: Accepted")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {output.split("\n")[0].replace("Status: ", "")}
                </h3>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              {problem?.sampleTestCases?.map((tc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCase(idx)}
                  className={`px-3 py-1.5 rounded text-white text-sm font-medium transition-all ${
                    selectedCase === idx
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>Case {idx + 1}</span>

                    {testcaseResults[idx] && (
                      <span
                        className={`text-xs font-bold ${
                          testcaseResults[idx].passed
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {testcaseResults[idx].passed ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {problem?.sampleTestCases?.length > 0 && (
              <div className="space-y-3">
                {/* INPUT */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Input
                  </p>

                  <div className="bg-gray-800 p-3 rounded text-sm font-mono text-gray-300 whitespace-pre-wrap">
                    {problem.sampleTestCases[selectedCase]?.input}
                  </div>
                </div>

                {/* EXPECTED */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Expected Output
                  </p>

                  <div className="bg-gray-800 p-3 rounded text-sm font-mono text-gray-300 whitespace-pre-wrap">
                    {problem.sampleTestCases[selectedCase]?.output}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* OUTPUT */}
        {activeConsoleTab === "output" && (
          <div className="h-full">
            {output ? (
              <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 italic text-sm">
                Run your code to see output here.
              </div>
            )}
          </div>
        )}

        {/* STATS */}
        {activeConsoleTab === "stats" && (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            {executionStats ? (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-200 mb-1">
                    Success!
                  </h3>

                  <p className="text-sm text-green-400">
                    Passed {executionStats.testCasesPassed} test cases.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
                      Runtime
                    </p>

                    <p className="text-2xl font-mono text-blue-400">
                      {executionStats.time} ms
                    </p>
                  </div>

                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
                      Memory
                    </p>

                    <p className="text-2xl font-mono text-purple-400">
                      {executionStats.memory} MB
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-500 italic text-sm">
                Run your code to see execution statistics.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Console;
