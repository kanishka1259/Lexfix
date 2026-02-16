const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const deploymentRoutes = require("./routes/deploymentRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");
const qaRoutes = require("./routes/qaRoutes");
const performanceRoutes = require("./routes/performanceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/deployment", deploymentRoutes);
app.use("/monitoring", monitoringRoutes);
app.use("/qa", qaRoutes);
app.use("/performance", performanceRoutes);

// Export app for testing
module.exports = app;
