import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecommendationCard from '../components/RecommendationCard';

const RecommendationDashboard = () => {
    const [data, setData] = useState({ level: 'loading', reason: '', recommendations: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                let tokenToUse = localStorage.getItem('token');
                if (!tokenToUse) {
                    const userInfo = localStorage.getItem('userInfo');
                    if (userInfo) {
                        const parsed = JSON.parse(userInfo);
                        tokenToUse = parsed.token || parsed.data?.token;
                    }
                }

                const config = {
                    headers: { Authorization: `Bearer ${tokenToUse}` }
                };

                const res = await axios.get('http://localhost:5000/api/module4/recommendations', config);
                setData(res.data.data);

                // Log view interaction
                await axios.post('http://localhost:5000/api/module4/interactions', {
                    lessonId: 'dashboard-view',
                    actionType: 'view',
                    metadata: { count: res.data.data.recommendations.length }
                }, config);

            } catch (err) {
                console.error("Error fetching recommendations", err);
                setError('Failed to load personalized recommendations.');
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const handleStartLesson = async (lessonId) => {
        try {
            let token = localStorage.getItem('token');
            if (!token) {
                const userInfo = localStorage.getItem('userInfo');
                if (userInfo) token = JSON.parse(userInfo).token || JSON.parse(userInfo).data?.token;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };

            await axios.post('http://localhost:5000/api/module4/interactions', {
                lessonId: lessonId,
                actionType: 'start'
            }, config);
        } catch (e) {
            console.error("Interaction log failed", e);
        }
        alert(`Starting lesson ${lessonId} (Prototype)`);
        // Navigation to actual lesson player would go here
    };


    if (loading) return (
        <div className="flex justify-center items-center h-64" aria-live="polite">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="sr-only">Loading recommendations...</span>
        </div>
    );

    if (error) return (
        <div className="bg-red-50 p-4 rounded-md" aria-live="assertive">
            <div className="flex">
                <div className="flex-shrink-0">
                    {/* Icon */}
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="bg-[#F5EBE0] border-l-4 border-[#8B5E3C] p-6 mb-8 rounded-r-lg shadow-sm">
                <div className="flex">
                    <div className="ml-3">
                        <h2 className="text-xl font-bold text-[#5A4A42]">
                            Current Level: {data.level ? data.level.toUpperCase() : 'UNKNOWN'}
                        </h2>
                        <p className="text-[#8B5E3C] mt-2 font-medium">
                            {data.reason}
                        </p>
                    </div>
                </div>
            </div>

            <h3 className="text-2xl font-bold text-[#5A4A42] mb-6">Recommended for You</h3>

            {data.recommendations.length === 0 ? (
                <p className="text-gray-500 italic">No recommendations available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {data.recommendations.map(lesson => (
                        <RecommendationCard
                            key={lesson.id}
                            lesson={lesson}
                            onStart={handleStartLesson}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecommendationDashboard;
