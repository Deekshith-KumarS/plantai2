import { useState } from "react";
import BackButton from "./BackButton";

export default function ChatBot() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  const handleAsk = () => {
    if (!message) return;

    setReply(
      "🌿 PlantAI Assistant: Water your plant regularly and keep it in indirect sunlight."
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 p-6">
      <BackButton />

      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
          Plant AI Assistant
        </h1>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something about plants..."
          className="w-full border-2 border-green-200 p-4 rounded-2xl outline-none mb-4 focus:border-green-500"
          rows="6"
        />

        <button
          onClick={handleAsk}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl transition duration-300 w-full"
        >
          Ask AI
        </button>

        {reply && (
          <div className="mt-6 bg-green-100 p-5 rounded-2xl text-gray-800 text-lg">
            {reply}
          </div>
        )}
      </div>
    </div>
  );
}