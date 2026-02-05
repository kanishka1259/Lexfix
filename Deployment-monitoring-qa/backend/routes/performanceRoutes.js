const express = require("express");
const router = express.Router();
const Performance = require("../models/AccessibilityLog");

// POST Performance Test
router.post("/", async (req, res) => {
  try {
    const performance = new Performance(req.body);
    await performance.save();
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Performance Tests
router.get("/", async (req, res) => {
  try {
    const performance = await Performance.find();
    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
