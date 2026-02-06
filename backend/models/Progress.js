// models/Progress.js
import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
    lessonId: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    timeSpent: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model("Progress", progressSchema);
