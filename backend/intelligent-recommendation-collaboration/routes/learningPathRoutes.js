import express from "express";
import { getPath, getReviews, generatePath } from "../controllers/learningPathController.js";

const router = express.Router();

router.get("/", getPath);
router.get("/reviews", getReviews);
router.post("/generate", generatePath);

export default router;
