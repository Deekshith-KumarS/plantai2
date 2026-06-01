import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import monitoredPlantRoutes from "./routes/monitoredPlantRoutes.js";
import rescueRoutes from "./routes/rescueRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import ChatMessage from "./models/ChatMessage.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

/* ── CONNECT DATABASE ── */
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"]
  }
});

/* ── MIDDLEWARE ── */
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* ── GROQ AI CLIENT (via OpenAI SDK) ── */
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/* ── AUTH ROUTES ── */
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);

/* ── USER ROUTES ── */
app.use("/api/users", userRoutes);

/* ── ORDER ROUTES ── */
app.use("/api/orders", orderRoutes);

/* ── MONITORED PLANTS ROUTES ── */
app.use("/api/monitored-plants", monitoredPlantRoutes);

/* ── RESCUE MAP ROUTES ── */
app.use("/api/rescue", rescueRoutes);
app.use("/api/requests", requestRoutes);

/* ── OTHER ROUTES ── */
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

/* ── AI CHAT ROUTE ── */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are PlantAI, an expert nursery assistant. Help users with plant care, diseases, watering schedules, fertilization, pest control, gardening tips, and shopping recommendations. Keep responses friendly, concise, and practical.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 300,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("AI Chat Error:", error.message);
    
    let errorMessage = "AI service failed. Please try again.";
    if (error.message.includes("429") || error.message.includes("quota")) {
      errorMessage = "⚠️ Your Groq API Key has hit its rate limit (Quota Exceeded).";
    }

    res.status(500).json({ error: errorMessage });
  }
});

/* ── HEALTH CHECK ── */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "PlantAI backend is running" });
});

/* ── SOCKET.IO LOGIC ── */
io.on("connection", (socket) => {
  console.log("User connected to socket:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", async (data) => {
    // Save to DB
    try {
      await ChatMessage.create({
        room: data.room,
        senderId: data.senderId,
        senderName: data.senderName,
        avatar: data.avatar,
        text: data.text
      });
    } catch (err) {
      console.error("Failed to save chat message", err);
    }
    
    // Broadcast to room
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* ── SERVER START ── */
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;