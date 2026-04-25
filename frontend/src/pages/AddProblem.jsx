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
    topic: "",
    sampleTestCases: [{ input: "", output: "" }],
    hiddenTestCases: [{ input: "", output: "" }]
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    const updated = form[type].filter((_, i) => i !== index);
    setForm({ ...form, [type]: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/problems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Problem created");
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

          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="hover:text-white transition"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/add-problem"
            onClick={() => setOpen(false)}
            className="text-white font-medium"
          >
            Add Problem
          </Link>

          <Link
            to="/admin/problems"
            onClick={() => setOpen(false)}
            className="hover:text-white transition"
          >
            View Problems
          </Link>

        </nav>
      </aside>

      {/* MAIN */}
      <main className="p-6 md:p-10 relative z-10">

        {/* BIGGER HEADING */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Add Problem
        </h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 space-y-6"
        >

          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            className="w-full p-3 bg-black/40 rounded-lg"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="w-full p-3 bg-black/40 rounded-lg"
          />

          <input
            name="topic"
            placeholder="Topic (Arrays, DP...)"
            onChange={handleChange}
            className="w-full p-3 bg-black/40 rounded-lg"
          />

          <select
            name="difficulty"
            onChange={handleChange}
            className="w-full p-3 bg-black/40 rounded-lg"
          >
            <option>easy</option>
            <option>medium</option>
            <option>hard</option>
          </select>

          {/* TEST CASES */}
          {["sampleTestCases", "hiddenTestCases"].map((type) => (
            <div key={type}>
              <h2 className="text-lg font-semibold mb-3 capitalize">
                {type}
              </h2>

              {form[type].map((tc, i) => (
                <div key={i} className="flex gap-3 mb-3">

                  <input
                    placeholder="input"
                    onChange={(e)=>handleTestCaseChange(i,"input",e.target.value,type)}
                    className="flex-1 p-2 bg-black/40 rounded"
                  />

                  <input
                    placeholder="output"
                    onChange={(e)=>handleTestCaseChange(i,"output",e.target.value,type)}
                    className="flex-1 p-2 bg-black/40 rounded"
                  />

                  <button
                    type="button"
                    onClick={()=>removeTestCase(i,type)}
                    className="px-3 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30"
                  >
                    ✕
                  </button>

                </div>
              ))}

              <button
                type="button"
                onClick={()=>addTestCase(type)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + Add Test Case
              </button>
            </div>
          ))}

          <button className="w-full bg-white text-black p-3 rounded-lg font-medium hover:bg-gray-200">
            Create Problem
          </button>

        </form>
      </main>
    </div>
  );
}

export default AddProblem;