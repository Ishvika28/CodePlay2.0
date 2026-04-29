import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Sword } from "lucide-react"

function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()
      if (response.ok) {
        alert("Account created successfully")
        navigate("/login")
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Something went wrong")
    }
  }

  const getStrengthColor = () => {
    if (password.length > 10) return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
    if (password.length > 6) return "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]"
    if (password.length > 0) return "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
    return "bg-slate-800"
  }

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 flex flex-col items-center justify-center px-6 overflow-hidden">
      
      {/* Absolute minimal background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-[700px]">
        
        {/* Centered Minimal Header - Matching Login sizing */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-6">
            <Sword className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Join CodePlay
          </h1>
          <p className="text-slate-400 font-medium text-base">
            Start your competitive coding journey
          </p>
        </div>

        {/* Wide Signup Card */}
        <div className="bg-slate-900/30 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-md shadow-2xl">
          
          <form onSubmit={handleSignup} className="space-y-6">
            
            {/* 2-Column Grid for Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                />
                <div className="flex items-center gap-2 pt-1 px-1">
                  <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-700 ${getStrengthColor()}`}
                      style={{ width: password.length > 0 ? (password.length > 10 ? '100%' : password.length > 6 ? '66%' : '33%') : '0%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 ml-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                />
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-all active:scale-[0.98] shadow-lg mt-2"
            >
              Create Account
            </button>

          </form>

          {/* Centered Footer */}
          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-slate-500 text-sm">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:text-blue-400 font-bold transition-colors ml-1"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        
      </div>
    </div>
  )
}

export default Signup