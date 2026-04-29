import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { 
  Sword, Terminal, Code2, Layout, Trophy, HelpCircle,
  Zap, Activity, Maximize2, Settings, ChevronLeft, ChevronRight
} from "lucide-react";

import Editor from "../components/Compiler/Editor/Editor";
import RunButton from "../components/Compiler/Editor/RunButton";
import LanguageSelector from "../components/Compiler/Editor/LanguageSelector";
import ProblemDescription from "../components/Compiler/ProblemDescription";
import Console from "../components/Compiler/Console";
import Timer from "../components/Compiler/Timer";

const defaultSnippets = {
  java: "import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n    }\n}\n\nclass Solution {\n    public void solve() {\n    }\n}",
  python: "class Solution:\n    def solve(self):\n        pass",
  cpp: "#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve() {\n    }\n};"
};

function Problem() {
  const { roomCode, problemId } = useParams()
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null)
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(defaultSnippets["java"]);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [executionStats, setExecutionStats] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState("output");

  // --- HEIGHT ADJUSTMENT LOGIC ---
  const [consoleHeight, setConsoleHeight] = useState(250); 
  const isResizing = useRef(false);

  const startResizing = useCallback(() => {
    isResizing.current = true;
    document.body.style.cursor = "ns-resize"; // Visual feedback
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    document.body.style.cursor = "default";
  }, []);

  const resize = useCallback((e) => {
    if (isResizing.current) {
      const newHeight = window.innerHeight - e.clientY;
      // Constraints: Min 100px, Max 80% of screen
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const [probRes, roomRes] = await Promise.all([
          fetch(`http://localhost:5000/api/problems/${problemId}`),
          fetch(`http://localhost:5000/api/rooms/${roomCode}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        const probData = await probRes.json();
        const rData = await roomRes.json();
        setProblem(probData);
        setRoomData(rData);
      } catch (err) { console.error("System sync failed."); }
    };
    fetchData();
  }, [problemId, roomCode]);

  const handleLanguageChange = (newLanguage) => {
    if (code === defaultSnippets[language] || code.trim() === "" || code.includes("class Solution")) {
      setCode(defaultSnippets[newLanguage]);
    }
    setLanguage(newLanguage);
  };

  const handleAccepted = () => {
    if (!roomData?.problems) return;
    const currentIndex = roomData.problems.findIndex(p => p._id === problemId);
    if (currentIndex !== -1 && currentIndex < roomData.problems.length - 1) {
      const nextId = roomData.problems[currentIndex + 1]._id;
      navigate(`/room/${roomCode}/problem/${nextId}`);
    } else {
      navigate(`/leaderboard/${roomCode}`);
    }
  };

  if (!problem || !roomData) {
    return (
      <div className="h-screen w-full bg-[#020617] flex flex-col items-center justify-center">
        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-blue-600 animate-[loading_1.5s_infinite]"></div>
        </div>
        <p className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase">Booting Arena Interface</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#020617] text-slate-300 flex flex-col overflow-hidden font-sans">
      
      {/* --- TOP HUD NAV --- */}
      <nav className="h-14 bg-slate-950 border-b border-white/5 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-6">
          <div onClick={() => navigate(`/room/${roomCode}`)} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
              <Sword className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-none uppercase italic tracking-tighter">CodePlay</h1>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">v2.0.4 Combat</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-800 mx-2" />
          <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-2 text-slate-200">
              <Activity size={14} className="text-emerald-500" />
              <span>{roomData.roomName}</span>
            </div>
            <Timer />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector language={language} setLanguage={handleLanguageChange} disabled={isLoading} />
          <RunButton 
            code={code} language={language} setOutput={setOutput} 
            isLoading={isLoading} setIsLoading={setIsLoading} 
            setExecutionStats={setExecutionStats} problemId={problemId}
            roomCode={roomCode} onAccepted={handleAccepted}
          />
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        
        {/* --- 1. THE SLIM NAV RAIL --- */}
        <div className="w-16 bg-slate-950 border-r border-white/5 flex flex-col items-center py-6 gap-6">
           <button onClick={() => navigate(`/room/${roomCode}`)} className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all border border-transparent hover:border-blue-500/20">
              <Layout size={20} />
           </button>
           <div className="w-8 h-[1px] bg-slate-800" />
           <div className="flex flex-col gap-3">
             {roomData.problems.map((p, idx) => (
               <button
                 key={p._id}
                 onClick={() => navigate(`/room/${roomCode}/problem/${p._id}`)}
                 className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all border ${p._id === problemId ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-transparent border-white/5 text-slate-600 hover:border-white/20 hover:text-slate-200"}`}
               >
                 {idx + 1}
               </button>
             ))}
           </div>
           <button className="mt-auto p-3 text-slate-700 hover:text-slate-400" onClick={() => navigate(`/leaderboard/${roomCode}`)}>
              <Trophy size={20} />
           </button>
        </div>

        {/* --- 2. PROBLEM DESCRIPTION PANE (FIXED SCROLLING) --- */}
        <div className="w-1/3 min-w-[400px] flex flex-col bg-[#020617] border-r border-white/5 h-full">
           <div className="h-10 bg-slate-950/50 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <HelpCircle size={14} className="text-blue-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Problem Description</span>
              </div>
              <Maximize2 size={12} className="text-slate-700 hover:text-slate-400 cursor-pointer" />
           </div>
           {/* Added flex-1 and overflow-y-auto here */}
           <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#020617]">
              <ProblemDescription problem={problem} />
           </div>
        </div>

        {/* --- 3. EDITOR & CONSOLE PANE (ADDED HEIGHT ADJUSTMENT) --- */}
        <div className="flex-1 flex flex-col min-w-0 bg-black h-full">
           
           {/* Editor Area */}
           <div className="flex-1 flex flex-col relative group overflow-hidden">
              <div className="h-10 bg-slate-950/50 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-2">
                  <Code2 size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Source Interface</span>
                </div>
                <span className="text-[9px] font-mono text-slate-700 uppercase">{language} // Main</span>
              </div>
              <div className="flex-1 bg-black overflow-hidden">
                 <Editor code={code} setCode={setCode} language={language} readOnly={isLoading} />
              </div>
           </div>

           {/* --- DRAG HANDLE FOR RESIZING --- */}
           <div 
             onMouseDown={startResizing}
             className="h-1.5 w-full bg-white/5 hover:bg-blue-500/50 cursor-ns-resize transition-colors z-20 flex items-center justify-center border-t border-b border-white/10 shrink-0"
           >
             <div className="w-12 h-[2px] bg-white/20 rounded-full" />
           </div>

           {/* Console Area (Height is now dynamic) */}
           <div 
             style={{ height: `${consoleHeight}px` }}
             className="border-t border-white/10 flex flex-col bg-slate-950/40 backdrop-blur-md shrink-0"
           >
              <div className="h-10 bg-slate-950 flex items-center px-2 border-b border-white/5 shrink-0">
                <button onClick={() => setActiveConsoleTab("output")} className={`px-4 h-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${activeConsoleTab === "output" ? "text-white border-b-2 border-blue-500" : "text-slate-500 hover:text-slate-300"}`}>
                  <Terminal size={14} /> Output
                </button>
                
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/20 p-4">
                {activeConsoleTab === "output" ? (
                  <Console output={output} executionStats={executionStats} problem={problem} />
                ) : (
                  <div className="text-slate-600 font-mono text-sm">{">"} System ready for validation...</div>
                )}
              </div>
           </div>

        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #020617; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
        .ace_editor, .ace_gutter { background-color: #000000 !important; }
      `}} />
    </div>
  )
}

export default Problem