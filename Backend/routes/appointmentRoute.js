import express from "express";
import { bookAppointment } from "../controllers/appointmentController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, bookAppointment);  // Protected route

export default router;
