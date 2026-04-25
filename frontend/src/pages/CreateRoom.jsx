import { useState } from "react"
import { useNavigate } from "react-router-dom"

function CreateRoom() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    roomName: "",
    difficulty: "any",
    topic: "any",
    problemCount: 3,
    duration: 30,
    maxParticipants: 10
  })

  // ✅ FIXED: Proper type handling
  const handleChange = (e) => {
    const { name, value } = e.target

    // convert numeric fields to number
    if (["problemCount", "duration", "maxParticipants"].includes(name)) {
      setForm({ ...form, [name]: Number(value) })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:5000/api/rooms/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (res.ok) {
      navigate(`/room/${data.roomCode}`)
    } else {
      alert(data.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white px-4">

      <div className="w-full max-w-xl bg-slate-900/60 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/10">

        <h1 className="text-3xl font-semibold mb-6 text-center">
          Create Battleground
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Room Name */}
          <div>
            <label className="text-sm text-gray-400">Room Name</label>
            <input
              name="roomName"
              placeholder="Enter room name"
              value={form.roomName}
              onChange={handleChange}
              required
              className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm text-gray-400">Difficulty</label>
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-white/10"
            >
              <option value="any">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="text-sm text-gray-400">Topic</label>
            <select
              name="topic"
              value={form.topic}
              onChange={handleChange}
              className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-white/10"
            >
              <option value="any">Any Topic</option>
              <option value="array">Array</option>
              <option value="string">String</option>
              <option value="math">Math</option>
              <option value="dp">DP</option>
              <option value="graph">Graph</option>
              <option value="greedy">Greedy</option>
            </select>
          </div>

          {/* Problem Count */}
          <div>
            <label className="text-sm text-gray-400">Number of Problems</label>
            <input
              type="number"
              name="problemCount"
              value={form.problemCount}
              onChange={handleChange}
              min="1"
              className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-white/10"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm text-gray-400">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              min="5"
              className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-white/10"
            />
          </div>

          {/* Max Participants */}
          <div>
            <label className="text-sm text-gray-400">Max Participants</label>
            <input
              type="number"
              name="maxParticipants"
              value={form.maxParticipants}
              onChange={handleChange}
              min="2"
              className="w-full mt-1 p-3 rounded-lg bg-slate-800 border border-white/10"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full p-3 mt-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
          >
            Create Room
          </button>

        </form>
      </div>
    </div>
  )
}

export default CreateRoom