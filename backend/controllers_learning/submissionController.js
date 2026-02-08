// controllers/submissionController.js
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";
import ReadingSession from "../models/ReadingSession.js";

// Create or update submission
export const upsertSubmission = async (req, res) => {
    try {
        const { assignmentId, currentSentenceIndex, timeSpent, distractionCount, breaksTaken, status } = req.body;

        let submission = await Submission.findOne({
            assignment: assignmentId,
            student: req.user.id
        });

        if (submission) {
            // Update existing submission
            submission.currentSentenceIndex = currentSentenceIndex ?? submission.currentSentenceIndex;
            submission.timeSpent = timeSpent ?? submission.timeSpent;
            submission.distractionCount = distractionCount ?? submission.distractionCount;
            submission.breaksTaken = breaksTaken ?? submission.breaksTaken;
            submission.status = status ?? submission.status;

            if (status === 'completed' && !submission.completedAt) {
                submission.completedAt = new Date();
            }

            // Add to completed sentences if not already there
            if (currentSentenceIndex !== undefined && !submission.completedSentences.includes(currentSentenceIndex)) {
                submission.completedSentences.push(currentSentenceIndex);
            }

            await submission.save();
        } else {
            // Create new submission
            submission = await Submission.create({
                assignment: assignmentId,
                student: req.user.id,
                currentSentenceIndex: currentSentenceIndex ?? 0,
                timeSpent: timeSpent ?? 0,
                distractionCount: distractionCount ?? 0,
                breaksTaken: breaksTaken ?? 0,
                status: status ?? 'in-progress',
                completedSentences: currentSentenceIndex >= 0 ? [currentSentenceIndex] : []
            });
        }

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get student's submission for an assignment
export const getStudentSubmission = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const submission = await Submission.findOne({
            assignment: assignmentId,
            student: req.user.id
        }).populate('assignment');

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all submissions for a student
export const getAllStudentSubmissions = async (req, res) => {
    try {
        const studentId = req.user.role === 'student' ? req.user.id : req.params.studentId;

        const submissions = await Submission.find({
            student: studentId
        })
            .populate('assignment')
            .sort({ updatedAt: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all submissions for an assignment (teacher view)
export const getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const submissions = await Submission.find({
            assignment: assignmentId
        })
            .populate('student', 'name email disability')
            .sort({ updatedAt: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Start a new reading session
export const startReadingSession = async (req, res) => {
    try {
        const { assignmentId, submissionId } = req.body;

        const session = await ReadingSession.create({
            student: req.user.id,
            assignment: assignmentId,
            submission: submissionId,
            startTime: new Date(),
            isActive: true
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update reading session
export const updateReadingSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { sentenceRead, distractionEvent, breakEvent, endSession } = req.body;

        const session = await ReadingSession.findById(sessionId);

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (sentenceRead) {
            session.sentencesRead.push(sentenceRead);
        }

        if (distractionEvent) {
            session.distractionEvents.push(distractionEvent);
        }

        if (breakEvent) {
            session.breakEvents.push(breakEvent);
        }

        if (endSession) {
            session.endTime = new Date();
            session.isActive = false;
        }

        await session.save();
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
