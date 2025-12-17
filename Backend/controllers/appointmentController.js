import Appointment from "../models/Appointment.js";

export const bookAppointment = async (req, res) => {
  try {
    const { fullName, doctorOrHospitalId, role, dateTime } = req.body;
    const userId = req.user.id;

    if (!fullName || !doctorOrHospitalId || !dateTime || !role) {
      return res.status(400).json({ 
        message: "All fields are required",
        success: false
      });
    }

    const appointment = new Appointment({
      fullName,
      doctorOrHospitalId,
      role,
      dateTime: new Date(dateTime),
      userId,
    });

    await appointment.save();
    res.status(201).json({ 
      message: "Appointment booked", 
      appointment,
      success: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

