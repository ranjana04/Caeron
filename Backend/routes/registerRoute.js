
import express from "express";
import {
  registerDoctor,
  registerHospital,
  getAllDoctors,
  getAllHospitals
} from "../controllers/registerController.js";

const router = express.Router();

router.post("/doctor", registerDoctor);
router.post("/hospital", registerHospital);

// New GET routes
router.get("/doctors", getAllDoctors);
router.get("/hospitals", getAllHospitals);

export default router;
