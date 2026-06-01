import mongoose from "mongoose";

const monitoredPlantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name:            { type: String, required: true },
    image:           { type: String, default: "" },
    height:          { type: String, default: "" },
    sunlight:        { type: String, default: "Medium" },
    temperature:     { type: Number, default: 22 },
    moisture:        { type: Number, default: 50 },
    fertilizerLevel: { type: Number, default: 50 },
    growthProgress:  { type: Number, default: 50 },
    healthScore:     { type: Number, default: 50 },
    waterFreqHrs:    { type: Number, default: 120 },
    fertilizeFreqHrs:{ type: Number, default: 336 },
    lastWateredAt:   { type: Number, default: null },   // ms timestamp
    lastFertilizedAt:{ type: Number, default: null },   // ms timestamp
    tips:            [{ type: String }],
  },
  { timestamps: true }
);

const MonitoredPlant = mongoose.model("MonitoredPlant", monitoredPlantSchema);
export default MonitoredPlant;
