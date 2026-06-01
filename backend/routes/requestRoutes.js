import express from "express";
import RescueRequest from "../models/RescueRequest.js";
import ChatMessage from "../models/ChatMessage.js";
import RescueListing from "../models/RescueListing.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/requests/:listingId
// @desc    Apply/Request to rescue a plant
// @access  Private
router.post("/:listingId", protect, async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const { message } = req.body;

    const listing = await RescueListing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Prevent owner from requesting their own plant
    if (listing.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot request your own plant" });
    }

    // Check if already requested
    const existingRequest = await RescueRequest.findOne({
      listing: listingId,
      requester: req.user._id,
    });
    if (existingRequest) {
      return res.status(400).json({ message: "You have already requested this plant" });
    }

    const newRequest = new RescueRequest({
      listing: listingId,
      requester: req.user._id,
      owner: listing.owner,
      message,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error("Create Request Error:", error);
    res.status(500).json({ message: "Failed to create request" });
  }
});

// @route   GET /api/requests/me
// @desc    Get user's requests (both outgoing and incoming)
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const incomingRequests = await RescueRequest.find({ owner: req.user._id })
      .populate("listing", "title plantName photos status")
      .populate("requester", "name avatar")
      .sort({ createdAt: -1 });

    const outgoingRequests = await RescueRequest.find({ requester: req.user._id })
      .populate("listing", "title plantName photos status")
      .populate("owner", "name avatar")
      .sort({ createdAt: -1 });

    res.json({ incoming: incomingRequests, outgoing: outgoingRequests });
  } catch (error) {
    console.error("Fetch User Requests Error:", error);
    res.status(500).json({ message: "Failed to fetch user requests" });
  }
});

// @route   PATCH /api/requests/:id/status
// @desc    Accept or Reject a request
// @access  Private
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body; // Accepted, Rejected
    const request = await RescueRequest.findById(req.params.id).populate("listing");

    if (!request) return res.status(404).json({ message: "Request not found" });

    // Ensure only the owner can update status
    if (request.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    request.status = status;
    await request.save();

    // If accepted, update the listing status to "Pending"
    if (status === "Accepted") {
      const listing = await RescueListing.findById(request.listing._id);
      if (listing) {
        listing.status = "Pending";
        await listing.save();
      }
    }

    res.json(request);
  } catch (error) {
    console.error("Update Request Status Error:", error);
    res.status(500).json({ message: "Failed to update request status" });
  }
});

// @route   GET /api/requests/:roomId/messages
// @desc    Get chat history for a room
// @access  Private
router.get("/:roomId/messages", protect, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ room: req.params.roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch chat history" });
  }
});

export default router;
