import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (data.token) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("role", data.user.role)
        localStorage.setItem("userId", data.user.id)
        if (data.user.role === "admin") {
          navigate("/admin")
        } else {
          navigate("/dashboard")
        }
      } else {  

        alert(data.message)

      }

    } catch (error) {

      console.error(error)
      alert("Something went wrong")

    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black">

      <div className="w-[420px] bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-10 shadow-2xl">

        <h1 className="text-3xl font-bold text-center mb-2">
          CodePlay
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Login to continue coding
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:outline-none focus:border-blue-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-black/40 border border-gray-700 focus:outline-none focus:border-blue-500 transition"
          />

          <button
            className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition font-semibold"
          >
            Login
          </button>

        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-400 hover:text-blue-300"
          >
            Signup
          </Link>
        </p>

      </div>

    </div>

  )
}

export default Login