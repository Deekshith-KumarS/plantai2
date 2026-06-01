import express from "express";
import MonitoredPlant from "../models/MonitoredPlant.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ── GET all monitored plants for logged-in user ── */
router.get("/", protect, async (req, res) => {
  try {
    const plants = await MonitoredPlant.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(plants);
  } catch (err) {
    console.error("Fetch monitored plants error:", err);
    res.status(500).json({ message: "Failed to fetch plants" });
  }
});

/* ── POST create a new monitored plant ── */
router.post("/", protect, async (req, res) => {
  try {
    const plant = new MonitoredPlant({ user: req.user._id, ...req.body });
    const saved = await plant.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create monitored plant error:", err);
    res.status(500).json({ message: "Failed to save plant" });
  }
});

/* ── PUT update a monitored plant (water / fertilize / re-analyse) ── */
router.put("/:id", protect, async (req, res) => {
  try {
    const plant = await MonitoredPlant.findOne({ _id: req.params.id, user: req.user._id });
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    Object.assign(plant, req.body);
    const updated = await plant.save();
    res.json(updated);
  } catch (err) {
    console.error("Update monitored plant error:", err);
    res.status(500).json({ message: "Failed to update plant" });
  }
});

/* ── DELETE a monitored plant ── */
router.delete("/:id", protect, async (req, res) => {
  try {
    const plant = await MonitoredPlant.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    res.json({ message: "Plant removed" });
  } catch (err) {
    console.error("Delete monitored plant error:", err);
    res.status(500).json({ message: "Failed to delete plant" });
  }
});

export default router;
