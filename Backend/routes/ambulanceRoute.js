import express from "express";
import { callAmbulance } from "../controllers/ambulanceController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, callAmbulance);

export default router;
