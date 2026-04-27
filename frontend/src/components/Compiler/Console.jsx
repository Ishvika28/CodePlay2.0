import React, { useState, useEffect } from 'react';

const Console = ({ output, executionStats, problem }) => {
  const [activeTab, setActiveTab] = useState('testcases');

  useEffect(() => {
    if (executionStats) {
      setActiveTab('testcases');
    }
  }, [executionStats]);

  return (
    <div className="h-full bg-gray-900 border-t border-gray-700 flex flex-col">
      {/* Tabs Header */}
      <div className="flex items-center gap-1 px-4 pt-2 bg-gray-800 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('testcases')}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
            activeTab === 'testcases' ? 'bg-gray-900 text-gray-100' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          Test Cases
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
            activeTab === 'output' ? 'bg-gray-900 text-green-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          Output
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
            activeTab === 'stats' ? 'bg-gray-900 text-blue-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
          }`}
        >
          Execution Stats
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
        {activeTab === 'testcases' && (
          <div className="space-y-4">
            
            {/* Dynamic Status Header */}
            {output && output.includes("Status:") && (
              <div className="mb-2">
                <h3 className={`text-xl font-bold ${output.includes("Status: Accepted") ? "text-green-500" : "text-red-500"}`}>
                  {output.split('\n')[0].replace("Status: ", "")}
                </h3>
              </div>
            )}

            <div className="flex gap-2">
              {problem?.sampleTestCases?.map((tc, idx) => (
                <button key={idx} className="px-3 py-1.5 rounded bg-gray-700 text-white text-sm font-medium flex items-center gap-2">
                  Case {idx + 1}
                </button>
              ))}
            </div>

            {problem?.sampleTestCases?.length > 0 && (
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Input</p>
                  <div className="bg-gray-800 p-2 rounded text-sm font-mono text-gray-300">
                    {problem.sampleTestCases[0].input}
                  </div>
                </div>
                
                {output && output.includes("Status:") && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Submission Output</p>
                    <div className={`p-2 rounded text-sm font-mono ${output.includes("Status: Accepted") ? "bg-gray-800 text-gray-300" : "bg-red-900/20 text-red-400 border border-red-900/50"}`}>
                      {output.trim()}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Expected Output</p>
                  <div className="bg-gray-800 p-2 rounded text-sm font-mono text-gray-300">
                    {problem.sampleTestCases[0].output}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'output' && (
          <div className="h-full">
            {output ? (
              <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap leading-relaxed">{output}</pre>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500 italic text-sm">
                Run your code to see output here.
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            {executionStats ? (
              <>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-200 mb-1">Success!</h3>
                  <p className="text-sm text-green-400">Passed {executionStats.testCasesPassed} test cases.</p>
                </div>
                <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Runtime</p>
                    <p className="text-2xl font-mono text-blue-400">{executionStats.time} ms</p>
                    <p className="text-xs text-gray-500 mt-2">Beats 85% of users</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">Memory</p>
                    <p className="text-2xl font-mono text-purple-400">{executionStats.memory} MB</p>
                    <p className="text-xs text-gray-500 mt-2">Beats 62% of users</p>
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
