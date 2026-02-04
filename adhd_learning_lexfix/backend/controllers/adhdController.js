import ADHDSession from "../models/ADHDSession.js";
import Task from "../models/Task.js";

// @desc    Start a new ADHD learning session
// @route   POST /api/adhd/session/start
// @access  Private
export const startSession = async (req, res) => {
    try {
        const { taskId } = req.body;
        const userId = req.user._id || req.user.id;

        // Find the task
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Create sentences array from task content
        const sentences = task.content.map((sentence, index) => ({
            index,
            content: sentence,
            timeSpent: 0,
            completed: false
        }));

        // Create new ADHD session
        const session = await ADHDSession.create({
            userId,
            taskId,
            sentences,
            currentSentenceIndex: 0
        });

        res.status(201).json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error('Start session error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Track sentence completion and time
// @route   POST /api/adhd/session/sentence
// @access  Private
export const trackSentence = async (req, res) => {
    try {
        const { sessionId, sentenceIndex, timeSpent } = req.body;

        const session = await ADHDSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // Update sentence data
        if (session.sentences[sentenceIndex]) {
            session.sentences[sentenceIndex].timeSpent = timeSpent;
            session.sentences[sentenceIndex].completed = true;
            session.sentences[sentenceIndex].completedAt = new Date();
            session.currentSentenceIndex = sentenceIndex + 1;
        }

        await session.save();

        res.json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error('Track sentence error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Record a break taken
// @route   POST /api/adhd/session/break
// @access  Private
export const recordBreak = async (req, res) => {
    try {
        const { sessionId } = req.body;

        const session = await ADHDSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        session.breaksTaken += 1;
        await session.save();

        res.json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error('Record break error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete ADHD session
// @route   POST /api/adhd/session/complete
// @access  Private
export const completeSession = async (req, res) => {
    try {
        const { sessionId, moduleCompleted } = req.body;

        const session = await ADHDSession.findById(sessionId);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        session.completionStatus = 'Completed';
        session.completedAt = new Date();
        session.moduleCompleted = moduleCompleted;

        await session.save();

        // Calculate statistics
        const stats = {
            totalSentences: session.sentences.length,
            completedSentences: session.sentences.filter(s => s.completed).length,
            totalTime: session.totalTime,
            averageTimePerSentence: session.totalTime / session.sentences.length,
            breaksTaken: session.breaksTaken
        };

        res.json({
            success: true,
            data: session,
            stats
        });
    } catch (error) {
        console.error('Complete session error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's ADHD progress
// @route   GET /api/adhd/progress/:userId
// @access  Private
export const getProgress = async (req, res) => {
    try {
        const { userId } = req.params;

        const sessions = await ADHDSession.find({ userId })
            .populate('taskId', 'title description')
            .sort({ createdAt: -1 });

        const completedSessions = sessions.filter(s => s.completionStatus === 'Completed');

        const stats = {
            totalSessions: sessions.length,
            completedSessions: completedSessions.length,
            totalFocusTime: completedSessions.reduce((total, s) => total + s.totalTime, 0),
            averageSessionTime: completedSessions.length > 0
                ? completedSessions.reduce((total, s) => total + s.totalTime, 0) / completedSessions.length
                : 0,
            moduleProgress: {
                module1: completedSessions.filter(s => s.moduleCompleted === 1).length,
                module2: completedSessions.filter(s => s.moduleCompleted === 2).length,
                module3: completedSessions.filter(s => s.moduleCompleted === 3).length,
                module4: completedSessions.filter(s => s.moduleCompleted === 4).length,
                module5: completedSessions.filter(s => s.moduleCompleted === 5).length,
            }
        };

        res.json({
            success: true,
            data: {
                sessions,
                stats
            }
        });
    } catch (error) {
        console.error('Get progress error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active session for user
// @route   GET /api/adhd/session/active
// @access  Private
export const getActiveSession = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;

        const session = await ADHDSession.findOne({
            userId,
            completionStatus: 'In Progress'
        }).populate('taskId');

        res.json({
            success: true,
            data: session
        });
    } catch (error) {
        console.error('Get active session error:', error);
        res.status(500).json({ message: error.message });
    }
};
