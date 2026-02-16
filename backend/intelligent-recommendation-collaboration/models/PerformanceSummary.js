import mongoose from "mongoose";

const performanceSummarySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    totalLessonsCompleted: {
        type: Number,
        default: 0
    },
    averageAccuracy: {
        type: Number,
        default: 0
    },
    currentStreak: {
        type: Number,
        default: 0
    },
    lastActivityDate: {
        type: Date
    },
    difficultyLevels: {
        easy: { count: { type: Number, default: 0 }, avgAccuracy: { type: Number, default: 0 } },
        medium: { count: { type: Number, default: 0 }, avgAccuracy: { type: Number, default: 0 } },
        hard: { count: { type: Number, default: 0 }, avgAccuracy: { type: Number, default: 0 } }
    },
    // For spaced repetition / recommendation
    masteredTopics: [String],
    needsFocusTopics: [String]
}, { timestamps: true });

export default mongoose.model("PerformanceSummary", performanceSummarySchema);
