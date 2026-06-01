import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { API_URL } from "../config";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import { Send, ArrowLeft, Leaf, Loader2 } from "lucide-react";

export default function RescueChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  
  // Basic states
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState("");
  const messagesEndRef = useRef(null);

  // In a real production app, we would fetch active conversations from the DB.
  // For this demo hackathon version, we simulate the room based on state or default to a global "rescue-hub"
  const [activeRoom, setActiveRoom] = useState("global-rescue-hub");

  useEffect(() => {
    // 1. Fetch Chat History
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/requests/${activeRoom}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          scrollToBottom();
        }
      } catch (err) {
        console.error("Failed to fetch chat history");
      }
    };
    fetchHistory();

    // 2. Connect to Socket.io server
    const socketUrl = API_URL ? API_URL.replace("/api", "") : "http://localhost:5000";
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("join_room", activeRoom);
    });

    newSocket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    });

    return () => newSocket.disconnect();
  }, [activeRoom]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const messageData = {
      room: activeRoom,
      senderId: currentUser._id,
      senderName: currentUser.name,
      avatar: currentUser.avatar || null,
      text: inputMsg,
      createdAt: new Date().toISOString()
    };

    // Emit to socket
    socket.emit("send_message", messageData);
    
    // Add to local state immediately for snappy UI
    setMessages((prev) => [...prev, messageData]);
    setInputMsg("");
    scrollToBottom();
  };

  return (
    <PageWrapper>
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <Navbar />
        
        <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col min-h-0">
          
          <button onClick={() => navigate("/rescue/dashboard")} className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold mb-4 transition w-max">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>

          <div className="flex-1 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col min-h-0">
            
            {/* Chat Header */}
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold">Rescue Hub Chat</h2>
                  <p className="text-gray-400 text-xs">Live messaging with adopters/owners</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Connected</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
                  <p>No messages yet.</p>
                  <p className="text-sm">Say hello to coordinate the plant rescue!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, i) => {
                    const isMe = msg.senderId === currentUser._id;
                    return (
                      <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-end gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isMe ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {msg.avatar ? <img src={msg.avatar} className="w-full h-full rounded-full" /> : msg.senderName.charAt(0)}
                          </div>
                          
                          <div className={`px-4 py-3 rounded-2xl ${isMe ? 'bg-green-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${isMe ? 'text-green-200 text-right' : 'text-gray-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <form onSubmit={sendMessage} className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                />
                <button 
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center hover:bg-green-700 transition disabled:opacity-50 disabled:hover:bg-green-600 shadow-md shadow-green-200"
                >
                  <Send className="w-5 h-5 ml-1" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// Temporary icon definition for empty state
const MessageCircle = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
)
