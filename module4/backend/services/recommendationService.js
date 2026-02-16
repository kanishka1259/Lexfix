import PerformanceSummary from "../models/PerformanceSummary.js";
import UserPerformance from "../models/UserPerformance.js";

import { MOCK_LESSONS } from "../data/lessons.js";


export const getRecommendationsForUser = async (userId, userProfile) => {
    // 1. Get User Performance Summary
    const summary = await PerformanceSummary.findOne({ userId });

    // Default recommendations if no data
    if (!summary || summary.totalLessonsCompleted === 0) {
        return {
            level: "easy",
            reason: "Start your journey here!",
            recommendations: MOCK_LESSONS.filter(l => l.difficulty === "easy").slice(0, 3)
        };
    }

    // 2. Determine Difficulty Level Rule
    // < 60 -> Easier
    // 60-80 -> Same
    // > 80 -> Harder

    let currentAvg = summary.averageAccuracy;

    // Get last performance's accuracy to be more responsive?
    // Prompt says "accuracy < 60 -> easier". Usually implies "last performance" or "recent average".
    // Let's check the last performance record for immediate feedback.
    const lastPerf = await UserPerformance.findOne({ userId }).sort({ createdAt: -1 });
    if (lastPerf) {
        currentAvg = lastPerf.accuracy;
    }

    let targetDifficulty = "medium";
    let reason = "Maintaining current difficulty level.";

    if (currentAvg < 60) {
        targetDifficulty = "easy";
        reason = "Let's build confidence with some easier tasks.";
    } else if (currentAvg > 80) {
        targetDifficulty = "hard";
        reason = "You're doing great! Challenge yourself.";
    } else {
        targetDifficulty = "medium";
        reason = "Steady progress. improved skills.";
    }

    // If "hard" requested but none available or user struggling on hard, fallback?
    // For now, strict rule implementation.

    // 3. Filter Lessons
    // Exclude completed lessons (unless reviewing - handled in Story 4.3)
    // For 4.2, we just recommend "next" relevant ones.
    const completedLessonIds = await UserPerformance.find({ userId }).distinct("lessonId");

    let recommendations = MOCK_LESSONS.filter(l =>
        l.difficulty === targetDifficulty && !completedLessonIds.includes(l.id)
    );

    // Fallback: If no lessons of target difficulty found (e.g. only easy left?), 
    // maybe show other difficulties
    if (recommendations.length === 0) {
        recommendations = MOCK_LESSONS.filter(l => !completedLessonIds.includes(l.id));
        if (recommendations.length === 0) {
            return {
                level: "completed",
                reason: "You have completed all available lessons!",
                recommendations: []
            };
        }
        reason += " (Showing available lessons)";
    }

    // 4. Accessibility/Profile adjustments (Mock logic)
    // e.g., if user has 'dyslexia', prioritize 'Reading' category or specific tags?
    // userProfile.disability is array.
    if (userProfile.disability && userProfile.disability.includes('dyslexia')) {
        // Boost 'phonics' or 'reading'
        recommendations.sort((a, b) => {
            const aRel = a.category === 'Reading' ? 1 : 0;
            const bRel = b.category === 'Reading' ? 1 : 0;
            return bRel - aRel;
        });
    }

    return {
        level: targetDifficulty,
        reason,
        recommendations: recommendations.slice(0, 3) // Return top 3
    };
};
