import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login"; // force redirect (reliable)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative">

      <div className="gradient-mesh"></div>

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md relative z-50">

        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="text-gray-300 hover:text-white text-2xl"
          >
            ☰
          </button>

          <h1 className="text-lg md:text-xl font-semibold text-white">
            CodePlay Admin
          </h1>
        </div>

        {/* LOGOUT BUTTON */}
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

          <Link to="/admin" onClick={() => setOpen(false)} className="hover:text-white">
            Dashboard
          </Link>

          <Link to="/admin/add-problem" onClick={() => setOpen(false)} className="hover:text-white">
            Add Problem
          </Link>

          <Link to="/admin/problems" onClick={() => setOpen(false)} className="hover:text-white">
            View Problems
          </Link>

        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="p-6 md:p-10 relative z-0">

        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Dashboard
        </h2>

        <p className="text-gray-400 mb-8 text-sm md:text-base">
          Manage coding problems and platform content.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition">
            <h3 className="text-lg font-medium mb-2">Add Problem</h3>

            <p className="text-gray-400 text-sm mb-4">
              Create new coding challenges with test cases.
            </p>

            <Link to="/admin/add-problem" className="text-white text-sm">
              Go →
            </Link>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition">
            <h3 className="text-lg font-medium mb-2">View Problems</h3>

            <p className="text-gray-400 text-sm mb-4">
              Manage and review existing problems.
            </p>

            <Link to="/admin/problems" className="text-white text-sm">
              Go →
            </Link>
          </div>

        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;