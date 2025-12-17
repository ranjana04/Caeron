import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  doctorOrHospitalId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "role" },
  // role: { type: String, required: true, enum: ["doctor", "hospital"] },
  dateTime: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // new field
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
