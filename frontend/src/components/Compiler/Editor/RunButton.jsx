import { useState, useEffect } from "react";

function RunButton({ code, language, setOutput, isLoading, setIsLoading, setExecutionStats, problemId, roomCode, onAccepted }) {
  const [hasRun, setHasRun] = useState(false);

  // Reset hasRun whenever code changes
  useEffect(() => {
    setHasRun(false);
  }, [code]);

  const runCode = async (isSubmit) => {
    if (!code) {
      setOutput("Please write some code first.");
      setExecutionStats(null);
      return;
    }

    setIsLoading(true);
    setOutput(isSubmit ? "Submitting solution...\n" : "Running tests...\n");
    setExecutionStats(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          problemId,
          roomCode,
          language,
          code
        })
      });

      const data = await response.json();
      
      if (data.submission) {
        setOutput(`Status: ${data.result}\n\nTime: ${data.submission.executionTimeMs} ms\nMemory: ${data.submission.memoryMB} MB\nTime Taken: ${Math.floor(data.submission.timeTakenMs / 1000)}s`);
        
        if (data.result === "Accepted") {
          setExecutionStats({
            time: data.submission.executionTimeMs,
            memory: data.submission.memoryMB,
            testCasesPassed: "All"
          });
        }

        if (isSubmit && onAccepted) {
          onAccepted();
        }
      } else {
        setOutput(data.message || data.output || "Error running code");
      }

      // If it was just a run, mark it as run so submit is enabled
      if (!isSubmit) {
        setHasRun(true);
      }

    } catch (err) {
      console.error(err);
      setOutput("Error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      {/* Run Button */}
      <button 
        onClick={() => runCode(false)} 
        disabled={isLoading}
        className={`px-5 py-1.5 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2 ${
          isLoading 
            ? "bg-gray-600 text-gray-300 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50"
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Running
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Run Code
          </>
        )}
      </button>

      {/* Submit Button */}
      <button 
        onClick={() => runCode(true)} 
        disabled={isLoading}
        className={`px-5 py-1.5 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2 ${
          isLoading
            ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
            : "bg-green-600 hover:bg-green-500 text-white shadow-green-900/50"
        }`}
        title="Submit your solution and move to the next question"
      >
        Submit Solution
      </button>
    </div>
  );
}

export default RunButton;