// FILE: frontend/src/pages/Problem.jsx

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Sword,
  Terminal,
  Code2,
  Layout,
  Trophy,
  HelpCircle,
  Activity,
  Maximize2,
  Settings,
} from "lucide-react";

import Editor from "../components/Compiler/Editor/Editor";
import RunButton from "../components/Compiler/Editor/RunButton";
import LanguageSelector from "../components/Compiler/Editor/LanguageSelector";
import ProblemDescription from "../components/Compiler/ProblemDescription";
import Console from "../components/Compiler/Console";
import Timer from "../components/Compiler/Timer";
import { io } from "socket.io-client";

const defaultSnippets = {
  java: `import java.util.*;

class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
    }
}

class Solution {
    public void solve() {

    }
}`,

  python: `class Solution:
    def solve(self):
        pass`,

  cpp: `#include <iostream>
using namespace std;

class Solution {
public:
    void solve() {

    }
};`,
};

function Problem() {
  const { roomCode, problemId } = useParams();

  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);

  const [language, setLanguage] = useState("java");

  const [code, setCode] = useState(defaultSnippets["java"]);

  const [output, setOutput] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [executionStats, setExecutionStats] = useState(null);

  const [testcaseResults, setTestcaseResults] = useState([]);

  const [roomData, setRoomData] = useState(null);

  const [activeConsoleTab, setActiveConsoleTab] = useState("output");

  // ✅ NEW
  const [contestEnded, setContestEnded] = useState(false);

  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const [leaders, setLeaders] = useState([]);

  const [solvedProblems, setSolvedProblems] = useState([]);

  const [consoleHeight, setConsoleHeight] = useState(250);

  const isResizing = useRef(false);

  const consoleRef = useRef(null);

  // =========================
  // RESIZE LOGIC
  // =========================

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "ns-resize";
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = "default";
  }, []);

  const resize = useCallback((e) => {
    if (isResizing.current) {
      const newHeight = window.innerHeight - e.clientY;

      if (newHeight > 100 && newHeight < window.innerHeight * 0.8) {
        setConsoleHeight(newHeight);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", resize);

    window.addEventListener("mouseup", stopResizing);

    return () => {
      window.removeEventListener("mousemove", resize);

      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [probRes, roomRes] = await Promise.all([
          fetch(`http://localhost:5000/api/problems/${problemId}`),

          fetch(`http://localhost:5000/api/rooms/${roomCode}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const probData = await probRes.json();

        const rData = await roomRes.json();

        setProblem(probData);

        setRoomData(rData);

        // Reset compiler state
        setOutput("");
        setExecutionStats(null);
        setActiveConsoleTab("output");

        // Reset editor code
        setCode(defaultSnippets[language]);
      } catch (err) {
        console.error("System sync failed.");
      }
    };

    fetchData();
  }, [problemId, roomCode]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/leaderboard/${roomCode}`,
        );

        const data = await res.json();

        setLeaders(data);
      } catch (err) {
        console.error("Leaderboard sync failed", err);
      }
    };

    fetchLeaderboard();

    socket.emit("joinRoom", roomCode);

    socket.on("leaderboardUpdated", () => {
      fetchLeaderboard();
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode]);

  // ✅ ADD HERE
  useEffect(() => {
    if (contestEnded) {
      window.history.pushState(null, "", window.location.href);

      const preventBack = () => {
        window.history.pushState(null, "", window.location.href);
      };

      window.addEventListener("popstate", preventBack);

      return () => {
        window.removeEventListener("popstate", preventBack);
      };
    }
  }, [contestEnded]);

  useEffect(() => {
    if (output && consoleRef.current) {
      consoleRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [output]);

  // =========================
  // LANGUAGE SWITCH
  // =========================

  const handleLanguageChange = (newLanguage) => {
    if (
      code === defaultSnippets[language] ||
      code.trim() === "" ||
      code.includes("class Solution")
    ) {
      setCode(defaultSnippets[newLanguage]);
    }

    setLanguage(newLanguage);
  };

  // =========================
  // ACCEPTED CALLBACK
  // =========================

  const handleAccepted = () => {
    setOutput((prev) => prev + "\n\n✅ Solution Accepted Successfully!");

    // Prevent duplicate solved
    if (solvedProblems.includes(problemId)) {
      return;
    }

    // Mark solved
    const updatedSolved = [...solvedProblems, problemId];

    setSolvedProblems(updatedSolved);

    // Current problem index
    const currentIndex = roomData.problems.findIndex(
      (p) => p._id === problemId,
    );

    // Next problem
    const nextProblem = roomData.problems[currentIndex + 1];

    // Auto move next
    if (nextProblem) {
      setTimeout(() => {
        navigate(`/room/${roomCode}/problem/${nextProblem._id}`);
      }, 1200);
    } else {
      // All solved
      setTimeout(() => {
        navigate(`/leaderboard/${roomCode}`, { replace: true });
      }, 1500);
    }
  };

  // =========================
  // LOADING SCREEN
  // =========================

  if (!problem || !roomData) {
    return (
      <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center">
        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-blue-600 animate-[loading_1.5s_infinite]"></div>
        </div>

        <p className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase">
          Booting Arena Interface
        </p>
      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="h-screen w-full bg-[#020617] text-slate-300 flex flex-col overflow-hidden font-sans">
      {/* TOP NAVBAR */}
      <nav className="h-14 bg-slate-950 border-b border-white/5 flex items-center justify-between px-4 z-50">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigate(`/room/${roomCode}`)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
              <Sword className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-sm font-black text-white leading-none uppercase italic tracking-tighter">
                CodePlay
              </h1>

              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                v2.0.4 Combat
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 mx-2" />

          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-2 text-slate-200">
              <Activity size={14} className="text-emerald-500" />

              <span>{roomData.roomName}</span>
            </div>

            {/* TIMER */}
            <Timer
              startTime={roomData.startTime}
              duration={roomData.duration}
              roomCode={roomCode}
              onContestEnd={() => setContestEnded(true)}
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <LanguageSelector
            language={language}
            setLanguage={handleLanguageChange}
            disabled={isLoading || contestEnded}
          />

          <RunButton
            code={code}
            language={language}
            setOutput={setOutput}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setExecutionStats={setExecutionStats}
            problemId={problemId}
            roomCode={roomCode}
            onAccepted={handleAccepted}
            contestEnded={contestEnded}
            setActiveConsoleTab={setActiveConsoleTab}
            setTestcaseResults={setTestcaseResults}
          />

          {/* FINISH BUTTON */}
          <button
            onClick={async () => {
              try {
                const token = localStorage.getItem("token");

                await fetch(
                  `http://localhost:5000/api/rooms/${roomCode}/finish`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                );

                setContestEnded(true);

                navigate(`/leaderboard/${roomCode}`, { replace: true });
              } catch (err) {
                console.error(err);
              }
            }}
            disabled={contestEnded}
            className={`px-5 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg ${
              contestEnded
                ? "bg-red-900 text-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500 shadow-red-900/20"
            }`}
          >
            {contestEnded ? "Contest Ended" : "Finish Contest"}
          </button>

          <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </nav>

      {/* MAIN AREA */}
      <main className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <div className="w-16 bg-slate-950 border-r border-white/5 flex flex-col items-center py-6 gap-6">
          <button
            onClick={() => navigate(`/room/${roomCode}`)}
            className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all border border-transparent hover:border-blue-500/20"
          >
            <Layout size={20} />
          </button>

          <div className="w-8 h-[1px] bg-slate-800" />

          {/* PROBLEM NAV */}
          <div className="flex flex-col gap-3">
            {roomData.problems.map((p, idx) => (
              <button
                key={p._id}
                onClick={() => navigate(`/room/${roomCode}/problem/${p._id}`)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all border ${
                  p._id === problemId
                    ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                    : "bg-transparent border-white/5 text-slate-600 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                {solvedProblems.includes(p._id) ? "✓" : idx + 1}
              </button>
            ))}
          </div>

          {/* LEADERBOARD */}
          <button
            className={`mt-auto p-3 transition-all ${
              showLeaderboard
                ? "text-yellow-400"
                : "text-slate-700 hover:text-slate-400"
            }`}
            onClick={() => setShowLeaderboard((prev) => !prev)}
          >
            <Trophy size={20} />
          </button>
        </div>

        {/* LIVE LEADERBOARD PANEL */}

        <div
          className={`absolute right-0 top-14 h-[calc(100vh-56px)] w-[380px]
  bg-slate-950/95 border-l border-white/5 backdrop-blur-2xl
  z-40 transition-all duration-500 overflow-hidden
  ${showLeaderboard ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* HEADER */}

          <div className="h-14 border-b border-white/5 flex items-center justify-between px-5">
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">
                Live Leaderboard
              </h2>

              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">
                Real-time standings
              </p>
            </div>

            <button
              onClick={() => setShowLeaderboard(false)}
              className="text-slate-600 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          {/* BODY */}

          <div className="p-4 space-y-3 overflow-y-auto h-full custom-scrollbar">
            {leaders.length === 0 ? (
              <div className="text-center text-slate-600 text-sm pt-10">
                Awaiting contest activity...
              </div>
            ) : (
              leaders.map((user, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border p-4 transition-all
          ${
            index === 0
              ? "bg-yellow-500/10 border-yellow-500/20"
              : index === 1
                ? "bg-slate-500/10 border-slate-500/20"
                : index === 2
                  ? "bg-amber-700/10 border-amber-700/20"
                  : "bg-white/[0.03] border-white/5"
          }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center
                font-black text-white
                ${
                  index === 0
                    ? "bg-yellow-500"
                    : index === 1
                      ? "bg-slate-400"
                      : index === 2
                        ? "bg-amber-700"
                        : "bg-slate-800"
                }`}
                      >
                        #{index + 1}
                      </div>

                      <div>
                        <h3 className="font-black uppercase tracking-tight text-white">
                          {user.name}
                        </h3>

                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                          {user.solved} solved
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-emerald-400 font-mono text-sm">
                        {Math.floor(user.timeTakenMs / 1000)}s
                      </div>

                      <div className="text-[10px] text-slate-600 uppercase">
                        total time
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="h-20" />
          </div>
        </div>

        {/* PROBLEM DESCRIPTION */}
        <div className="w-1/3 min-w-[400px] flex flex-col bg-[#020617] border-r border-white/5 h-full">
          <div className="h-10 bg-slate-950/50 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <HelpCircle size={14} className="text-blue-500" />

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Problem Description
              </span>
            </div>

            <Maximize2
              size={12}
              className="text-slate-700 hover:text-slate-400 cursor-pointer"
            />
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#020617]">
            <ProblemDescription problem={problem} />
          </div>
        </div>

        {/* EDITOR AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-black h-full">
          {/* EDITOR */}
          <div className="flex-1 flex flex-col relative group overflow-hidden">
            <div className="h-10 bg-slate-950/50 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <Code2 size={14} className="text-emerald-500" />

                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Source Interface
                </span>
              </div>

              <span className="text-[9px] font-mono text-slate-700 uppercase">
                {language} // Main
              </span>
            </div>

            <div className="flex-1 bg-black overflow-hidden">
              <Editor
                code={code}
                setCode={setCode}
                language={language}
                readOnly={isLoading || contestEnded}
              />
            </div>
          </div>

          {/* RESIZER */}
          <div
            onMouseDown={startResizing}
            className="h-1.5 w-full bg-white/5 hover:bg-blue-500/50 cursor-ns-resize transition-colors z-20 flex items-center justify-center border-t border-b border-white/10 shrink-0"
          >
            <div className="w-12 h-[2px] bg-white/20 rounded-full" />
          </div>

          {/* CONSOLE */}
          <div
            ref={consoleRef}
            style={{ height: `${consoleHeight}px` }}
            className="border-t border-white/10 flex flex-col bg-slate-950/40 backdrop-blur-md shrink-0"
          >
            <div className="h-10 bg-slate-950 flex items-center px-2 border-b border-white/5 shrink-0">
              <button
                onClick={() => setActiveConsoleTab("output")}
                className={`px-4 h-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeConsoleTab === "output"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <Terminal size={14} />
                Output
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 p-4">
              <Console
                output={output}
                executionStats={executionStats}
                problem={problem}
                activeConsoleTab={activeConsoleTab}
                setActiveConsoleTab={setActiveConsoleTab}
                testcaseResults={testcaseResults}
              />
            </div>
          </div>
        </div>
      </main>

      {/* STYLES */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background: #020617;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #1e293b;
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #334155;
          }

          .ace_editor,
          .ace_gutter {
            background-color: #000000 !important;
          }
        `,
        }}
      />
    </div>
  );
}

export default Problem;
