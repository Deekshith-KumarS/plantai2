import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String },
    avatar: { type: String },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);
export default ChatMessage;
