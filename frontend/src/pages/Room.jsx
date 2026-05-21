import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Sword, Users, Share2, Play, Trophy, Terminal, Menu, X, LayoutDashboard, PlusCircle, LogIn, UserCircle, Shield, ChevronRight } from "lucide-react"

function Room() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [tab, setTab] = useState("problems")
  const [open, setOpen] = useState(false)
  const userId = localStorage.getItem("userId")

  const fetchRoom = async () => {
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${roomCode}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setRoom(data)
    } catch (e) {
      console.error("Failed to sync arena.")
    }
  }

  useEffect(() => {
    fetchRoom()
    const interval = setInterval(fetchRoom, 3000)
    return () => clearInterval(interval)
  }, [])

  const startContest = async () => {
    const token = localStorage.getItem("token")
    await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${roomCode}/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchRoom()
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (!room) return (
    <div className="h-screen w-full bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-blue-400 font-black tracking-widest uppercase text-xs">Syncing Battleground...</p>
      </div>
    </div>
  )

  const isHost = room.isHost

  return (
    <div className="h-screen w-full bg-[#020617] text-slate-200 relative overflow-hidden flex">
      
      {/* --- SIDEBAR TOGGLE --- */}
      <button 
        onClick={() => setOpen(true)}
        className="absolute top-6 left-6 z-40 p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition shadow-xl text-blue-400"
      >
        <Menu size={20} />
      </button>

      {/* --- ELITE SIDEBAR --- */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-slate-950/90 backdrop-blur-3xl border-r border-white/5 p-8 z-50 shadow-2xl transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Sword className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic">CODEPLAY</span>
          </div>
          <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { path: "/dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
            { path: "/create-room", label: "Initialize Room", icon: <PlusCircle size={20} /> },
            { path: "/join-room", label: "Join Battle", icon: <LogIn size={20} /> },
            { path: "/leaderboard", label: "Global Ranks", icon: <Trophy size={20} /> },
            { path: "/profile", label: "Pilot Profile", icon: <UserCircle size={20} /> },
          ].map((item, index) => (
            <Link key={index} to={item.path} onClick={() => setOpen(false)} className="group flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all font-bold tracking-tight">
              {item.icon} {item.label}
            </Link>
          ))}
          <button onClick={logout} className="text-left flex items-center gap-3 px-5 py-4 mt-4 rounded-xl hover:bg-red-500/10 text-red-400 font-bold">
            Logout
          </button>
        </nav>
      </aside>

      {/* --- SUB-NAVIGATION (Inner Sidebar for Problems/Leaderboard) --- */}
      <aside className="hidden lg:flex w-72 bg-slate-950/50 border-r border-white/5 flex-col pt-24 px-6 relative z-10">
        <div className="space-y-2">
          <button 
            onClick={() => setTab("problems")}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${tab === "problems" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-white/5"}`}
          >
            <Terminal size={18} /> Problems
          </button>
          <button 
            onClick={() => setTab("leaderboard")}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${tab === "leaderboard" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500 hover:bg-white/5"}`}
          >
            <Trophy size={18} /> Standings
          </button>
        </div>
        
        <div className="mt-auto mb-10 p-5 rounded-3xl bg-blue-600/5 border border-blue-500/10">
          <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-2">Battle Signal</p>
          <h4 className="text-xl font-mono font-bold text-white tracking-widest">{room.roomCode}</h4>
        </div>
      </aside>

      {/* --- MAIN ARENA --- */}
      <main className="flex-1 overflow-y-auto pt-24 px-6 md:px-12 pb-12 relative z-0">
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${room.status === 'running' ? 'bg-red-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${room.status === 'running' ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
                </span>
                {room.status === 'waiting' ? 'Lobby Open' : 'Combat In Progress'}
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">{room.roomName}</h1>
            </div>
          </header>

          {/* 🟡 LOBBY STATE */}
          {room.status === "waiting" && (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-3xl">
                  <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Users size={16} /> Enrolled Combatants ({room.participants.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {room.participants.map((p, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-blue-500/30 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center font-bold text-white">
                          {p.name[0]}
                        </div>
                        <div className="flex-1 font-bold text-slate-200">{p.name}</div>
                        {p._id === room.hostId && <Shield size={14} className="text-blue-400" />}
                      </div>
                    ))}
                  </div>
                </section>

                {isHost && (
                  <button 
                    onClick={startContest}
                    disabled={room.participants.length < 2}
                    className={`w-full group relative overflow-hidden rounded-[2rem] p-6 text-xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${room.participants.length < 2 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-black hover:bg-blue-50'}`}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {room.participants.length < 2 ? 'Waiting for Rivals' : 'Initiate Sequence'} <Play className="fill-current" size={20} />
                    </span>
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(37,99,235,0.2)] text-white relative overflow-hidden">
                  <Share2 className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
                  <h4 className="text-xs font-black uppercase tracking-widest opacity-80 mb-6">Invite Signal</h4>
                  <div className="text-4xl font-mono font-black tracking-[0.2em] mb-4">{room.roomCode}</div>
                  <p className="text-sm font-medium opacity-70">Share this code with teammates to join the arena.</p>
                </div>
              </div>
            </div>
          )}

          {/* 🟢 RUNNING STATE */}
          {room.status === "running" && tab === "problems" && (
            <div className="grid gap-6">
              {room.problems.map((p, i) => (
                <div key={p._id} className="group relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 hover:bg-white/5 hover:border-blue-500/30 transition-all duration-500 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-blue-400 border border-white/5 text-xl">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">{p.title}</h3>
                      <div className="flex gap-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Difficulty: {p.difficulty || 'Any'}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Points: 100</span>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to={`/room/${roomCode}/problem/${p._id}`}
                    className="w-full md:w-auto px-10 py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    Solve Task <ChevronRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* 🟢 LEADERBOARD STATE */}
          {room.status === "running" && tab === "leaderboard" && (
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto">
                <Trophy size={40} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Standings Calculation</h2>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">The grid is currently calculating real-time rankings. Data transmission will resume shortly.</p>
            </div>
          )}
        </div>
      </main>

      {/* --- SIDEBAR OVERLAY --- */}
      {open && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />}
    </div>
  )
}

export default Room