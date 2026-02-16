import mongoose from "mongoose";

const userPerformanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    lessonId: {
        type: String,
        required: true
    },
    moduleName: {
        type: String,
        required: true // e.g., "Module 1", "Module 2"
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        default: "medium"
    },
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number, // Percentage 0-100
        required: true
    },
    timeTakenSeconds: {
        type: Number
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model("UserPerformance", userPerformanceSchema);
