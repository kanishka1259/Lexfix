import express from "express";
import { logInteraction } from "../controllers/interactionController.js";
import { protect } from "../../controllers/authController.js";

const router = express.Router();

router.post("/", protect, logInteraction);

export default router;
