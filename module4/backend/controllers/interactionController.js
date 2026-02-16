import RecommendationInteraction from "../models/RecommendationInteraction.js";

export const logInteraction = async (req, res) => {
    try {
        const { lessonId, actionType, recommendationId, metadata } = req.body;
        const userId = req.user.id; // From auth middleware

        const interaction = new RecommendationInteraction({
            userId,
            lessonId,
            actionType,
            recommendationId,
            metadata
        });

        await interaction.save();

        res.status(201).json({ success: true, message: "Interaction logged" });
    } catch (err) {
        console.error("Error logging interaction:", err);
        // Don't block UI on logging error, just return error
        res.status(400).json({ message: "Error logging interaction" });
    }
};
