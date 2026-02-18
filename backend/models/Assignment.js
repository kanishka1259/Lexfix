// models/Assignment.js
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    // Split content into sentences for line-by-line reading
    sentences: [{
        type: String
    }],
    disability: {
        type: String,
        enum: ['adhd', 'autism', 'dyslexia', 'dyscalculia', 'dysgraphia'],
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Specific students this assignment is for
    assignedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Split content into sentences before saving
assignmentSchema.pre('save', function (next) {
    if (this.isModified('content') && this.content) {
        // Split by sentence boundaries
        this.sentences = this.content
            .split(/(?<=[.!?])\s+/)
            .filter(s => s.trim().length > 0);
    }
    next();
});

export default mongoose.model("Assignment", assignmentSchema);
