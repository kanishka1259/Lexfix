import express from "express";
import { recordPerformance, getPerformanceSummary } from "../controllers/performanceController.js";
import { protect } from "../../controllers/authController.js"; // Reusing existing middleware

const router = express.Router();

router.post("/record", protect, recordPerformance);
router.get("/summary", protect, getPerformanceSummary);

export default router;
