const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    zone: String,
    status: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DeploymentStatus", schema);
