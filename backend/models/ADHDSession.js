import mongoose from "mongoose";

const adhdSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    sentences: [{
        index: {
            type: Number,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        timeSpent: {
            type: Number, // in seconds
            default: 0
        },
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: Date
    }],
    totalTime: {
        type: Number, // in seconds
        default: 0
    },
    breaksTaken: {
        type: Number,
        default: 0
    },
    completionStatus: {
        type: String,
        enum: ['In Progress', 'Completed', 'Abandoned'],
        default: 'In Progress'
    },
    moduleCompleted: {
        type: Number, // Which of 5 modules (1-5)
        min: 1,
        max: 5
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    currentSentenceIndex: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Calculate total time when session is updated
adhdSessionSchema.pre('save', function (next) {
    if (this.sentences && this.sentences.length > 0) {
        this.totalTime = this.sentences.reduce((total, sentence) => total + sentence.timeSpent, 0);
    }
    next();
});

export default mongoose.model("ADHDSession", adhdSessionSchema);
