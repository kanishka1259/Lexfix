import express from "express";
import Task from "../models/Task.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/assign-task", protect, async (req, res) => {
  const { title, description, studentEmail } = req.body;

  await Task.create({
    title,
    description,
    studentEmail,
    assignedBy: req.user
  });

  res.json({ message: "Task assigned" });
});

export default router;
