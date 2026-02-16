import { getRecommendationsForUser } from "../services/recommendationService.js";
import User from "../../../backend/models/User.js"; // Import main User model to get profile

export const getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch full user profile for disability info
        const user = await User.findById(userId);

        const data = await getRecommendationsForUser(userId, user);

        res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        console.error("Error getting recommendations:", err);
        res.status(500).json({ message: "Server error" });
    }
};
