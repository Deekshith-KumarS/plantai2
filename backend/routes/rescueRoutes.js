import express from "express";
import RescueListing from "../models/RescueListing.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   GET /api/rescue
// @desc    Get all rescue listings (with optional geo-query)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { lat, lng, radiusInKm = 50, category, type } = req.query;

    let query = { status: "Available" };

    if (category && category !== "All") query.category = category;
    if (type && type !== "All") query.type = type;

    // Geo-spatial search
    if (lat && lng) {
      const radiusInRadians = radiusInKm / 6378.1; // Earth radius in km
      query.location = {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], radiusInRadians],
        },
      };
    }

    const listings = await RescueListing.find(query)
      .populate("owner", "name avatar")
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    console.error("Fetch Rescue Listings Error:", error);
    res.status(500).json({ message: "Failed to fetch listings" });
  }
});

// @route   GET /api/rescue/leaderboard
// @desc    Get top users by rescue listings
// @access  Public
router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await RescueListing.aggregate([
      { $group: { _id: "$owner", totalRescues: { $sum: 1 } } },
      { $sort: { totalRescues: -1 } },
      { $limit: 10 },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: "$user" },
      { $project: { _id: 1, totalRescues: 1, name: "$user.name", avatar: "$user.avatar", createdAt: "$user.createdAt" } }
    ]);
    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

// @route   GET /api/rescue/user/me
// @desc    Get logged in user's listings
// @access  Private
router.get("/user/me", protect, async (req, res) => {
  try {
    const listings = await RescueListing.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(listings);
  } catch (error) {
    console.error("Fetch User Listings Error:", error);
    res.status(500).json({ message: "Failed to fetch user listings" });
  }
});

// @route   GET /api/rescue/:id
// @desc    Get single rescue listing
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const listing = await RescueListing.findById(req.params.id).populate(
      "owner",
      "name email avatar"
    );
    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: "Listing not found" });
    }
  } catch (error) {
    console.error("Fetch Single Listing Error:", error);
    res.status(500).json({ message: "Failed to fetch listing" });
  }
});

// @route   POST /api/rescue
// @desc    Create a new rescue listing
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      plantName,
      category,
      photos,
      age,
      potSize,
      healthCondition,
      careDifficulty,
      reason,
      location, // { type: 'Point', coordinates: [lng, lat] }
      addressString,
      type,
      price,
      exchangePreferences,
    } = req.body;

    const listing = new RescueListing({
      title,
      plantName,
      category,
      photos,
      age,
      potSize,
      healthCondition,
      careDifficulty,
      reason,
      location,
      addressString,
      type,
      price,
      exchangePreferences,
      owner: req.user._id,
    });

    const createdListing = await listing.save();
    res.status(201).json(createdListing);
  } catch (error) {
    console.error("Create Listing Error:", error);
    res.status(500).json({ message: "Failed to create listing" });
  }
});



// @route   PATCH /api/rescue/:id/status
// @desc    Update listing status
// @access  Private
router.patch("/:id/status", protect, async (req, res) => {
  try {
    const { status } = req.body; // Pending, Rescued, Available
    const listing = await RescueListing.findById(req.params.id);

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    // Check ownership
    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    listing.status = status;
    await listing.save();

    res.json(listing);
  } catch (error) {
    console.error("Update Listing Status Error:", error);
    res.status(500).json({ message: "Failed to update listing status" });
  }
});

// @route   DELETE /api/rescue/:id
// @desc    Delete user's own listing or Admin delete
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const listing = await RescueListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Not found" });

    if (listing.owner.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await RescueListing.findByIdAndDelete(req.params.id);
    
    // Cascading delete: remove all requests associated with this listing
    const RescueRequest = mongoose.model('RescueRequest');
    if (RescueRequest) {
      await RescueRequest.deleteMany({ listing: req.params.id });
    }

    res.json({ message: "Listing removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/rescue/:id/report
// @desc    Report a fake/spam listing
// @access  Private
router.post("/:id/report", protect, async (req, res) => {
  try {
    const listing = await RescueListing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Not found" });

    listing.reported = true;
    await listing.save();
    res.json({ message: "Reported successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/rescue/admin/all
// @desc    Admin view all listings (including reported)
// @access  Private/Admin
router.get("/admin/all", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(401).json({ message: "Not authorized" });
    const listings = await RescueListing.find().populate("owner", "name email").sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/rescue/admin/analytics
// @desc    Admin analytics for rescues
// @access  Private/Admin
router.get("/admin/analytics", protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(401).json({ message: "Not authorized" });
    
    const totalListings = await RescueListing.countDocuments();
    const totalRescued = await RescueListing.countDocuments({ status: "Rescued" });
    const totalReported = await RescueListing.countDocuments({ reported: true });
    
    // Quick breakdown
    const typeBreakdown = await RescueListing.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } }
    ]);

    res.json({ totalListings, totalRescued, totalReported, typeBreakdown });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
