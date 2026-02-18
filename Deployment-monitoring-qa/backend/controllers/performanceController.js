const Metrics = require("../models/PerformanceMetrics");
const config = require("../config/performanceConfig");

exports.recordMetrics = async (req, res) => {
    const metric = await Metrics.create(req.body);
    res.json(metric);
};

exports.checkPerformance = async (req, res) => {

    const latest = await Metrics.findOne().sort({ timestamp: -1 });

    if (!latest) return res.json({ message: "No metrics yet" });

    const status =
        latest.responseTime > config.maxResponseTimeMs
            ? "Performance Degraded"
            : "Healthy";

    res.json({ latest, status });
};
