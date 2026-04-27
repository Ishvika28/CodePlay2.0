import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return <div className="min-h-screen bg-slate-950 text-white p-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative overflow-hidden">
      {/* animated background */}
      <div className="absolute -top-20 left-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>

      <div className="flex relative z-10">
        {/* OVERLAY */}
        {open && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => setOpen(false)}
          ></div>
        )}

        {/* TOGGLE SIDEBAR */}
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
            <h3 className="font-semibold text-white">Profile Loaded ⚡</h3>
          </div>

          <nav className="flex flex-col gap-4 text-sm">
            {[
              ["/dashboard", "Dashboard"],
              ["/create-room", "Create Room"],
              ["/join-room", "Join Room"],
              ["/leaderboard", "Leaderboard"],
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

            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl bg-white/10 border border-white/10"
            >
              Profile
            </Link>

            <button
              onClick={logout}
              className="text-left px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 md:p-12 space-y-8">
          <button
            onClick={() => setOpen(true)}
            className="mb-4 text-2xl text-gray-300 hover:text-white hover:scale-110 transition duration-300"
          >
            ☰
          </button>
          {/* Hero Profile Card */}
          <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-4xl font-bold shadow-xl">
                {user.name?.[0]}
              </div>

              <div className="flex-1">
                <p className="text-cyan-300 text-xs tracking-[0.3em] uppercase mb-2">
                  Developer Profile
                </p>

                <h2 className="text-4xl font-bold mb-2">{user.name}</h2>

                <p className="text-gray-400 mb-3">{user.email}</p>

                <div className="inline-flex px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm">
                  CodePlay Competitive Coder 🚀
                </div>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="grid md:grid-cols-4 gap-6">
            {[
              [user.rating || 0, "Current Rating"],
              [0, "Rooms Played"],
              [0, "Problems Solved"],
              ["--", "Global Rank"],
            ].map(([value, label], index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:-translate-y-2 hover:border-white/20 transition-all duration-300"
              >
                <p className="text-gray-400 text-sm mb-2">{label}</p>
                <h3 className="text-3xl font-bold">{value}</h3>
              </div>
            ))}
          </section>

          {/* About + Activity */}
          <section className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-2xl font-bold mb-4">About You</h3>
              <p className="text-gray-400 leading-relaxed">
                You are part of the CodePlay competitive coding arena where every
                room is a battle and every problem is a chance to climb the
                leaderboard. Build logic, move faster, and flex your rank.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
              <h3 className="text-2xl font-bold mb-4">Recent Activity</h3>
              <p className="text-gray-400">
                No recent battles yet. Join a room, solve problems, and start
                building your legacy ⚡
              </p>
            </div>
          </section>

          {/* Motivation Section */}
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-bold mb-4">Keep Climbing</h3>
            <p className="text-gray-400 mb-6 max-w-3xl">
              Great coders are built one solved problem at a time. Compete with
              friends, dominate contests, and let the leaderboard remember your
              name.
            </p>

            <Link
              to="/join-room"
              className="inline-block px-6 py-3 rounded-2xl bg-white text-black font-semibold hover:scale-105 transition duration-300"
            >
              Join Your Next Battle
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Profile;
