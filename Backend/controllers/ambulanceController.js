import AmbulanceRequest from "../models/Ambulance.js";

export const callAmbulance = async (req, res) => {
  try {
    const { location, contactNumber, emergencyDetails } = req.body;
    const userId = req.user.id;

    if (!location || !contactNumber) {
      return res.status(400).json({ 
        message: "Location and contact number are required",
       success:false
      });
    }

    const request = new AmbulanceRequest({
      userId,
      location,
      contactNumber,
      emergencyDetails
    });

    await request.save();

    res.status(201).json({ 
      message: "Ambulance requested successfully", request,
      success:true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
