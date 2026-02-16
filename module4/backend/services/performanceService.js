import UserPerformance from "../models/UserPerformance.js";
import PerformanceSummary from "../models/PerformanceSummary.js";

export const updateUserSummary = async (userId, newPerformance) => {
    let summary = await PerformanceSummary.findOne({ userId });

    if (!summary) {
        summary = new PerformanceSummary({ userId });
    }

    // Update basic counters
    summary.totalLessonsCompleted += 1;
    summary.lastActivityDate = new Date();

    // Update difficulty stats
    const diff = newPerformance.difficulty; // 'easy', 'medium', 'hard'
    if (summary.difficultyLevels[diff]) {
        const stats = summary.difficultyLevels[diff];
        const newCount = stats.count + 1;
        // incremental average: newAvg = ((oldAvg * oldCnt) + newVal) / newCnt
        const newAvg = ((stats.avgAccuracy * stats.count) + newPerformance.accuracy) / newCount;

        stats.count = newCount;
        stats.avgAccuracy = newAvg;
    }

    // Update global average accuracy
    // Re-calculating from all records might be ostensibly safer but slower. 
    // For now, let's just do incremental or re-query if needed. 
    // Let's do a quick aggregation to be accurate.
    const aggregate = await UserPerformance.aggregate([
        { $match: { userId: userId } },
        {
            $group: {
                _id: null,
                avgAccuracy: { $avg: "$accuracy" }
            }
        }
    ]);

    if (aggregate.length > 0) {
        summary.averageAccuracy = aggregate[0].avgAccuracy;
    } else {
        summary.averageAccuracy = newPerformance.accuracy;
    }

    await summary.save();
    return summary;
};
