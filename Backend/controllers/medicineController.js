import MedicineOrder from "../models/Medicine.js";

export const orderMedicine = async (req, res) => {
  try {
    const { medicineName, quantity, address } = req.body;
    const userId = req.user.id;


    if (!medicineName || !quantity || !address) {
      return res.status(400).json({ 
        message: "All fields are required",
       success:false
      });
    }

    const order = new MedicineOrder({ userId, medicineName, quantity, address });
    await order.save();

    res.status(201).json({ 
      message: "Medicine ordered successfully",
       order ,
       success:true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
