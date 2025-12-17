import express from "express";
import { searchNearby } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", searchNearby);

export default router;
