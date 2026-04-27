import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative overflow-hidden">
      {/* animated background blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30 backdrop-blur-md relative z-20 sticky top-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="text-2xl text-gray-300 hover:text-white transition"
          >
            ☰
          </button>

          <h1 className="text-lg md:text-2xl font-bold tracking-wide">
            CodePlay
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <span className="hover:text-white transition">Competitive Coding</span>
          <span className="hover:text-white transition">Live Rooms</span>
          <span className="hover:text-white transition">Rank Battles</span>
        </div>

        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-300 transition"
        >
          Logout
        </button>
      </header>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* CRAZY SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-black/70 backdrop-blur-2xl border-r border-white/10 p-7 z-50 shadow-2xl transform transition-all duration-500 ease-out ${
          open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            CodePlay
          </h1>

          <button
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-white text-xl transition"
          >
            ✕
          </button>
        </div>

        <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400 mb-1">Current Status</p>
          <h3 className="font-semibold text-white">Ready to Compete ⚡</h3>
        </div>

        <nav className="flex flex-col gap-4 text-sm">
          {[
            ["/dashboard", "Dashboard"],
            ["/create-room", "Create Room"],
            ["/join-room", "Join Room"],
            ["/leaderboard", "Leaderboard"],
            ["/profile", "Profile"],
          ].map(([path, label], index) => (
            <Link
              key={index}
              to={path}
              onClick={() => setOpen(false)}
              className="group px-4 py-3 rounded-xl bg-white/0 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-300"
            >
              <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                {label}
              </span>
            </Link>
          ))}

          <button
            onClick={logout}
            className="text-left px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="p-6 md:p-10 relative z-10 space-y-10">

        {/* HERO SECTION */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl">
          <p className="text-cyan-300 text-sm mb-3 tracking-widest uppercase">
            Welcome to the Arena
          </p>

          <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Code. Compete. <br />
            Conquer the Leaderboard.
          </h2>

          <p className="text-gray-400 max-w-2xl text-lg mb-8">
            CodePlay is your competitive coding battleground where developers
            challenge friends, solve real problems, and climb the ranks through
            intense live coding battles.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/create-room"
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition"
            >
              Create Battle Room
            </Link>

            <Link
              to="/join-room"
              className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
            >
              Join Contest
            </Link>
          </div>
        </section>

        {/* FEATURE STATS */}
        <section className="grid md:grid-cols-4 gap-6">
          {[
            ["500+", "Active Coders"],
            ["120+", "Live Rooms"],
            ["1000+", "Problems Solved"],
            ["24/7", "Competitive Arena"],
          ].map(([value, label], index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:-translate-y-1 transition"
            >
              <h3 className="text-3xl font-bold mb-2">{value}</h3>
              <p className="text-gray-400 text-sm">{label}</p>
            </div>
          ))}
        </section>

        {/* MAIN FEATURE CARDS */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-white/20 hover:scale-[1.02] transition">
            <h3 className="text-xl font-semibold mb-3">Create Room</h3>
            <p className="text-gray-400 mb-5">
              Launch private contests with friends, manage problems, and become the host of your own coding war.
            </p>
            <Link to="/create-room" className="text-white font-medium">Start →</Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-white/20 hover:scale-[1.02] transition">
            <h3 className="text-xl font-semibold mb-3">Join Room</h3>
            <p className="text-gray-400 mb-5">
              Enter a room code, face real opponents, and prove your problem-solving speed under pressure.
            </p>
            <Link to="/join-room" className="text-white font-medium">Join →</Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-white/20 hover:scale-[1.02] transition">
            <h3 className="text-xl font-semibold mb-3">Leaderboard</h3>
            <p className="text-gray-400 mb-5">
              Every submission matters. Track your rank and dominate the CodePlay leaderboard.
            </p>
            <Link to="/leaderboard" className="text-white font-medium">View →</Link>
          </div>
        </section>

        {/* WHY CODEPLAY */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10">
          <h3 className="text-3xl font-bold mb-6">Why Developers Choose CodePlay</h3>

          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              ⚡ Real-time coding battles with friends and teammates
            </div>
            <div>
              🏆 Host-controlled contests with leaderboard ranking
            </div>
            <div>
              🔥 Competitive environment inspired by top coding platforms
            </div>
            <div>
              🚀 Fast UI built for performance and developer focus
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
