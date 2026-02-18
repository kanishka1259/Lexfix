const express = require("express");
const router = express.Router();
const Monitoring = require("../models/UserAccessibilityUsage");

// POST Monitoring Data
router.post("/", async (req, res) => {
  try {
    const monitoring = new Monitoring(req.body);
    await monitoring.save();
    res.json(monitoring);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Monitoring Data
router.get("/", async (req, res) => {
  try {
    const monitoring = await Monitoring.find();
    res.json(monitoring);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
