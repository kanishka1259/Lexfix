const AccessibilityLog = require("../models/AccessibilityLog");
const Usage = require("../models/UserAccessibilityUsage");

exports.logError = async (req, res) => {
    const log = await AccessibilityLog.create(req.body);
    res.json(log);
};

exports.trackUsage = async (req, res) => {
    const usage = await Usage.create(req.body);
    res.json(usage);
};
