import { geocodeAddress } from "../utils/geoCode.js";
import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";

export const registerDoctor = async (req, res) => {
  try {
    const { name, speciality, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ 
        message: "Name and address are required",
        success:false
      });
    }

    const [lng, lat] = await geocodeAddress(address);

    const doctor = new Doctor({
      name,
      speciality,
      location: {
        type: "Point",
        coordinates: [lng, lat],  // important order: lng, lat
      },
      address,
    });

    await doctor.save();

    return res.status(201).json({
  success: true,
  message: "Doctor registered successfully"
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const registerHospital = async (req, res) => {
  try {
    console.log("Request body received:", req.body); // 
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({
         message: "Name and address are required",
        success:false
        });
    }

    const [lng, lat] = await geocodeAddress(address);

    const hospital = new Hospital({
      name,
      location: {
        type: "Point",
        coordinates: [lng, lat],  // important order: lng, lat
      },
      address,
    });

    await hospital.save();

    return res.status(201).json({
  success: true,
  message: "Hospital registered successfully"
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching doctors" });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({});
    res.status(200).json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching hospitals" });
  }
};
