import mongoose from "mongoose";

const rescueListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    plantName: { type: String, required: true },
    category: { type: String, required: true },
    photos: [{ type: String, required: true }],
    age: { type: String },
    potSize: { type: String },
    healthCondition: { type: String, required: true },
    careDifficulty: { type: String },
    reason: { type: String, required: true },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    addressString: { type: String, required: true },
    type: { type: String, enum: ['Free', 'Paid', 'Exchange'], default: 'Free' },
    price: { type: Number, default: 0 },
    exchangePreferences: { type: String, default: '' },
    status: { type: String, enum: ['Available', 'Pending', 'Rescued'], default: 'Available' },
    reported: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Create geospatial index for distance queries
rescueListingSchema.index({ location: "2dsphere" });

const RescueListing = mongoose.model("RescueListing", rescueListingSchema);
export default RescueListing;
