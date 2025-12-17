import express from "express";
import { orderMedicine } from "../controllers/medicineController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, orderMedicine);

export default router;
