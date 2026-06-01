import { API_URL } from "../config";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

export default function GoogleSignInButton({ label = "Sign in with Google" }) {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        alert(data.message || "Google sign-in failed. Please try again.");
      }
    } catch (err) {
      alert("Server error. Please make sure the backend is running.");
    }
  };

  const handleError = () => {
    alert("Google sign-in was cancelled or failed. Please try again.");
  };

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        text={label === "Sign up with Google" ? "signup_with" : "signin_with"}
        shape="rectangular"
        theme="outline"
        size="large"
        width="400"
        logo_alignment="left"
      />
    </div>
  );
}
