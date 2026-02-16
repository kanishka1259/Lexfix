import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lessonId: {
        type: String,
        required: true
    },
    recommendationId: {
        type: String // Optional: ID of the recommendation logic run or session
    },
    actionType: {
        type: String,
        enum: ['view', 'click', 'start', 'complete', 'dismiss'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    metadata: {
        type: Object // Flexible field for extra data
    }
}, { timestamps: true });

export default mongoose.model("RecommendationInteraction", interactionSchema);
