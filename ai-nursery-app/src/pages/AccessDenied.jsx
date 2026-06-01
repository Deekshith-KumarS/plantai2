import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-16 max-w-xl text-center border border-gray-100">
        <div className="w-24 h-24 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-red-100">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-500 mb-8 leading-relaxed">
          You do not have Administrator privileges to view this page. This area is strictly restricted to authorized nursery staff only.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-green-700 text-white px-8 py-4 rounded-xl hover:bg-green-800 transition font-bold text-lg shadow-lg shadow-green-200"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
