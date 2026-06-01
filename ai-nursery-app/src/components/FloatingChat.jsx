import { API_URL } from "../config";
import { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2, X } from "lucide-react";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 🌿 I am PlantAI Assistant. Ask me anything about plants — care tips, diseases, watering, fertilizer, and more!",
    },
  ]);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleAsk = async () => {
    if (!message.trim() || loading) return;

    const userMessage = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message;
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server error");
      }

      const botMessage = {
        sender: "bot",
        text: data.reply || "Sorry, I couldn't get a response. Please try again.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        sender: "bot",
        text: err.message === "Failed to fetch" ? "⚠️ Connection error. Please make sure the backend server is running." : err.message,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-green-800 text-white w-16 h-16 rounded-full shadow-2xl text-3xl z-50 hover:scale-110 transition duration-300"
        title="Open PlantAI Chat"
      >
        🤖
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div 
          className={`fixed bg-white shadow-2xl overflow-hidden z-50 flex flex-col transition-all duration-300 ${
            isMaximized 
              ? "inset-4 rounded-3xl" 
              : "bottom-28 right-6 w-[380px] h-[550px] rounded-3xl border border-green-100"
          }`}
        >

          {/* HEADER */}
          <div className="bg-gradient-to-r from-green-700 to-green-500 text-white p-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">PlantAI Assistant</h2>
              <p className="text-sm text-green-100 mt-1">Powered by Groq ⚡ & Llama 3</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-white/80 hover:text-white transition"
                title={isMaximized ? "Minimize" : "Maximize"}
              >
                {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white transition"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto p-4 bg-green-50">
            <div className="flex flex-col gap-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm shadow leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-green-700 text-white self-end ml-auto"
                      : "bg-white text-gray-700 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="bg-white px-4 py-3 rounded-2xl w-fit shadow text-gray-500 flex items-center gap-2">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          </div>

          {/* INPUT */}
          <div className="p-4 border-t bg-white flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about plants..."
              disabled={loading}
              className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-green-500 text-sm disabled:opacity-50"
            />
            <button
              onClick={handleAsk}
              disabled={loading || !message.trim()}
              className="bg-green-700 text-white px-5 rounded-2xl hover:bg-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}