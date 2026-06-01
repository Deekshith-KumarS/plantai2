import { API_URL } from "../config";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg(data.message);
        setStep(2);
      } else {
        setError(data.message || "Failed to send code");
      }
    } catch (err) {
      setError("Server error. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otp || !newPassword) {
      setError("Please enter the OTP and a new password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
      }
    } catch (err) {
      setError("Server error. Please make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center px-6 py-10">
      <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden max-w-xl w-full p-10 lg:p-14">
        
        <div>
          <h2 className="text-4xl font-bold text-gray-800 text-center">Reset Password</h2>
          <p className="text-gray-500 text-lg mt-3 text-center">
            {step === 1 ? "Enter your email to receive a secure reset code." : "Enter your 6-digit code and choose a new password."}
          </p>
        </div>

        {/* ERROR / SUCCESS */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl text-base">
            ⚠️ {error}
          </div>
        )}
        {successMsg && (
          <div className="mt-6 bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-2xl text-base">
            ✅ {successMsg}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendCode} className="mt-8">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-700 to-green-500 text-white py-5 rounded-2xl mt-8 hover:scale-[1.02] transition duration-300 text-xl font-bold shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-8">
            <div>
              <label className="text-lg font-semibold text-gray-700">Verification Code</label>
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full mt-2 text-center tracking-[1em] font-mono text-3xl px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-600 shadow-sm"
              />
            </div>

            <div className="mt-6">
              <label className="text-lg font-semibold text-gray-700">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full mt-2 px-6 py-4 rounded-2xl border border-gray-200 outline-none focus:border-green-600 text-lg shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6 || !newPassword}
              className="w-full bg-gradient-to-r from-green-700 to-green-500 text-white py-5 rounded-2xl mt-8 hover:scale-[1.02] transition duration-300 text-xl font-bold shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="text-gray-500 hover:text-green-700 font-semibold transition text-lg">
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}
