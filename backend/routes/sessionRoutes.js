// routes/sessionRoutes.js
import express from "express";
import { startSession, endSession, getAllSessions } from "../controllers/sessionController.js";

const router = express.Router();

router.post("/start", startSession);
router.put("/:id/end", endSession);
router.get("/", getAllSessions);

export default router;
