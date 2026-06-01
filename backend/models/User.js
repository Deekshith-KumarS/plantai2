import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: false, // Optional — Google users have no password
    },

    googleId: {
      type: String,
      required: false, // Only set for Google OAuth users
    },

    avatar: {
      type: String,
      required: false, // Profile picture from Google
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;