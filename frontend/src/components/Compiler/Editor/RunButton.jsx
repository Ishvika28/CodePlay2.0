import { useState, useEffect } from "react";

function RunButton({
  code,
  language,
  setOutput,
  isLoading,
  setIsLoading,
  setExecutionStats,
  setTestcaseResults,
  problemId,
  roomCode,
  onAccepted,
  contestEnded,
  setActiveConsoleTab,
}) {
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    setHasRun(false);
  }, [code]);

  const runCode = async (isSubmit) => {
    // Contest ended protection
    if (contestEnded) {
      setActiveConsoleTab?.("output");
      setOutput("❌ Contest has ended.");
      return;
    }

    if (!code.trim()) {
      setActiveConsoleTab?.("output");
      setOutput("Please write some code first.");
      setExecutionStats(null);
      return;
    }

    setIsLoading(true);

    setOutput(isSubmit ? "Submitting solution...\n" : "Running tests...\n");

    setExecutionStats(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          problemId,
          roomCode,
          language,
          code,
        }),
      });

      const data = await response.json();
      setTestcaseResults?.(data.testcaseResults || []);

      // Contest ended from backend
      if (response.status === 403) {
        setActiveConsoleTab?.("output");

        setOutput("❌ Contest has ended.");

        return;
      }

      // SUCCESS RESPONSE
      if (data.submission) {
        setOutput(
          `Status: ${data.result}

Time: ${data.submission.executionTimeMs} ms
Memory: ${data.submission.memoryMB} MB
Time Taken: ${Math.floor(data.submission.timeTakenMs / 1000)}s`,
        );

        // Accepted
        if (data.result === "Accepted") {
          // Show testcase tab on success
          setActiveConsoleTab?.("testcases");

          setExecutionStats({
            time: data.submission.executionTimeMs,
            memory: data.submission.memoryMB,
            testCasesPassed: "All",
          });
        } else {
          // Show output tab on failure
          setActiveConsoleTab?.("output");

          setExecutionStats(null);
        }

        if (isSubmit && data.result === "Accepted" && onAccepted) {
          onAccepted();
        }
      } else {
        // Compilation/runtime/server errors
        setActiveConsoleTab?.("output");

        setOutput(data.message || data.output || "Error running code");

        setExecutionStats(null);
      }

      if (!isSubmit) {
        setHasRun(true);
      }
    } catch (err) {
      console.error(err);

      setActiveConsoleTab?.("output");

      setOutput("Error connecting to server.");

      setExecutionStats(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-3">
      {/* RUN BUTTON */}
      <button
        onClick={() => runCode(false)}
        disabled={isLoading || contestEnded}
        className={`px-5 py-1.5 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2 ${
          contestEnded
            ? "bg-red-900 text-red-300 cursor-not-allowed"
            : isLoading
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50"
        }`}
      >
        {contestEnded ? (
          "Contest Ended"
        ) : isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 
                0 0 5.373 0 12h4zm2 
                5.291A7.962 7.962 0 
                014 12H0c0 3.042 1.135 
                5.824 3 7.938l3-2.647z"
              />
            </svg>
            Running
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Run Code
          </>
        )}
      </button>

      {/* SUBMIT BUTTON */}
      <button
        onClick={() => runCode(true)}
        disabled={isLoading || contestEnded}
        className={`px-5 py-1.5 rounded-md text-sm font-semibold shadow-sm transition-all flex items-center gap-2 ${
          contestEnded
            ? "bg-red-900 text-red-300 cursor-not-allowed"
            : isLoading
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500 text-white shadow-green-900/50"
        }`}
      >
        {contestEnded ? "Contest Ended" : "Submit Solution"}
      </button>
    </div>
  );
}

export default RunButton;
