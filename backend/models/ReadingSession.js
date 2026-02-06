// models/ReadingSession.js
import mongoose from "mongoose";

const readingSessionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    submission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    sentencesRead: [{
        sentenceIndex: Number,
        timestamp: Date,
        timeSpent: Number // seconds
    }],
    distractionEvents: [{
        timestamp: Date,
        sentenceIndex: Number
    }],
    breakEvents: [{
        startTime: Date,
        endTime: Date,
        gameType: String
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model("ReadingSession", readingSessionSchema);
