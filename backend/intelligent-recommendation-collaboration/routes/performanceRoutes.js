import express from "express";
import { recordPerformance, getPerformanceSummary } from "../controllers/performanceController.js";

const router = express.Router();

router.post("/record", recordPerformance);
router.get("/summary", getPerformanceSummary);

export default router;
