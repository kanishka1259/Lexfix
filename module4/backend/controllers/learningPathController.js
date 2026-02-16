import { getLearningPath, getReviewNeeded } from "../services/learningPathService.js";

export const getPath = async (req, res) => {
    try {
        const userId = req.user.id;
        const path = await getLearningPath(userId);
        res.status(200).json({ success: true, data: path });
    } catch (err) {
        console.error("Error fetching learning path:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await getReviewNeeded(userId);
        res.status(200).json({ success: true, data: reviews });
    } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const generatePath = async (req, res) => {
    // In a real AI app, this would trigger a Python script or heavy calculation.
    // Here, we just acknowledge.
    res.status(200).json({ success: true, message: "Learning path optimized based on recent performance." });
};
