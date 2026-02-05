const express = require("express");
const router = express.Router();
const QA = require("../models/AccessibilityLog");

// POST QA Log
router.post("/", async (req, res) => {
  try {
    const qa = new QA(req.body);
    await qa.save();
    res.json(qa);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET QA Logs
router.get("/", async (req, res) => {
  try {
    const qaLogs = await QA.find();
    res.json(qaLogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
