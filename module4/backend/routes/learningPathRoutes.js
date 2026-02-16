import express from "express";
import { getPath, getReviews, generatePath } from "../controllers/learningPathController.js";
import { protect } from "../../controllers/authController.js";

const router = express.Router();

router.get("/", protect, getPath);
router.get("/reviews", protect, getReviews);
router.post("/generate", protect, generatePath);

export default router;
