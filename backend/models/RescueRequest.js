import mongoose from "mongoose";

const rescueRequestSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RescueListing",
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "Pending", // Pending, Accepted, Rejected, Completed
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const RescueRequest = mongoose.model("RescueRequest", rescueRequestSchema);
export default RescueRequest;
