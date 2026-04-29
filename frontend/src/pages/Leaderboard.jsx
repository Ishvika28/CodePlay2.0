import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
// CRITICAL: All icons must be imported to prevent "X is not defined" errors
import { 
  Sword, Trophy, LayoutDashboard, PlusCircle, LogIn, 
  UserCircle, Menu, X, Timer, Zap, Cpu, Gauge, Activity, ChevronRight 
} from "lucide-react";

function Leaderboard() {
  const { roomCode } = useParams();
  const [leaders, setLeaders] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/leaderboard/${roomCode}`)
      .then((res) => res.json())
      .then((data) => setLeaders(data))
      .catch((err) => console.error("Leaderboard sync failed", err));
  }, [roomCode]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-x-hidden font-sans selection:bg-blue-500/30">
      
      {/* --- PURE CSS NOISE & GLOWS (Replaces the broken noise.svg) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0%200%20200%20200'%20xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter%20id='noiseFilter'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.65'%20numOctaves='3'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* --- SIDEBAR TOGGLE --- */}
      <button 
        onClick={() => setOpen(true)}
        className="fixed top-8 left-8 z-40 p-3 bg-slate-900/50 border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:scale-110 shadow-2xl backdrop-blur-md"
      >
        <Menu className="w-6 h-6 text-blue-400" />
      </button>

      {/* --- ELITE SIDEBAR --- */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-slate-950/95 backdrop-blur-3xl border-r border-white/5 p-8 z-50 shadow-[50px_0_100px_-20px_rgba(0,0,0,0.5)] transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Sword className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic text-white uppercase">CODEPLAY</span>
          </div>
          <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { path: "/dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
            { path: "/create-room", label: "Initialize Room", icon: <PlusCircle size={20} /> },
            { path: "/join-room", label: "Join Battle", icon: <LogIn size={20} /> },
            { path: "/leaderboard", label: "Global Ranks", icon: <Trophy size={20} /> },
            { path: "/profile", label: "Pilot Profile", icon: <UserCircle size={20} /> },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold tracking-tight ${
                item.path === "/leaderboard" 
                ? "bg-blue-600/10 border border-blue-500/20 text-white shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className={`${item.path === "/leaderboard" ? "text-blue-400" : "group-hover:text-blue-400"} transition-colors`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
          <button onClick={logout} className="mt-4 text-left flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold tracking-tight">
            <Activity size={20} /> Disconnect
          </button>
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="p-6 md:p-12 lg:pt-24 relative z-10 space-y-10 max-w-[1400px] mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Zap size={12} className="fill-current" /> Live Rankings
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic">Leaderboard</h2>
            <p className="text-slate-500 mt-2 font-mono text-sm tracking-widest uppercase">Arena Signature: {roomCode}</p>
          </div>
          <div className="flex justify-center gap-3">
             <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-[2rem] text-center min-w-[120px]">
                <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Participants</p>
                <p className="text-2xl font-black text-white italic">{leaders.length}</p>
             </div>
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-[#0b1120]/40 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-2xl relative">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  <th className="px-10 py-6">Rank</th>
                  <th className="px-10 py-6">User / Identity</th>
                  <th className="px-10 py-6">Solved</th>
                  <th className="px-10 py-6">Execution (ms)</th>
                  <th className="px-10 py-6">Memory (mb)</th>
                  <th className="px-10 py-6">Total Time (s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {leaders.map((user, index) => (
                  <tr key={index} className="group hover:bg-blue-600/[0.03] transition-colors duration-300">
                    <td className="px-10 py-6">
                      <div className={`text-2xl font-black italic ${index === 0 ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]" : index === 1 ? "text-slate-300" : index === 2 ? "text-amber-600" : "text-slate-600"}`}>
                        #{index + 1}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center font-black text-white ${index === 0 ? 'from-yellow-400 to-amber-600' : 'from-slate-800 to-slate-900'}`}>
                          {user.name?.[0] || "?"}
                        </div>
                        <span className="text-white font-bold tracking-tight uppercase">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 font-mono text-emerald-400 font-bold">{user.solved}</td>
                    <td className="px-10 py-6 font-mono text-purple-400">{user.executionTimeMs} ms</td>
                    <td className="px-10 py-6 font-mono text-pink-400">{user.memoryMB} MB</td>
                    <td className="px-10 py-6 font-mono text-yellow-500">{Math.floor(user.timeTakenMs / 1000)} s</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {leaders.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center gap-4">
                 <Activity className="w-12 h-12 text-slate-800 animate-pulse" />
                 <p className="text-slate-600 font-bold uppercase tracking-[0.3em] text-xs">Awaiting combat data transmission...</p>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center pt-10">
          <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.5em]">
            Verified Arena Protocol // v2.0
          </p>
        </footer>
      </main>

      {/* Sidebar Overlay */}
      {open && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />}
    </div>
  );
}

export default Leaderboard;