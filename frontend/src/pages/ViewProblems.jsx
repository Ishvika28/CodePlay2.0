import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ViewProblems() {
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

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
      console.log(data); // debug

      if (res.ok) {
        fetchProblems();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const filtered = problems.filter((p) =>
    filter ? p.topic?.toLowerCase().includes(filter.toLowerCase()) : true
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md z-[100] relative">

        <button
          onClick={() => setOpen(!open)}
          className="text-2xl text-gray-300 hover:text-white"
        >
          ☰
        </button>

        <h1 className="text-xl font-semibold">Admin</h1>

        <button
        onClick={logout}
        className="px-4 py-1.5 text-sm bg-white/10 border border-white/20 rounded-md text-white hover:bg-white/20 transition"
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
        <h2 className="text-xl font-semibold mb-10">
          Admin Menu
        </h2>

        <nav className="flex flex-col gap-6 text-gray-300 text-sm">

          <Link to="/admin" onClick={()=>setOpen(false)}>
            Dashboard
          </Link>

          <Link to="/admin/add-problem" onClick={()=>setOpen(false)}>
            Add Problem
          </Link>

          <Link to="/admin/problems" onClick={()=>setOpen(false)} className="text-white font-medium">
            View Problems
          </Link>

        </nav>
      </aside>

      {/* MAIN */}
      <main className="p-6 md:p-10 relative z-10">

        {/* BIG HEADING */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
          Problem Management
        </h1>

        {/* FILTER */}
        <input
          placeholder="Filter by topic (Arrays, DP...)"
          onChange={(e) => setFilter(e.target.value)}
          className="mb-8 p-3 bg-black/40 border border-white/10 rounded-lg w-full md:w-1/2"
        />

        {filtered.length === 0 ? (
          <p className="text-gray-400">No problems found.</p>
        ) : (
          <div className="grid gap-6">

            {filtered.map((p) => (
              <div
                key={p._id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition"
              >
                <div className="flex justify-between items-center mb-3">

                  <h2 className="text-lg font-semibold">
                    {p.title}
                  </h2>

                  {/* IMPROVED DIFFICULTY */}
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

                </div>

                <p className="text-gray-400 text-sm mb-4">
                  {p.description}
                </p>

                {/* BUTTON */}
                <button
                  onClick={() => deleteProblem(p._id)}
                  className="px-4 py-1.5 text-sm bg-red-500/20 border border-red-500/30 rounded-md text-red-300 hover:bg-red-500/30 transition"
                >
                  Delete
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