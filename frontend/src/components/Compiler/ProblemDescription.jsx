import React from 'react';

const ProblemDescription = ({ problem }) => {
  if (!problem) return <div className="p-4 text-white">Loading problem...</div>;

  return (
    <div className="h-full bg-gray-900 text-gray-200 overflow-y-auto border-r border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3 sticky top-0 bg-gray-900 z-10">
        <h1 className="text-xl font-bold">{problem.title}</h1>
        <span className={`px-2 py-1 text-xs rounded-md font-medium ${
          problem.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
          problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 space-y-6">
        <div className="text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
          {problem.description}
        </div>

        {/* Examples */}
        {problem.sampleTestCases && problem.sampleTestCases.length > 0 && (
          <div className="space-y-4">
            {problem.sampleTestCases.map((tc, index) => (
              <div key={index}>
                <p className="font-semibold text-gray-100 mb-2">Example {index + 1}:</p>
                <div className="bg-gray-800 p-3 rounded-md font-mono text-sm border border-gray-700 shadow-inner">
                  <div className="text-gray-400">
                    <span className="text-gray-500">Input:</span> {tc.input}
                  </div>
                  <div className="text-gray-400">
                    <span className="text-gray-500">Output:</span> {tc.output}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDescription;
