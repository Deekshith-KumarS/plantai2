import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Force IPv4 to fix Vercel Serverless timeout issues
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    // process.exit(1) causes Vercel serverless functions to crash completely.
  }
};

export default connectDB;