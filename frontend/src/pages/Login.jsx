import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sword } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);

        localStorage.setItem("role", data.user.role);

        localStorage.setItem("userId", data.user.id);

        // NEW
        localStorage.setItem("name", data.user.name);

        data.user.role === "admin"
          ? navigate("/admin")
          : navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 flex flex-col items-center justify-center px-6">
      {/* Absolute minimal background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 w-full max-w-[480px]">
        {/* Centered Minimal Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 mb-6">
            <Sword className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Welcome to CodePlay
          </h1>
          <p className="text-slate-400 font-medium">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Card - Wider, Simpler, Elegant */}
        <div className="bg-slate-900/30 border border-white/5 rounded-[2rem] p-10 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
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
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Password
                </label>
                <Link
                  to="/forgot"
                  className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-slate-200 transition-all active:scale-[0.98] shadow-lg mt-2"
            >
              Sign In
            </button>
          </form>

          {/* Centered Footer */}
          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <p className="text-slate-500 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-400 font-bold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
