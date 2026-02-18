const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    errorType: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AccessibilityLog", schema);
