// models/Session.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: Date,
    totalTime: {
        type: Number,
        default: 0
    },
    sentencesViewed: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

export default mongoose.model("Session", sessionSchema);
