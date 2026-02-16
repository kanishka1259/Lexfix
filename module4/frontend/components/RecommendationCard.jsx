import React from 'react';

const RecommendationCard = ({ lesson, onStart }) => {
    const difficultyColors = {
        easy: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        hard: 'bg-red-100 text-red-800'
    };

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[lesson.difficulty] || 'bg-gray-100 text-gray-800'}`}>
                            {lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1)}
                        </span>
                        <p className="mt-2 text-sm font-medium text-gray-500 truncate">
                            {lesson.module} - {lesson.category}
                        </p>
                    </div>
                    {/* Accessibility icon or similar could go here */}
                </div>
                <h3 className="mt-2 text-lg leading-6 font-medium text-gray-900">
                    {lesson.title}
                </h3>
                <div className="mt-4 flex gap-2">
                    {lesson.tags && lesson.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            #{tag}
                        </span>
                    ))}
                </div>
                <div className="mt-5">
                    <button
                        onClick={() => onStart(lesson.id)}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        aria-label={`Start lesson: ${lesson.title}`}
                    >
                        Start Lesson
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecommendationCard;
