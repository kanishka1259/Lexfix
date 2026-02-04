import express from "express";
import {
    startSession,
    trackSentence,
    recordBreak,
    completeSession,
    getProgress,
    getActiveSession
} from "../controllers/adhdController.js";
import { protect } from "../controllers/authController.js";

const router = express.Router();

router.post("/session/start", protect, startSession);
router.post("/session/sentence", protect, trackSentence);
router.post("/session/break", protect, recordBreak);
router.post("/session/complete", protect, completeSession);
router.get("/session/active", protect, getActiveSession);
router.get("/progress/:userId", protect, getProgress);

export default router;
