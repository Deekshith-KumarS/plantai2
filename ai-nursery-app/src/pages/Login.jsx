import { API_URL } from "../config";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";


export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center px-6 py-10">

      {/* MAIN CARD */}
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden grid lg:grid-cols-2 max-w-6xl w-full">

        {/* LEFT SIDE */}
        <div className="bg-gradient-to-br from-green-700 to-green-500 text-white p-14 flex flex-col justify-center relative overflow-hidden">

          {/* DECORATION */}
          <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -left-20"></div>
          <div className="absolute w-96 h-96 bg-white/5 rounded-full -bottom-32 -right-32"></div>

          <div className="relative z-10">
            <h1 className="text-6xl font-extrabold leading-tight">
              PlantAI 🌿
            </h1>
            <p className="mt-8 text-2xl text-green-100 leading-relaxed">
              Smart Nursery Management Platform powered by AI-driven plant insights.
            </p>

            {/* FEATURES */}
            <div className="mt-12 grid gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
                <h3 className="text-2xl font-bold">🌱 Smart Plant Care</h3>
                <p className="text-green-100 mt-2">AI recommendations for healthier plants.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
                <h3 className="text-2xl font-bold">🛒 Premium Shopping</h3>
                <p className="text-green-100 mt-2">Explore indoor and outdoor plants.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
                <h3 className="text-2xl font-bold">🤖 AI Disease Detection</h3>
                <p className="text-green-100 mt-2">Detect plant diseases instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-10 lg:p-16 flex flex-col justify-center">

          <div>
            <h2 className="text-5xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 text-lg mt-5">
              Login to continue managing your smart nursery.
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-base">
              ⚠️ {error}
            </div>
          )}

          {/* GOOGLE SIGN-IN */}
          <div className="mt-8">
            <GoogleSignInButton label="Sign in with Google" />
          </div>

          {/* OR DIVIDER */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-400 text-sm font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="mt-6">

            {/* EMAIL */}
            <div>
              <label className="text-lg font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-600 text-lg shadow-sm"
              />
            </div>

            {/* PASSWORD */}
            <div className="mt-5">
              <div className="flex justify-between items-center">
                <label className="text-lg font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-sm font-bold text-green-700 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-600 text-lg shadow-sm"
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-700 to-green-500 text-white py-5 rounded-2xl mt-8 hover:scale-[1.02] transition duration-300 text-2xl font-bold shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* REGISTER LINK */}
          <p className="text-center text-gray-500 mt-6 text-lg">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-700 font-bold hover:underline">
              Register here →
            </Link>
          </p>

          {/* FOOTER */}
          <p className="text-center text-gray-400 mt-3 text-sm">
            Powered by PlantAI Smart Systems 🌿
          </p>

        </div>
      </div>
    </div>
  );
}