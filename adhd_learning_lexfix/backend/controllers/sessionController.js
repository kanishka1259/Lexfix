// controllers/sessionController.js
import Session from "../models/Session.js";

export const startSession = async (req, res) => {
    try {
        const session = await Session.create({
            startTime: new Date(),
            sentencesViewed: 0
        });
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const endSession = async (req, res) => {
    try {
        const { id } = req.params;
        const { sentencesViewed } = req.body;

        const session = await Session.findById(id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        session.endTime = new Date();
        session.totalTime = Math.floor((session.endTime - session.startTime) / 1000);
        session.sentencesViewed = sentencesViewed;

        await session.save();
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find().sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
