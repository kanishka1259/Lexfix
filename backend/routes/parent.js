import express from "express";
import Task from "../models/Task.js";
import Submission from "../models/Submission.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/child-performance", protect, async (req, res) => {
  const { childEmail } = req.body;

  const tasks = await Task.find({ studentEmail: childEmail });
  const submissions = await Submission.find({ studentEmail: childEmail });

  res.json({ tasks, submissions });
});

export default router;
