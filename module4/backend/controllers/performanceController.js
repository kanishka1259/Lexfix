import UserPerformance from "../models/UserPerformance.js";
import PerformanceSummary from "../models/PerformanceSummary.js";
import { updateUserSummary } from "../services/performanceService.js";
import { recordPerformanceSchema } from "../validation/performanceValidation.js";

export const recordPerformance = async (req, res) => {
    try {
        const { error } = recordPerformanceSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { lessonId, moduleName, difficulty, score, totalQuestions, timeTakenSeconds } = req.body;
        const userId = req.user.id;

        // Calculate accuracy
        const accuracy = (score / totalQuestions) * 100;

        const newPerformance = new UserPerformance({
            userId,
            lessonId,
            moduleName,
            difficulty,
            score,
            totalQuestions,
            accuracy,
            timeTakenSeconds
        });

        await newPerformance.save();

        // Update summary asynchronously (or await if critical)
        await updateUserSummary(userId, newPerformance);

        res.status(201).json({
            success: true,
            data: newPerformance,
            message: "Performance recorded successfully"
        });

    } catch (err) {
        console.error("Error recording performance:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getPerformanceSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const summary = await PerformanceSummary.findOne({ userId });

        if (!summary) {
            return res.status(200).json({
                success: true,
                data: { totalLessonsCompleted: 0, averageAccuracy: 0, implementation_note: "No data yet" }
            });
        }

        res.status(200).json({
            success: true,
            data: summary
        });

    } catch (err) {
        console.error("Error fetching summary:", err);
        res.status(500).json({ message: "Server error" });
    }
};
