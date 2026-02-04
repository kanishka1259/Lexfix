// models/Task.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: "Teacher Assigned Task"
    },
    content: [{
        type: String,
        required: true
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    estimatedTime: {
        type: Number, // in minutes
        default: 10
    },
    moduleType: {
        type: String,
        enum: ['Module1_SessionEntry', 'Module2_ContentPresentation', 'Module3_TimerPacing', 'Module4_ProgressTracking', 'Module5_CompletionReview'],
        default: 'Module2_ContentPresentation'
    },
    status: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Draft'
    }
}, {
    timestamps: true
});

export default mongoose.model("Task", taskSchema);
