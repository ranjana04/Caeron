import { geocodeAddress } from "../utils/geoCode.js";
import Doctor from "../models/Doctor.js";
import Hospital from "../models/Hospital.js";

export const searchNearby = async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ 
        message: "Address query param required",
      success:false
      });
    }

    const [lng, lat] = await geocodeAddress(address);

    const maxDistance = 5000; // meters, i.e., 5 km radius

    const doctors = await Doctor.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: maxDistance,
        },
      },
    });

    const hospitals = await Hospital.find({
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: maxDistance,
        },
      },
    });

    res.json({ doctors, hospitals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
