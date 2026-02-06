// models/Submission.js
import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentSentenceIndex: {
        type: Number,
        default: 0
    },
    completedSentences: [{
        type: Number
    }],
    timeSpent: {
        type: Number, // in seconds
        default: 0
    },
    distractionCount: {
        type: Number,
        default: 0
    },
    breaksTaken: {
        type: Number,
        default: 0
    },
    focusMetrics: {
        averageTimePerSentence: Number,
        longestStreak: Number,
        currentStreak: Number
    },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'completed'],
        default: 'not-started'
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model("Submission", submissionSchema);
