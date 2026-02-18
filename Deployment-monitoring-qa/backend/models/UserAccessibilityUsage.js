const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    userId: String,
    toolUsed: String,
    sessionDuration: Number
});

module.exports = mongoose.model("UserAccessibilityUsage", schema);
