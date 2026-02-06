// controllers/progressController.js
import Progress from "../models/Progress.js";

export const getProgress = async (req, res) => {
    try {
        const progress = await Progress.find().sort({ createdAt: -1 });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { completed, timeSpent } = req.body;

        let progress = await Progress.findOne({ lessonId });

        if (!progress) {
            progress = await Progress.create({
                lessonId,
                completed,
                timeSpent
            });
        } else {
            progress.completed = completed;
            progress.timeSpent += timeSpent;
            await progress.save();
        }

        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
