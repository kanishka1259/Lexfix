import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LearningPathTimeline = () => {
    const [path, setPath] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let token = localStorage.getItem('token');

                if (!token || token === 'null' || token === 'undefined') {
                    // Try 'user' key (set by Login.jsx)
                    const userStr = localStorage.getItem('user');
                    if (userStr) {
                        try {
                            const parsed = JSON.parse(userStr);
                            token = parsed.token || parsed.data?.token;
                        } catch (e) {
                            console.error("Error parsing user from localStorage", e);
                        }
                    }
                }

                // Fallback to 'userInfo' (legacy/alternative)
                if (!token || token === 'null' || token === 'undefined') {
                    const userInfo = localStorage.getItem('userInfo');
                    if (userInfo) {
                        try {
                            const parsed = JSON.parse(userInfo);
                            token = parsed.token || parsed.data?.token;
                        } catch (e) {
                            console.error("Error parsing userInfo", e);
                        }
                    }
                }

                if (!token || token === 'null' || token === 'undefined') {
                    console.error("No token found");
                    // We can set loading false here, but the user will see 'Not found'.
                    // Ideally redirected or showed 'Please login'.
                    setLoading(false);
                    return;
                }
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [pathRes, reviewsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/module4/learning-path', config),
                    axios.get('http://localhost:5000/api/module4/learning-path/reviews', config)
                ]);

                setPath(pathRes.data.data);
                setReviews(reviewsRes.data.data);
            } catch (err) {
                console.error("Error fetching path data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const navigate = useNavigate();

    const handleContinue = (lessonId) => {
        navigate(`/student/read/${lessonId}`);
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64" aria-live="polite">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5E3C]"></div>
        </div>
    );

    if (!path) return <div className="text-gray-500">Learning path not found (Error loading data).</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-[#5A4A42] mb-6">Your Learning Journey</h2>
                <div className="border-l-4 border-[#F5EBE0] ml-4 pl-8 space-y-12">
                    {Array.isArray(path) && path.length > 0 ? (
                        path.map((lesson, idx) => (
                            <div key={lesson.lessonId || lesson.id} className="relative group">
                                {/* Marker */}
                                <div className={`absolute -left-[43px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm 
                                ${lesson.status === 'completed' ? 'bg-[#8B5E3C]' :
                                        lesson.status === 'current' ? 'bg-[#C08B76] ring-4 ring-[#F5EBE0]' : 'bg-gray-200'}`}
                                ></div>

                                <div className={`bg-white p-6 rounded-xl border transition-all 
                                ${lesson.status === 'current' ? 'border-[#C08B76] shadow-md transform scale-105' : 'border-gray-100 shadow-sm hover:shadow-md'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`font-bold text-lg ${lesson.status === 'current' ? 'text-[#8B5E3C]' : 'text-gray-700'}`}>
                                            {lesson.title || `Lesson ${lesson.lessonId}`}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                        ${lesson.difficulty === 'hard' ? 'bg-red-50 text-red-700' :
                                                lesson.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                                            {lesson.difficulty}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4">Module: {lesson.moduleName}</p>

                                    {lesson.status === 'current' && (
                                        <button
                                            onClick={() => handleContinue(lesson.lessonId || lesson.id)}
                                            className="bg-[#8B5E3C] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#6D4930] transition-colors w-full sm:w-auto">
                                            Continue Learning
                                        </button>
                                    )}
                                    {lesson.status === 'completed' && (
                                        <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                                            <span>✓</span> Completed
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500">No lessons available in your path.</div>
                    )}
                </div>
            </div>

            {/* Review Queue */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
                <h3 className="font-bold text-lg text-[#5A4A42] mb-4 flex items-center gap-2">
                    <span>🔄</span> Review Queue
                    <span className="bg-[#F5EBE0] text-[#8B5E3C] text-xs px-2 py-0.5 rounded-full ml-auto">{reviews.length}</span>
                </h3>
                {reviews.length === 0 ? (
                    <p className="text-gray-400 text-sm">No reviews due today. Great job!</p>
                ) : (
                    <ul className="space-y-3">
                        {reviews.map(item => (
                            <li key={item.lessonId} className="flex justify-between items-center bg-[#FAFAFA] p-3 rounded-lg border border-gray-50 hover:border-[#F5EBE0] transition-colors">
                                <span className="text-gray-700 font-medium text-sm">Lesson {item.lessonId}</span>
                                <button
                                    onClick={() => handleContinue(item.lessonId)}
                                    className="text-xs text-[#8B5E3C] hover:underline font-bold">
                                    Review
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LearningPathTimeline;
