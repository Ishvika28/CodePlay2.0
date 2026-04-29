import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sword, LogIn, Menu, LayoutDashboard, PlusCircle, Trophy, User } from "lucide-react";

function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/rooms/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ roomCode }),
    });

    const data = await res.json();

    if (res.ok) {
      navigate(`/room/${roomCode}`);
    } else {
      alert(data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="h-screen w-full bg-slate-950 text-white relative overflow-hidden flex items-center justify-center px-4">
      
      {/* --- SIDEBAR START --- */}
      <button 
        onClick={() => setOpen(true)}
        className="absolute top-6 left-6 z-40 p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition shadow-xl"
      >
        <Menu className="w-6 h-6 text-gray-300" />
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-black/80 backdrop-blur-3xl border-r border-white/10 p-7 z-50 shadow-2xl transform transition-all duration-500 ease-out ${
          open ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-2xl font-bold text-white tracking-wide">CodePlay</h1>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white transition text-xl">✕</button>
        </div>

        <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/10">
          <p className="text-xs text-gray-400 mb-1 font-medium tracking-wider">STATUS</p>
          <h3 className="font-semibold text-white flex items-center gap-2">Ready to Compete <span className="animate-pulse">⚡</span></h3>
        </div>

        <nav className="flex flex-col gap-3 text-sm">
          {[
            { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
            { path: "/create-room", label: "Create Room", icon: <PlusCircle size={18} /> },
            { path: "/join-room", label: "Join Room", icon: <LogIn size={18} /> },
            { path: "/leaderboard", label: "Leaderboard", icon: <Trophy size={18} /> },
            { path: "/profile", label: "Profile", icon: <User size={18} /> },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 border ${
                item.path === "/join-room" 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-transparent border-transparent hover:bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={logout}
            className="text-left flex items-center gap-3 px-4 py-3.5 mt-4 rounded-xl hover:bg-red-500/10 text-red-400/80 hover:text-red-400 transition-all duration-300 font-medium"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay to close sidebar */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />}
      {/* --- SIDEBAR END --- */}

      {/* Dynamic Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[110px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[110px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 mb-5 bg-white/5 border border-white/10 rounded-2xl shadow-xl">
            <LogIn className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Enter the Arena
          </h2>
          <p className="text-gray-400 mt-3 text-lg">
            Got a code? Paste it below to join an active battleground.
          </p>
        </div>

        {/* Join Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl">
          <form onSubmit={handleJoinRoom} className="space-y-6">
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-400 ml-1 uppercase tracking-widest">
                Room Code
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Paste Code Here"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 pl-14 text-xl tracking-widest uppercase placeholder:text-gray-600 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all duration-300"
                />
                <Sword className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full overflow-hidden rounded-2xl bg-white p-5 text-xl font-extrabold text-black transition-all hover:scale-[1.01] active:scale-[0.98] mt-2 shadow-[0_10px_40px_rgba(255,255,255,0.1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative flex items-center justify-center gap-2 uppercase tracking-wide">
                Join Battle <LogIn className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;