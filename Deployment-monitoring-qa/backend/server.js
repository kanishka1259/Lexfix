const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const deploymentRoutes = require("./routes/deploymentRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");
const qaRoutes = require("./routes/qaRoutes");
const performanceRoutes = require("./routes/performanceRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/accessibilityDB")
.then(()=> console.log("Database Connected"));

app.use("/deployment", deploymentRoutes);
app.use("/monitoring", monitoringRoutes);
app.use("/qa", qaRoutes);
app.use("/performance", performanceRoutes);

app.listen(5000, ()=> console.log("Server Running"));
