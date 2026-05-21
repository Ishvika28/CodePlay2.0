import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sword,
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  LogIn,
  Trophy,
  UserCircle,
  Zap,
  Activity,
  Terminal,
  ChevronRight,
  ShieldCheck,
  Target,
} from "lucide-react";

function Profile() {
  const [user, setUser] = useState(null);

  const [matchCount, setMatchCount] = useState(0);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setUser(data);

      // MATCH HISTORY
      const historyRes = await fetch(`${import.meta.env.VITE_API_URL}/api/match-history`);

      const historyData = await historyRes.json();

      const currentUser = localStorage.getItem("name");

      const personalMatches = historyData.filter((match) =>
        match.participants?.includes(currentUser),
      );

      setMatchCount(personalMatches.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-400 font-black tracking-widest uppercase text-xs">
            Synchronizing Profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-x-hidden font-sans">
      {/* --- HYPER-STYLIZED BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* --- SIDEBAR TOGGLE --- */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-8 left-8 z-40 p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all hover:scale-110 active:scale-95 shadow-2xl"
      >
        <Menu className="w-6 h-6 text-blue-400" />
      </button>

      {/* --- ELITE SIDEBAR --- */}
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
            <span className="text-2xl font-black tracking-tighter italic">
              CODEPLAY
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            {
              path: "/dashboard",
              label: "Overview",
              icon: <LayoutDashboard size={20} />,
            },
            {
              path: "/create-room",
              label: "Initialize Room",
              icon: <PlusCircle size={20} />,
            },
            {
              path: "/join-room",
              label: "Join Battle",
              icon: <LogIn size={20} />,
            },
            {
              path: "/leaderboard",
              label: "Global Ranks",
              icon: <Trophy size={20} />,
            },
            {
              path: "/match-history",
              label: "Battle Archive",
              icon: <Activity size={20} />,
            },
            {
              path: "/profile",
              label: "Pilot Profile",
              icon: <UserCircle size={20} />,
            },
          ].map((item, index) => {
            const isActive = item.path === "/profile";
            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold tracking-tight ${
                  isActive
                    ? "bg-blue-600/10 border border-blue-500/20 text-white shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <span
                  className={`${isActive ? "text-blue-400" : "group-hover:text-blue-400"} transition-colors`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="absolute bottom-10 left-8 right-8 py-4 rounded-2xl border border-slate-800 text-slate-500 font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all duration-300"
        >
          Terminate Session
        </button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="p-6 md:p-12 lg:pt-24 relative z-10 space-y-10 max-w-[1600px] mx-auto">
        {/* --- PROFILE HERO CARD --- */}
        <section className="relative group rounded-[3rem] overflow-hidden border border-white/5 bg-slate-900/20 backdrop-blur-3xl shadow-2xl p-10 md:p-16 w-full">
          {/* Background Watermark */}
          <div className="absolute top-0 right-[-2%] p-8 text-blue-500/5 opacity-40 select-none hidden xl:block">
            <UserCircle size={500} strokeWidth={0.5} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {/* Avatar with Glow */}
            <div className="relative">
              <div className="w-36 h-36 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-5xl font-black text-white shadow-[0_0_50px_rgba(37,99,235,0.3)] border-2 border-white/10 italic">
                {user.name?.[0]}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-4 border-[#020617] animate-pulse">
                <ShieldCheck size={20} className="text-white" />
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <Zap size={12} className="fill-current" /> Verified Competitive
                Coder
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase italic mb-2">
                {user.name}
              </h2>
              <p className="text-slate-500 text-lg font-medium tracking-tight mb-6">
                {user.email} &bull;{" "}
                <span className="text-blue-500/80 underline decoration-blue-500/20 underline-offset-4 cursor-pointer hover:text-blue-400 transition-colors uppercase italic text-sm">
                  Update Pilot Settings
                </span>
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                  <Activity size={14} className="text-blue-400" /> Member since{" "}
                  {new Date().getFullYear()}
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                  <Target size={14} className="text-emerald-400" /> Rank:
                  Initiate
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- STATS GRID --- */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              val: user.rating || 0,
              label: "Pilot Rating",
              icon: <Trophy className="text-yellow-500" />,
            },

            {
              val: matchCount,
              label: "Battle History",
              icon: <Activity className="text-blue-500" />,
              path: "/match-history",
            },

            {
              val: "0",
              label: "Data Tasks",
              icon: <Terminal className="text-emerald-500" />,
            },

            {
              val: "--",
              label: "Global Rank",
              icon: <Zap className="text-indigo-500" />,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-[#0b1120]/50 border border-white/5 rounded-3xl p-8 hover:bg-white/5 transition-all group overflow-hidden relative"
            >
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="mb-4 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner">
                {stat.icon}
              </div>
              <h3 className="text-4xl font-black text-white tracking-tighter mb-1 uppercase italic">
                {stat.val}
              </h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* --- TWO COLUMN CONTENT --- */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* About Card */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            <h3 className="text-2xl font-black text-white tracking-tighter mb-4 uppercase italic">
              Pilot Bio
            </h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              You are an active node in the CodePlay competitive arena. Your
              profile is your battle log. As you solve problems and conquer
              rooms, your rank will evolve. Build your logic, sharpen your
              syntax, and prepare for the next deployment.
            </p>
          </div>

          {/* Activity Card */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            <h3 className="text-2xl font-black text-white tracking-tighter mb-4 uppercase italic">
              Recent Logs
            </h3>
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center">
                <Activity size={20} className="text-slate-700" />
              </div>
              <p className="text-slate-600 font-bold uppercase text-[10px] tracking-widest">
                No Recent Transmission Found
              </p>
            </div>
          </div>
        </div>

        {/* --- CALL TO ACTION --- */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600/10 to-transparent border border-white/5 rounded-[3rem] p-10 md:p-16 text-center">
          <h3 className="text-4xl font-black tracking-tighter text-white mb-6 uppercase italic">
            Ready for Deployment?
          </h3>
          <p className="text-slate-500 max-w-2xl mx-auto mb-10 font-medium text-lg">
            Don't let your rating stagnate. The grid is active and rivals are
            waiting.
          </p>
          <Link
            to="/join-room"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-black font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
          >
            Enter Arena <ChevronRight size={18} />
          </Link>
        </section>

        <footer className="text-center pb-12">
          <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.4em]">
            Pilot Authenticated &bull; End-to-End Latency: 0.04ms &bull; v2.0
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

export default Profile;
