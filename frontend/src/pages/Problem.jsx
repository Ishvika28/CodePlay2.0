import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Editor from "../components/Compiler/Editor/Editor";
import RunButton from "../components/Compiler/Editor/RunButton";
import LanguageSelector from "../components/Compiler/Editor/LanguageSelector";
import ProblemDescription from "../components/Compiler/ProblemDescription";
import Console from "../components/Compiler/Console";
import Timer from "../components/Compiler/Timer";

const defaultSnippets = {
  java: "import java.util.*;\n\nclass Main {\n    public static void main(String[] args) {\n        // Your testing logic here\n    }\n}\n\nclass Solution {\n    public void solve() {\n        // Write your solution here\n    }\n}",
  python: "class Solution(object):\n    def solve(self):\n        pass",
  cpp: "class Solution {\npublic:\n    void solve() {\n        \n    }\n};"
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

  useEffect(() => {
    const fetchProblem = async () => {
      const res = await fetch(`http://localhost:5000/api/problems/${problemId}`)
      const data = await res.json()
      setProblem(data)
    }

    const fetchRoom = async () => {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/rooms/${roomCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setRoomData(data)
    }

    fetchProblem()
    fetchRoom()
  }, [problemId, roomCode])

  const handleLanguageChange = (newLanguage) => {
    if (code === defaultSnippets[language] || code.trim() === "" || code.includes("class Solution")) {
      setCode(defaultSnippets[newLanguage]);
    }
    setLanguage(newLanguage);
  };

  const handleAccepted = () => {
    if (!roomData || !roomData.problems) return;
    
    const currentIndex = roomData.problems.findIndex(p => p._id === problemId);
    
    if (currentIndex !== -1 && currentIndex < roomData.problems.length - 1) {
      // Navigate to next problem
      const nextProblemId = roomData.problems[currentIndex + 1]._id;
      navigate(`/room/${roomCode}/problem/${nextProblemId}`);
    } else {
      // Last problem, navigate to leaderboard
      navigate(`/leaderboard/${roomCode}`);
    }
  };

  if (!problem || !roomData) {
    return <div className="h-screen flex items-center justify-center bg-[#0d1117] text-white">Loading...</div>
  }

  return (
    <div className="h-screen flex flex-col bg-[#0d1117] text-gray-200 overflow-hidden font-sans">
      
      {/* Top Navbar */}
      <nav className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/room/${roomCode}`)}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-inner">
              C
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-100 hover:text-blue-400 transition-colors">CodePlay Platform</span>
          </div>
          <div className="h-6 w-px bg-gray-700 hidden md:block"></div>
          <Timer />
        </div>
        
        <div className="flex items-center gap-6">
          <LanguageSelector language={language} setLanguage={handleLanguageChange} disabled={isLoading} />
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
          />
        </div>
      </nav>

      {/* Main Workspace: 3-pane layout */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Problem Description */}
        <div className="w-1/3 min-w-[300px] h-full shadow-lg z-10">
          <ProblemDescription problem={problem} />
        </div>

        {/* Right Pane: Split horizontally between Editor and Console */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Top Right: Editor */}
          <div className="flex-[3] relative">
            <Editor code={code} setCode={setCode} language={language} readOnly={isLoading} />
          </div>

          {/* Bottom Right: Console */}
          <div className="flex-[2] z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            <Console output={output} executionStats={executionStats} problem={problem} />
          </div>

        </div>
      </main>

    </div>
  )
}

export default Problem