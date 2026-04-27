import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AddProblem() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const [form, setForm] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    topic: "array",
    sampleTestCases: [{ input: "", output: "" }],
    hiddenTestCases: [{ input: "", output: "" }]
  });

  const topics = [
    "array",
    "string",
    "math",
    "recursion",
    "dp",
    "graph",
    "greedy"
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value.toLowerCase()
    });
  };

  const handleTestCaseChange = (index, field, value, type) => {
    const updated = [...form[type]];
    updated[index][field] = value;
    setForm({ ...form, [type]: updated });
  };

  const addTestCase = (type) => {
    setForm({
      ...form,
      [type]: [...form[type], { input: "", output: "" }]
    });
  };

  const removeTestCase = (index, type) => {
    if (form[type].length === 1) return;

    const updated = form[type].filter((_, i) => i !== index);
    setForm({ ...form, [type]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const cleanedForm = {
      ...form,
      topic: form.topic.toLowerCase(),
      difficulty: form.difficulty.toLowerCase()
    };

    const res = await fetch("http://localhost:5000/api/problems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(cleanedForm)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Problem created successfully");
      navigate("/admin/problems");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md z-50 relative">

        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen(true)}
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
          className="fixed inset-0 bg-black/60 z-20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 p-6 z-30 transform transition-transform duration-300 ${
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

          <Link to="/admin/add-problem" onClick={() => setOpen(false)} className="text-white font-medium">
            Add Problem
          </Link>

          <Link to="/admin/problems" onClick={() => setOpen(false)}>
            View Problems
          </Link>

        </nav>
      </aside>

      {/* MAIN */}
      <main className="p-6 md:p-10 relative z-10">

        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Add Problem
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-xl"
        >

          <input
            name="title"
            placeholder="Problem Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          />

          <textarea
            name="description"
            placeholder="Detailed problem description"
            value={form.description}
            onChange={handleChange}
            required
            rows="5"
            className="w-full p-3 bg-black/40 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          />

          <select
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
          >
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
          >
            <option value="easy">EASY</option>
            <option value="medium">MEDIUM</option>
            <option value="hard">HARD</option>
          </select>

          {["sampleTestCases", "hiddenTestCases"].map((type) => (
            <div key={type}>
              <h2 className="text-xl font-semibold mb-4 capitalize border-b border-white/10 pb-2">
                {type}
              </h2>

              {form[type].map((tc, i) => (
                <div key={i} className="grid md:grid-cols-2 gap-3 mb-4">

                  <textarea
                    placeholder="Input"
                    value={tc.input}
                    onChange={(e) =>
                      handleTestCaseChange(i, "input", e.target.value, type)
                    }
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
                  />

                  <textarea
                    placeholder="Output"
                    value={tc.output}
                    onChange={(e) =>
                      handleTestCaseChange(i, "output", e.target.value, type)
                    }
                    className="w-full p-3 bg-black/40 border border-white/10 rounded-lg"
                  />

                  <button
                    type="button"
                    onClick={() => removeTestCase(i, type)}
                    className="px-3 py-2 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30"
                  >
                    Remove
                  </button>

                </div>
              ))}

              <button
                type="button"
                onClick={() => addTestCase(type)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + Add Test Case
              </button>
            </div>
          ))}

          <button className="w-full bg-white text-black p-3 rounded-lg font-medium hover:bg-gray-200 transition">
            Create Problem
          </button>

        </form>
      </main>
    </div>
  );
}

export default AddProblem;