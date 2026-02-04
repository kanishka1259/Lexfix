import express from "express";
import {
    startSession,
    trackSentence,
    recordBreak,
    completeSession,
    getProgress,
    getActiveSession
} from "../controllers/adhdController.js";
import { protect } from "./authMiddleware.js";

const router = express.Router();

// All routes are protected
router.post("/session/start", protect, startSession);
router.post("/session/sentence", protect, trackSentence);
router.post("/session/break", protect, recordBreak);
router.post("/session/complete", protect, completeSession);
router.get("/session/active", protect, getActiveSession);
router.get("/progress/:userId", protect, getProgress);

export default router;
