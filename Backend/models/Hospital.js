import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  role: { type: String, default: "hospital" },
});

hospitalSchema.index({ location: "2dsphere" });

const Hospital = mongoose.model("Hospital", hospitalSchema);
export default Hospital;