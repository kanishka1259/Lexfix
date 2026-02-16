import UserPerformance from "../models/UserPerformance.js";
import { MOCK_LESSONS } from "../data/lessons.js";

// Spaced Repetition Logic
export const calculateNextReviewDate = (accuracy) => {
    const now = new Date();
    let daysToAdd = 1;

    if (accuracy < 60) {
        daysToAdd = 1;
    } else if (accuracy <= 80) {
        daysToAdd = 3;
    } else {
        daysToAdd = 7;
    }

    const nextDate = new Date(now);
    nextDate.setDate(now.getDate() + daysToAdd);
    return nextDate;
};

export const getLearningPath = async (userId) => {
    // Return all lessons with their status for the user
    // ordered by sequence

    // Get all performances to map status
    const performances = await UserPerformance.find({ userId });
    const performanceMap = {};
    performances.forEach(p => {
        // Keep the best or latest? Usually latest for status, but best for unlocking?
        // Let's use latest to see if they passed.
        // If multiple attempts, check if any passed.
        if (!performanceMap[p.lessonId] || new Date(p.createdAt) > new Date(performanceMap[p.lessonId].createdAt)) {
            performanceMap[p.lessonId] = p;
        }
    });

    const path = MOCK_LESSONS.sort((a, b) => a.sequence - b.sequence).map(lesson => {
        const perf = performanceMap[lesson.id];
        let status = "locked";

        // Logic:
        // 1. If completed (score exists and accuracy > pass threshold?), status = completed
        // 2. If previous lesson completed, this one is unlocked/active.
        // 3. First lesson always active.

        if (perf) {
            status = "completed";
            if (perf.accuracy < 60) status = "needs-review";
        }

        return {
            ...lesson,
            status,
            lastScore: perf ? perf.score : null,
            lastAccuracy: perf ? perf.accuracy : null
        };
    });

    // Unlock logic: Unlock next lesson if previous is completed
    for (let i = 0; i < path.length; i++) {
        if (i === 0 && path[i].status === "locked") {
            path[i].status = "active";
        } else if (i > 0) {
            const prev = path[i - 1];
            if ((prev.status === "completed" || prev.status === "needs-review") && path[i].status === "locked") {
                path[i].status = "active";
            }
        }
    }

    return path;
};

export const getReviewNeeded = async (userId) => {
    // Find lessons where review date is due
    // We need to store 'nextReviewDate' in UserPerformance or separate tracking.
    // For this prototype, I'll calculate it on the fly based on the LAST attempt time and accuracy.
    // This is less efficient but avoids schema migration request if I forgot to add it.
    // Wait, I can calculate based on `updatedAt` / `createdAt` of the performance record.

    const performances = await UserPerformance.find({ userId });
    const reviews = [];

    // Group by lessonId, get latest
    const latestPerf = {};
    performances.forEach(p => {
        if (!latestPerf[p.lessonId] || new Date(p.createdAt) > new Date(latestPerf[p.lessonId].createdAt)) {
            latestPerf[p.lessonId] = p;
        }
    });

    const now = new Date();

    Object.values(latestPerf).forEach(perf => {
        const nextReview = calculateNextReviewDate(perf.accuracy);
        // Correct logic: review date = performance date + interval
        // calculateNextReviewDate above returns NOW + interval. 
        // I need interval.

        let interval = 1;
        if (perf.accuracy > 80) interval = 7;
        else if (perf.accuracy >= 60) interval = 3;

        const reviewDate = new Date(perf.createdAt);
        reviewDate.setDate(reviewDate.getDate() + interval);

        if (now >= reviewDate) {
            reviews.push({
                lessonId: perf.lessonId,
                nextReviewDate: reviewDate,
                lastAccuracy: perf.accuracy
            });
        }
    });

    // map to lesson details
    return reviews.map(r => {
        const lesson = MOCK_LESSONS.find(l => l.id === r.lessonId);
        return { ...lesson, ...r };
    }).filter(l => l.id); // remove if lesson not found (e.g. old data)
};
