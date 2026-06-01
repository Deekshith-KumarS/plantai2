import express from "express";
import User from "../models/User.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ── GET ALL USERS (ADMIN ONLY) ── */
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
