import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

function Room() {

  const { roomCode } = useParams()

  const [room, setRoom] = useState(null)
  const [tab, setTab] = useState("problems")

  const userId = localStorage.getItem("userId")

  const fetchRoom = async () => {
    const token = localStorage.getItem("token")

    const res = await fetch(`http://localhost:5000/api/rooms/${roomCode}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()
    setRoom(data)
  }

  useEffect(() => {
    fetchRoom()
    const interval = setInterval(fetchRoom, 3000)
    return () => clearInterval(interval)
  }, [])

  const startContest = async () => {
    const token = localStorage.getItem("token")

    await fetch(`http://localhost:5000/api/rooms/${roomCode}/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })

    fetchRoom()
  }

  if (!room) return <div className="text-white p-10">Loading...</div>

  const isHost = room.host === userId

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* 🔥 SIDEBAR */}
      <aside className="w-64 bg-black/50 backdrop-blur-lg border-r border-white/10 p-6 flex flex-col justify-between">

        <div>
          <h2 className="text-2xl font-semibold mb-8">⚔ Battleground</h2>

          <button
            onClick={() => setTab("problems")}
            className={`block w-full text-left px-3 py-2 rounded mb-2 ${
              tab === "problems" ? "bg-white text-black" : "hover:bg-white/10"
            }`}
          >
            Problems
          </button>

          <button
            onClick={() => setTab("leaderboard")}
            className={`block w-full text-left px-3 py-2 rounded ${
              tab === "leaderboard" ? "bg-white text-black" : "hover:bg-white/10"
            }`}
          >
            Leaderboard
          </button>
        </div>

        <div className="text-sm text-gray-400">
          Room: {room.roomCode}
        </div>

      </aside>

      {/* 🔥 MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">

        <h1 className="text-3xl font-bold mb-6">{room.roomName}</h1>

        {/* 🟡 LOBBY */}
        {room.status === "waiting" && (
          <div className="grid md:grid-cols-2 gap-6">

            {/* Room Info */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h2 className="text-xl mb-4">Room Code</h2>
              <p className="text-3xl font-bold tracking-widest">
                {room.roomCode}
              </p>
            </div>

            {/* Participants */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h2 className="text-xl mb-4">Players</h2>

              {room.participants.map((p, i) => (
                <div key={i} className="py-1">
                  • {p.name}
                </div>
              ))}
            </div>

            {/* Start Button */}
            {isHost && (
              <div className="col-span-2">
                <button
                  onClick={startContest}
                  className="w-full py-4 bg-green-500 text-black text-lg font-semibold rounded-xl hover:bg-green-400 transition"
                >
                  🚀 Start Contest
                </button>
              </div>
            )}

          </div>
        )}

        {/* 🟢 RUNNING - PROBLEMS */}
        {room.status === "running" && tab === "problems" && (
          <div className="grid gap-4">

            {room.problems.map((p, i) => (
              <div
                key={p._id}
                className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">
                    {i + 1}. {p.title}
                  </h3>
                </div>

                <Link
                  to={`/room/${roomCode}/problem/${p._id}`}
                  className="px-4 py-2 bg-white text-black rounded-lg"
                >
                  Solve
                </Link>
              </div>
            ))}

          </div>
        )}

        {/* 🟢 LEADERBOARD */}
        {room.status === "running" && tab === "leaderboard" && (
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h2 className="text-xl mb-4">Leaderboard</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        )}

      </main>
    </div>
  )
}

export default Room