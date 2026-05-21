import { useEffect, useState } from "react";

import {
  Trophy,
  Users,
  Calendar,
  ChevronRight,
  X,
  LayoutDashboard,
  PlusCircle,
  LogIn,
  UserCircle,
  Menu,
  Sword,
  Activity,
  Zap,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

function MatchHistory() {

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  useEffect(() => {

    const fetchHistory = async () => {

      try {

        const res = await fetch(
          "http://localhost:5000/api/match-history"
        );

        const data = await res.json();

        const currentUser =
          localStorage.getItem("name");

        const filtered = data.filter((match) => {

          if (
            Array.isArray(match.participants)
          ) {
            return match.participants.includes(
              currentUser
            );
          }

          return (
            match.winnerName === currentUser ||

            match.rankings?.some(
              (player) =>
                player.name === currentUser
            )
          );
        });

        setMatches(filtered);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    fetchHistory();

  }, []);

  return (

    <div className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden font-sans">

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>

        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

      </div>

      {/* NAVBAR */}
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

            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
              CodePlay
            </h1>

          </div>

        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">

          <span className="hover:text-blue-400 cursor-pointer transition-colors flex items-center gap-2 text-blue-400">

            <Zap size={14} className="fill-blue-400" />

            Battle Archive

          </span>

        </nav>

        <button
          onClick={logout}
          className="px-5 py-2 rounded-lg border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
        >
          Disconnect
        </button>

      </header>

      {/* SIDEBAR */}
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

        <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">

          <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-widest">
            Current Status
          </p>

          <h3 className="font-semibold text-white flex items-center gap-2">
            Reviewing Battles ⚡
          </h3>

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

          ].map((item, index) => (

            <Link
              key={index}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold tracking-tight ${
                item.path === "/match-history"
                  ? "bg-blue-600/10 border border-blue-500/20 text-white shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >

              <span className={`${
                item.path === "/match-history"
                  ? "text-blue-400"
                  : "group-hover:text-blue-400"
              } transition-colors`}>
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

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* MAIN */}
      <main className="p-6 md:p-12 relative z-10 max-w-7xl mx-auto">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900/20 backdrop-blur-3xl shadow-2xl p-10 md:p-14 mb-10">

          <div className="absolute top-0 right-0 opacity-10">

            <Trophy
              size={300}
              className="text-blue-500"
            />

          </div>

          <div className="relative z-10">

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">

              <Activity size={12} />

              Match Records

            </div>

            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-tight mb-5">

              Battle Archive

            </h1>

            <p className="text-slate-400 max-w-2xl leading-relaxed text-base">

              Analyze your previous coding battles, review rankings,
              and track your competitive performance across contests.

            </p>

          </div>

        </section>

        {/* STATS */}
        <section className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-[#0b1120]/50 border border-white/5 rounded-3xl p-5 backdrop-blur-xl">

            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
              Total Battles
            </p>

            <h2 className="text-4xl font-black text-white">
              {matches.length}
            </h2>

          </div>

          <div className="bg-[#0b1120]/50 border border-white/5 rounded-3xl p-5 backdrop-blur-xl">

            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
              Victories
            </p>

            <h2 className="text-4xl font-black text-yellow-400">

              {
                matches.filter(
                  (m) =>
                    m.winnerName ===
                    localStorage.getItem("name")
                ).length
              }

            </h2>

          </div>

          <div className="bg-[#0b1120]/50 border border-white/5 rounded-3xl p-5 backdrop-blur-xl">

            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">
              Win Rate
            </p>

            <h2 className="text-4xl font-black text-blue-400">

              {matches.length > 0
                ? Math.round(
                    (
                      matches.filter(
                        (m) =>
                          m.winnerName ===
                          localStorage.getItem("name")
                      ).length /
                      matches.length
                    ) * 100
                  )
                : 0}%

            </h2>

          </div>

        </section>

        {/* MATCHES */}
        {loading ? (

          <div className="text-slate-500">
            Loading battles...
          </div>

        ) : matches.length === 0 ? (

          <div className="bg-[#0b1120]/50 border border-white/5 rounded-[2rem] p-10 text-center">

            <h2 className="text-3xl font-black mb-3">
              No Battles Found
            </h2>

            <p className="text-slate-500 mb-6">
              Start competing to build your archive.
            </p>

            <Link
              to="/join-room"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-bold"
            >
              Join Battle
            </Link>

          </div>

        ) : (

          <div className="grid xl:grid-cols-2 gap-6">

            {matches.map((match) => (

              <div
                key={match._id}
                className="bg-[#0b1120]/50 border border-white/5 rounded-[2rem] p-6 hover:border-blue-500/20 hover:bg-white/[0.03] hover:-translate-y-1 transition-all duration-300"
              >

                <div className="flex items-center justify-between mb-6">

                  <div>

                    <h2 className="text-2xl font-black tracking-tight italic text-white mb-2">
                      {match.roomName}
                    </h2>

                    <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">
                      Room Code: {match.roomCode}
                    </p>

                  </div>

                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">

                    <Trophy className="text-blue-400" />

                  </div>

                </div>

                <div className="flex flex-wrap gap-3 mb-6">

                  <div className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold uppercase tracking-widest">

                    Winner: {match.winnerName}

                  </div>

                  <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">

                    {match.participantCount} Players

                  </div>

                  <div className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest">

                    {new Date(
                      match.createdAt
                    ).toLocaleDateString()}

                  </div>

                </div>

                <button
                  onClick={() =>
                    setSelectedMatch(match)
                  }
                  className="w-full px-5 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-bold flex items-center justify-center gap-2"
                >

                  View Rankings

                  <ChevronRight size={18} />

                </button>

              </div>

            ))}

          </div>

        )}

      </main>

      {/* MODAL */}
      {selectedMatch && (

        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-6">

          <div className="w-full max-w-4xl bg-[#0f172a] border border-white/10 rounded-[2rem] p-8 relative shadow-2xl">

            <button
              onClick={() =>
                setSelectedMatch(null)
              }
              className="absolute top-5 right-5 text-slate-500 hover:text-white transition"
            >
              <X size={24} />
            </button>

            <div className="mb-8">

              <h2 className="text-4xl font-black italic tracking-tight text-white">
                {selectedMatch.roomName}
              </h2>

              <p className="text-slate-500 uppercase tracking-widest text-xs mt-3">
                Final Rankings
              </p>

            </div>

            <div className="overflow-hidden rounded-3xl border border-white/5">

              <table className="w-full">

                <thead className="bg-white/5 text-slate-400 uppercase text-xs tracking-widest">

                  <tr>

                    <th className="px-6 py-4 text-left">
                      Rank
                    </th>

                    <th className="px-6 py-4 text-left">
                      Player
                    </th>

                    <th className="px-6 py-4 text-left">
                      Solved
                    </th>

                    <th className="px-6 py-4 text-left">
                      Time
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {selectedMatch.rankings.map(
                    (user, index) => (

                    <tr
                      key={index}
                      className="border-t border-white/5 hover:bg-white/[0.03] transition"
                    >

                      <td className="px-6 py-4 font-black text-lg text-yellow-400">
                        #{index + 1}
                      </td>

                      <td className="px-6 py-4 font-bold text-white uppercase">
                        {user.name}
                      </td>

                      <td className="px-6 py-4 text-emerald-400 font-mono">
                        {user.solved}
                      </td>

                      <td className="px-6 py-4 text-blue-400 font-mono">
                        {Math.floor(
                          user.timeTakenMs / 1000
                        )}s
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default MatchHistory;