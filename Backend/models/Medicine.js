import mongoose from "mongoose";

const medicineOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  medicineName: { type: String, required: true },
  quantity: { type: Number, required: true },
  address: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model("MedicineOrder", medicineOrderSchema);
