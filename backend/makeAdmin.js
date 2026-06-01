import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

const makeAdmin = async () => {
  try {
    await connectDB();
    
    const email = process.argv[2];

    if (!email) {
      console.error("❌ Please provide the email address of the user.");
      console.log("Usage: node makeAdmin.js <email>");
      process.exit(1);
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`✅ Success! User ${email} is now an Admin.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

makeAdmin();
