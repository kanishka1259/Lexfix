import express from "express";
import Task from "../models/Task.js";
import Submission from "../models/Submission.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-tasks", protect, async (req, res) => {
  const tasks = await Task.find({ studentEmail: req.user });
  res.json(tasks);
});

router.post("/submit-task", protect, async (req, res) => {
  const { taskTitle, content } = req.body;

  await Submission.create({
    studentEmail: req.user,
    taskTitle,
    content,
    score: 80
  });

  res.json({ message: "Task submitted" });
});

export default router;
