import mongoose from "mongoose";

const ambulanceRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  location: { type: String, required: true },
  contactNumber: { type: String, required: true },
  emergencyDetails: { type: String },
  requestedAt: { type: Date, default: Date.now }
});

export default mongoose.model("AmbulanceRequest", ambulanceRequestSchema);
