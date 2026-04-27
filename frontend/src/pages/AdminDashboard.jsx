import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProblems: 0,
    easy: 0,
    medium: 0,
    hard: 0
  });

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/problems");
      const data = await res.json();

      const easy = data.filter((p) => p.difficulty === "easy").length;
      const medium = data.filter((p) => p.difficulty === "medium").length;
      const hard = data.filter((p) => p.difficulty === "hard").length;

      setStats({
        totalProblems: data.length,
        easy,
        medium,
        hard
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative">

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md relative z-50">

        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-300 hover:text-white text-2xl"
          >
            ☰
          </button>

          <h1 className="text-lg md:text-xl font-semibold text-white tracking-wide">
            CodePlay Admin
          </h1>
        </div>

        <button
          onClick={logout}
          className="px-4 py-1.5 text-sm bg-red-500/20 border border-red-500/30 rounded-md text-red-300 hover:bg-red-500/30 transition"
        >
          Logout
        </button>

      </header>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-10"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 p-6 z-30 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-lg font-semibold mb-8 text-white">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-6 text-gray-300 text-sm">

          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/add-problem"
            onClick={() => setOpen(false)}
            className="hover:text-white"
          >
            Add Problem
          </Link>

          <Link
            to="/admin/problems"
            onClick={() => setOpen(false)}
            className="hover:text-white"
          >
            View Problems
          </Link>

        </nav>
      </aside>

      {/* MAIN */}
      <main className="p-6 md:p-10 relative z-0">

        {/* TITLE */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Dashboard Control Center
          </h2>

          <p className="text-gray-400 text-sm md:text-base">
            Monitor your problem bank, manage coding battles, and pretend chaos is organized.
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-blue-400/30 transition">
            <p className="text-gray-400 text-sm mb-2">Total Problems</p>
            <h3 className="text-4xl font-bold">{stats.totalProblems}</h3>
          </div>

          <div className="bg-white/5 border border-green-500/20 rounded-2xl p-6">
            <p className="text-green-300 text-sm mb-2">Easy</p>
            <h3 className="text-4xl font-bold">{stats.easy}</h3>
          </div>

          <div className="bg-white/5 border border-yellow-500/20 rounded-2xl p-6">
            <p className="text-yellow-300 text-sm mb-2">Medium</p>
            <h3 className="text-4xl font-bold">{stats.medium}</h3>
          </div>

          <div className="bg-white/5 border border-red-500/20 rounded-2xl p-6">
            <p className="text-red-300 text-sm mb-2">Hard</p>
            <h3 className="text-4xl font-bold">{stats.hard}</h3>
          </div>

        </div>

        {/* ACTION PANELS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ADD PROBLEM */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition shadow-lg">
            <h3 className="text-2xl font-semibold mb-3">
              Add Problem
            </h3>

            <p className="text-gray-400 text-sm mb-6">
              Build fresh coding nightmares for users. Arrays, DP, Graphs... humanity suffers.
            </p>

            <Link
              to="/admin/add-problem"
              className="inline-block px-5 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200"
            >
              Add Problem →
            </Link>
          </div>

          {/* VIEW PROBLEMS */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition shadow-lg">
            <h3 className="text-2xl font-semibold mb-3">
              View Problems
            </h3>

            <p className="text-gray-400 text-sm mb-6">
              Edit, inspect, or delete existing questions before they embarrass your platform.
            </p>

            <Link
              to="/admin/problems"
              className="inline-block px-5 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200"
            >
              View Problems →
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;