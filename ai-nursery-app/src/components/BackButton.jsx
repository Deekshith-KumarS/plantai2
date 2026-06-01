import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 bg-white shadow-md hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-xl transition"
    >
      ← Back
    </button>
  );
}