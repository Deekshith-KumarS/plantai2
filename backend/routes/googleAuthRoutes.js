import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ── GOOGLE SIGN-IN ── */
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required" });
    }

    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists — update their Google info if they signed in with Google before
      if (!user.googleId) {
        user.googleId = googleId;
        user.avatar = picture;
        user.authProvider = "google";
      }
      // Always mark as verified if they log in through Google
      user.isVerified = true;
      await user.save();
    } else {
      // New user — create account
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        authProvider: "google",
        isVerified: true, // Google accounts are inherently verified
        // No password for Google users
      });
    }

    // Issue our own JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Google sign-in successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || null,
        isAdmin: user.isAdmin,
      },
    });

  } catch (error) {
    console.error("Google Auth Error:", error.message);

    if (error.message?.includes("Token used too late")) {
      return res.status(401).json({ success: false, message: "Google token expired. Please try again." });
    }

    res.status(401).json({ success: false, message: "Google sign-in failed. Invalid token." });
  }
});

export default router;
