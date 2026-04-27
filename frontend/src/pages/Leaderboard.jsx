import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"

function Leaderboard() {

  const { roomCode } = useParams()
  const [leaders, setLeaders] = useState([])
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  useEffect(() => {

    fetch(`http://localhost:5000/api/leaderboard/${roomCode}`)
      .then(res => res.json())
      .then(data => setLeaders(data))

  }, [roomCode])

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white relative">

      <div className="gradient-mesh"></div>

      <div className="flex relative z-10">

        {/* Sidebar */}

        <aside className="w-64 h-screen bg-black/40 backdrop-blur-lg border-r border-white/10 p-6">

          <h1 className="text-2xl font-bold mb-10 text-blue-500">
            CodePlay
          </h1>

          <nav className="flex flex-col gap-5 text-gray-400">

            <Link to="/dashboard" className="hover:text-blue-400 transition">
              Dashboard
            </Link>

            <Link to="/create-room" className="hover:text-blue-400 transition">
              Create Room
            </Link>

            <Link to="/join-room" className="hover:text-blue-400 transition">
              Join Room
            </Link>

            <Link to="/leaderboard" className="text-blue-400">
              Leaderboard
            </Link>

            <Link to="/profile" className="hover:text-blue-400 transition">
              Profile
            </Link>

            <button
              onClick={logout}
              className="text-left hover:text-red-400 transition"
            >
              Logout
            </button>

          </nav>

        </aside>


        {/* Main Content */}

        <main className="flex-1 p-12">

          <h2 className="text-4xl font-bold mb-3">
            Leaderboard
          </h2>

          <p className="text-gray-400 mb-10">
            Top coders in this room
          </p>


          {/* Leaderboard Card */}

          <div className="bg-black/40 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur-lg">

            <table className="w-full text-center">

              <thead>

                <tr className="text-blue-400 border-b border-white/10">

                  <th className="py-3">Rank</th>
                  <th className="py-3">User</th>
                  <th className="py-3">Solved</th>
                  <th className="py-3">Time Complexity (ms)</th>
                  <th className="py-3">Space Complexity (MB)</th>
                  <th className="py-3">Time Taken (s)</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/5 hover:bg-white/5 transition text-gray-300"
                  >
                    <td className="py-4 font-bold text-blue-400">
                      #{index + 1}
                    </td>
                    <td className="py-4 font-medium text-white">
                      {user.name}
                    </td>
                    <td className="py-4 font-bold text-green-400">
                      {user.solved}
                    </td>
                    <td className="py-4 font-mono text-purple-400">
                      {user.executionTimeMs} ms
                    </td>
                    <td className="py-4 font-mono text-pink-400">
                      {user.memoryMB} MB
                    </td>
                    <td className="py-4 font-mono text-yellow-400">
                      {Math.floor(user.timeTakenMs / 1000)} s
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </main>

      </div>

    </div>

  )

}

export default Leaderboard