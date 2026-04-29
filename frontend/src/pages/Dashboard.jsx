import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  Sword, 
  Trophy, 
  Users, 
  Terminal, 
  Zap, 
  PlusCircle, 
  LogIn, 
  ChevronRight, 
  Activity, 
  Menu, 
  X,
  LayoutDashboard,
  UserCircle
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden font-sans">
      {/* --- HYPER-STYLIZED BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* --- ELITE NAVBAR --- */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-slate-950/50 backdrop-blur-2xl sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setOpen(true)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-blue-400"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Sword className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">CodePlay</h1>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          
          <span className="hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-2 text-blue-400">
            <Zap size={14} className="fill-blue-400" /> Pro League
          </span>
        </nav>

        <button
          onClick={logout}
          className="px-5 py-2 rounded-lg border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
        >
          Disconnect
        </button>
      </header>

      {/* --- CRAZY SIDEBAR --- */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-slate-950/90 backdrop-blur-3xl border-r border-white/5 p-8 z-50 shadow-[50px_0_100px_-20px_rgba(0,0,0,0.5)] transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Sword className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">CODEPLAY</span>
          </div>
          <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-widest">Current Status</p>
          <h3 className="font-semibold text-white flex items-center gap-2">Ready to Compete ⚡</h3>
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
                item.path === "/dashboard" 
                ? "bg-blue-600/10 border border-blue-500/20 text-white shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className={`${item.path === "/dashboard" ? "text-blue-400" : "group-hover:text-blue-400"} transition-colors`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}

          <button
            onClick={logout}
            className="text-left flex items-center gap-3 px-5 py-4 mt-4 rounded-xl hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition-all duration-300 font-bold"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="p-6 md:p-12 relative z-10 space-y-12 max-w-7xl mx-auto">
        
        {/* --- HERO SECTION: THE COMMAND CENTER --- */}
        <section className="relative group rounded-[3rem] overflow-hidden border border-white/5 bg-slate-900/20 backdrop-blur-3xl shadow-2xl p-10 md:p-16 text-center md:text-left">
          <div className="absolute top-0 right-0 p-8 text-blue-500/20 opacity-50 select-none">
             <Terminal size={300} strokeWidth={1} />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <Zap size={12} className="fill-current" /> Active Deployment: 2.0.4
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tighter mb-8 text-white">
              CODE. <span className="text-blue-500">COMPETE.</span> <br />
              DOMINATE.
            </h2>

            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-xl">
              The ultimate high-frequency battleground for elite developers. Sync with the grid, initiate combat, and climb the global sequence.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link
                to="/create-room"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3"
              >
                Launch Arena <PlusCircle size={18} />
              </Link>
              <Link
                to="/join-room"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-white/10 hover:border-white/40 bg-white/5 hover:bg-white/10 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3"
              >
                Join Signal <LogIn size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* --- DYNAMIC STATS GRID --- */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { val: "500+", label: "Combatants", icon: <Users className="text-blue-500" /> },
            { val: "120+", label: "Active Nodes", icon: <Activity className="text-indigo-500" /> },
            { val: "1k+", label: "Solved Tasks", icon: <Terminal className="text-emerald-500" /> },
            { val: "0.4ms", label: "Sync Latency", icon: <Zap className="text-yellow-500" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0b1120]/50 border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="mb-4 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center">{stat.icon}</div>
              <h3 className="text-4xl font-black text-white tracking-tighter mb-1">{stat.val}</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* --- ACTION CARDS --- */}
        <section className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Create Room", 
              desc: "Deploy a custom private node. Set your rules, select your problem set, and challenge the network.",
              link: "/create-room",
              color: "blue"
            },
            { 
              title: "Join Signal", 
              desc: "Enter the code to sync with an active contest. Prove your speed under high-pressure live conditions.",
              link: "/join-room",
              color: "indigo"
            },
            { 
              title: "Top 100", 
              desc: "The absolute elite. Analyze the top performing sequences and optimize your standing in the grid.",
              link: "/leaderboard",
              color: "emerald"
            }
          ].map((card, i) => (
            <div key={i} className="group relative bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
              <h3 className="text-2xl font-black text-white tracking-tighter mb-4 uppercase">{card.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                {card.desc}
              </p>
              <Link to={card.link} className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                Engage <ChevronRight size={16} />
              </Link>
            </div>
          ))}
        </section>

        {/* --- THE WHY SECTION --- */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600/10 to-transparent border border-white/5 rounded-[3rem] p-10 md:p-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-black tracking-tighter text-white mb-6 uppercase">Why the Grid chooses <br/>CodePlay?</h3>
              <div className="grid gap-6">
                {[
                  "Synchronized real-time battle logic",
                  "Host-managed administrative override",
                  "Low-latency global problem clusters",
                  "Advanced ranked sequence tracking"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-300 font-bold tracking-tight">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Zap size={12} className="fill-current" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:block bg-black/40 rounded-3xl p-8 border border-white/5 italic font-mono text-sm text-blue-400">
               <span className="text-slate-600">// SYSTEM_INITIALIZATION</span> <br/>
               {">"} loading arena... [OK] <br/>
               {">"} establishing sync... [OK] <br/>
               {">"} latency 0.04ms <br/>
               {">"} Welcome back, Pilot.
            </div>
          </div>
        </section>

        <footer className="text-center pb-12">
          <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.4em]">
            Secured Connection &bull; CodePlay Protocol &bull; v2.0
          </p>
        </footer>
      </main>

      {/* --- OVERLAY --- */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Dashboard;