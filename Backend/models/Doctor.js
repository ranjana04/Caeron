import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  speciality: String,
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  role: { type: String, default: "doctor" },
});

doctorSchema.index({ location: "2dsphere" });

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;