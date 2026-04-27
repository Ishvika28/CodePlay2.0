import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ViewProblems() {
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const fetchProblems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/problems");
      const data = await res.json();
      setProblems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const deleteProblem = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/api/problems/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        fetchProblems();
      } else {
        alert(data.message);
      }
    } catch {
      alert("Delete failed");
    }
  };

  const filtered = problems.filter((p) =>
    filter
      ? p.topic?.toLowerCase().includes(filter.toLowerCase()) ||
        p.title?.toLowerCase().includes(filter.toLowerCase())
      : true
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md z-[100] relative">

        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(!open)}
            className="text-2xl text-gray-300 hover:text-white"
          >
            ☰
          </button>

          <h1 className="text-xl font-semibold tracking-wide">
            Admin Panel
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
          className="fixed inset-0 bg-black/60 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 p-6 z-40 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-semibold mb-10 text-white tracking-wide">
          Admin Menu
        </h2>

        <nav className="flex flex-col gap-6 text-gray-300 text-sm">

          <Link to="/admin" onClick={() => setOpen(false)}>
            Dashboard
          </Link>

          <Link to="/admin/add-problem" onClick={() => setOpen(false)}>
            Add Problem
          </Link>

          <Link
            to="/admin/problems"
            onClick={() => setOpen(false)}
            className="text-white font-medium"
          >
            View Problems
          </Link>

        </nav>
      </aside>

      {/* MAIN */}
      <main className="p-6 md:p-10 relative z-10">

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Problem Management
        </h1>

        <p className="text-gray-400 mb-8">
          Review, search, and manage your competitive coding library.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/admin/add-problem"
            className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
          >
            + Add Problem
          </Link>

          <button
            onClick={fetchProblems}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition"
          >
            Refresh Problems
          </button>
        </div>

        {/* FILTER */}
        <input
          placeholder="Filter by title or topic..."
          onChange={(e) => setFilter(e.target.value)}
          className="mb-8 p-3 bg-black/40 border border-white/10 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-white/20"
        />

        {filtered.length === 0 ? (
          <p className="text-gray-400">No problems found.</p>
        ) : (
          <div className="grid gap-6">

            {filtered.map((p) => (
              <div
                key={p._id}
                className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 hover:border-cyan-400/30 hover:scale-[1.01] transition shadow-lg"
              >

                {/* TOP SECTION */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">

                  <h2 className="text-xl font-semibold">
                    {p.title}
                  </h2>

                  <div className="flex gap-3 flex-wrap">

                    <span
                      className={`text-xs px-4 py-1 rounded-full font-semibold tracking-wide ${
                        p.difficulty === "easy"
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : p.difficulty === "medium"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {p.difficulty.toUpperCase()}
                    </span>

                    <span className="text-xs px-4 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {p.topic.toUpperCase()}
                    </span>

                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="text-gray-400 text-sm mb-4 whitespace-pre-wrap">
                  {p.description}
                </p>

                {/* TOGGLE DETAILS */}
                <button
                  onClick={() =>
                    setExpanded(expanded === p._id ? null : p._id)
                  }
                  className="text-sm text-cyan-300 hover:text-cyan-200 mb-4"
                >
                  {expanded === p._id ? "Hide Test Cases" : "View Test Cases"}
                </button>

                {/* TEST CASES */}
                {expanded === p._id && (
                  <div className="bg-black/30 rounded-xl p-4 mb-4 border border-white/10">
                    <h3 className="font-semibold mb-3 text-sm text-gray-300">
                      Sample Test Cases
                    </h3>

                    {p.sampleTestCases?.map((tc, i) => (
                      <div
                        key={i}
                        className="mb-4 p-3 bg-white/5 rounded-lg"
                      >
                        <p className="text-xs text-gray-400 mb-1">
                          Input:
                        </p>
                        <pre className="text-sm whitespace-pre-wrap">
                          {tc.input}
                        </pre>

                        <p className="text-xs text-gray-400 mt-2 mb-1">
                          Output:
                        </p>
                        <pre className="text-sm whitespace-pre-wrap">
                          {tc.output}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* DELETE */}
                <button
                  onClick={() => deleteProblem(p._id)}
                  className="px-4 py-1.5 text-sm bg-red-500/20 border border-red-500/30 rounded-md text-red-300 hover:bg-red-500/30 transition"
                >
                  Delete Problem
                </button>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default ViewProblems;