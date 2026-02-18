const express = require("express");
const router = express.Router();
const DeploymentStatus = require("../models/DeploymentStatus");

// POST Deployment
router.post("/", async (req, res) => {
  try {
    const deployment = new DeploymentStatus(req.body);
    await deployment.save();
    res.json(deployment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Deployment
router.get("/", async (req, res) => {
  try {
    const deployments = await DeploymentStatus.find();
    res.json(deployments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
