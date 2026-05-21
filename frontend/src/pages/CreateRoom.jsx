import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { 
  Sword, 
  Settings, 
  Users, 
  Clock, 
  Trophy, 
  Hash, 
  Menu, 
  X, 
  LayoutDashboard, 
  PlusCircle, 
  LogIn, 
  UserCircle 
} from "lucide-react"

function CreateRoom() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false) // Sidebar state

  const [form, setForm] = useState({
    roomName: "",
    difficulty: "any",
    topic: "any",
    problemCount: 3,
    duration: 30,
    maxParticipants: 10
  })

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    navigate("/login")
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (["problemCount", "duration", "maxParticipants"].includes(name)) {
      setForm({ ...form, [name]: Number(value) })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/create`, {
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
    <div className="h-screen w-full bg-[#020617] text-white relative overflow-hidden flex items-center justify-center px-4">
      
      {/* --- SIDEBAR TOGGLE BUTTON --- */}
      <button 
        onClick={() => setOpen(true)}
        className="absolute top-6 left-6 z-40 p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition shadow-xl text-blue-400"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* --- CRAZY SIDEBAR --- */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-slate-950/90 backdrop-blur-3xl border-r border-white/5 p-8 z-50 shadow-[50px_0_100px_-20px_rgba(0,0,0,0.5)] transform transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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

        <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400 mb-1 font-bold uppercase tracking-widest">Current Status</p>
          <h3 className="font-semibold text-white flex items-center gap-2">Ready to Compete ⚡</h3>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { path: "/dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
            { path: "/create-room", label: "Initialize Room", icon: <PlusCircle size={20} /> },
            { path: "/join-room", label: "Join Battle", icon: <LogIn size={20} /> },
            { path: "/leaderboard", label: "Global Ranks", icon: <Trophy size={20} /> },
            { path: "/profile", label: "Pilot Profile", icon: <UserCircle size={20} /> },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-bold tracking-tight ${
                item.path === "/create-room" 
                ? "bg-blue-600/10 border border-blue-500/20 text-white shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className={`${item.path === "/create-room" ? "text-blue-400" : "group-hover:text-blue-400"} transition-colors`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}

          <button
            onClick={logout}
            className="text-left flex items-center gap-3 px-5 py-4 mt-4 rounded-xl hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition-all duration-300 font-bold"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay to close sidebar */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[110px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[110px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2.5 mb-4 bg-white/5 border border-white/10 rounded-2xl shadow-xl">
            <Sword className="w-7 h-7 text-blue-400" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 italic uppercase">
            Initialize Battleground
          </h2>
          <p className="text-gray-400 mt-2 text-base font-medium">
            Configure your arena and let the code war begin.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Room Name Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">
                <Settings className="w-4 h-4 text-blue-400" /> Room Name
              </label>
              <input
                name="roomName"
                placeholder="The Binary Pit"
                value={form.roomName}
                onChange={handleChange}
                required
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300"
              />
            </div>

            {/* Selection Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">
                  <Trophy className="w-4 h-4 text-yellow-500" /> Difficulty
                </label>
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none cursor-pointer"
                >
                  <option className="bg-slate-900" value="any">Any Difficulty</option>
                  <option className="bg-slate-900" value="easy">Easy</option>
                  <option className="bg-slate-900" value="medium">Medium</option>
                  <option className="bg-slate-900" value="hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">
                  <Hash className="w-4 h-4 text-indigo-400" /> Topic
                </label>
                <select
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 appearance-none cursor-pointer"
                >
                  <option className="bg-slate-900" value="any">Any Topic</option>
                  <option className="bg-slate-900" value="array">Array</option>
                  <option className="bg-slate-900" value="string">String</option>
                  <option className="bg-slate-900" value="dp">DP</option>
                  <option className="bg-slate-900" value="graph">Graph</option>
                </select>
              </div>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Problems</label>
                <div className="relative group">
                  <input
                    type="number"
                    name="problemCount"
                    value={form.problemCount}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                  />
                  <Settings className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Minutes</label>
                <div className="relative group">
                  <input
                    type="number"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                  />
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 ml-1">Players</label>
                <div className="relative group">
                  <input
                    type="number"
                    name="maxParticipants"
                    value={form.maxParticipants}
                    onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
                  />
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full overflow-hidden rounded-2xl bg-white p-5 text-lg font-black text-black transition-all hover:scale-[1.01] active:scale-[0.98] mt-2 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center justify-center gap-2 uppercase tracking-wide">
                Initialize Battle <Sword className="w-5 h-5 transition-transform group-hover:rotate-12" />
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateRoom