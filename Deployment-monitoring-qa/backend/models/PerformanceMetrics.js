const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    usersActive: Number,
    responseTime: Number,
    serviceType: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PerformanceMetrics", schema);
