import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import User from "../models/User.js";
import OTP from "../models/OTP.js";

const router = express.Router();

/* NODEMAILER TRANSPORTER */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /* CHECK USER */
    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    /* HASH PASSWORD */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* CREATE OR UPDATE USER (Unverified) */
    if (user) {
      user.password = hashedPassword;
      user.name = name;
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
      });
    }

    /* GENERATE OTP */
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    /* SAVE OTP */
    await OTP.create({ email, otp: otpCode });

    /* SEND OTP EMAIL */
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your PlantAI Verification Code",
        html: `<h2>Welcome to PlantAI 🌿</h2>
               <p>Your 6-digit verification code is:</p>
               <h1 style="color: green; font-size: 32px;">${otpCode}</h1>
               <p>This code will expire in 5 minutes.</p>`,
      });
      console.log("OTP sent to:", email);
    } else {
      console.log("\n=============================");
      console.log("MOCK OTP (Email not configured)");
      console.log(`To: ${email} | OTP: ${otpCode}`);
      console.log("=============================\n");
    }

    res.json({
      success: true,
      message: "OTP sent to email. Please verify.",
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
});

/* VERIFY OTP */
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    /* MARK USER AS VERIFIED */
    const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });

    /* DELETE OTP */
    await OTP.deleteOne({ _id: otpRecord._id });

    /* GENERATE TOKEN */
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });

  } catch (error) {
    console.error("Verify OTP error:", error.message);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    /* FIND USER */
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    /* CHECK PASSWORD */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    /* CHECK VERIFICATION */
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email to log in. You can register again to get a new code.",
      });
    }

    /* TOKEN */
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});

/* FORGOT PASSWORD */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    /* GENERATE OTP */
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    /* SAVE OTP */
    await OTP.create({ email, otp: otpCode });

    /* SEND OTP EMAIL */
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "PlantAI Password Reset",
        html: `<h2>Password Reset Request 🌿</h2>
               <p>Your 6-digit password reset code is:</p>
               <h1 style="color: green; font-size: 32px;">${otpCode}</h1>
               <p>This code will expire in 5 minutes.</p>
               <p>If you did not request a password reset, please ignore this email.</p>`,
      });
      console.log("Password reset OTP sent to:", email);
    } else {
      console.log("\n=============================");
      console.log("MOCK OTP (Password Reset)");
      console.log(`To: ${email} | OTP: ${otpCode}`);
      console.log("=============================\n");
    }

    res.json({ success: true, message: "Password reset code sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({ success: false, message: "Failed to send reset code" });
  }
});

/* RESET PASSWORD */
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
    await OTP.deleteOne({ _id: otpRecord._id });

    res.json({ success: true, message: "Password has been successfully reset" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ success: false, message: "Failed to reset password" });
  }
});

export default router;