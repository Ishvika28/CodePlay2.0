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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative">

      <div className="gradient-mesh"></div>

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/30 backdrop-blur-md relative z-20">

        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="text-2xl text-gray-300 hover:text-white"
          >
            ☰
          </button>

          <h1 className="text-lg md:text-xl font-semibold">
            CodePlay
          </h1>
        </div>

        <button
          onClick={logout}
          className="text-sm text-red-400 hover:text-red-300"
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

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 p-6 z-30 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >

        <h1 className="text-xl font-semibold mb-8 text-white">
          CodePlay
        </h1>

        <nav className="flex flex-col gap-6 text-gray-300 text-sm">

          <Link to="/dashboard" onClick={()=>setOpen(false)} className="hover:text-white">
            Dashboard
          </Link>

          <Link to="/create-room" onClick={()=>setOpen(false)} className="hover:text-white">
            Create Room
          </Link>

          <Link to="/join-room" onClick={()=>setOpen(false)} className="hover:text-white">
            Join Room
          </Link>

          <Link to="/leaderboard" onClick={()=>setOpen(false)} className="hover:text-white">
            Leaderboard
          </Link>

          <Link to="/profile" onClick={()=>setOpen(false)} className="hover:text-white">
            Profile
          </Link>

          <button
            onClick={logout}
            className="text-left hover:text-red-400"
          >
            Logout
          </button>

        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="p-6 md:p-10 relative z-10">

        <h2 className="text-3xl md:text-4xl font-semibold mb-3">
          Welcome to CodePlay
        </h2>

        <p className="text-gray-400 mb-10">
          Practice coding, challenge friends, and climb the leaderboard.
        </p>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition">
            <h3 className="text-lg font-medium mb-2">Create Room</h3>

            <p className="text-gray-400 text-sm mb-4">
              Start a coding battle with friends.
            </p>

            <Link to="/create-room" className="text-white text-sm">
              Start →
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition">
            <h3 className="text-lg font-medium mb-2">Join Room</h3>

            <p className="text-gray-400 text-sm mb-4">
              Enter a room code to compete.
            </p>

            <Link to="/join-room" className="text-white text-sm">
              Join →
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition">
            <h3 className="text-lg font-medium mb-2">Leaderboard</h3>

            <p className="text-gray-400 text-sm mb-4">
              See top coders on CodePlay.
            </p>

            <Link to="/leaderboard" className="text-white text-sm">
              View →
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;