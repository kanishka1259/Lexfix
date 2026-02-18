import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { BarChart, Activity, User } from 'lucide-react';

const ParentDashboard = () => {
    const { user, logout } = useAppContext();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const headers = { Authorization: `Bearer ${token}` };

                // 1. Get children from ADHD Backend (Port 5000)
                const childrenRes = await axios.get('http://localhost:5000/api/parent/children', { headers });
                const childrenList = childrenRes.data;

                // 2. Fetch progress for each child
                const childrenWithData = await Promise.all(childrenList.map(async (child) => {
                    try {
                        const progressRes = await axios.get(`http://localhost:5000/api/parent/child/${child._id}/progress`, { headers });
                        return {
                            ...child,
                            statistics: progressRes.data.statistics,
                            submissions: progressRes.data.submissions,
                            lastActive: progressRes.data.submissions?.[0] ? new Date(progressRes.data.submissions[0].updatedAt).toLocaleTimeString() : 'No recent activity'
                        };
                    } catch (e) {
                        return { ...child, statistics: null, submissions: [], lastActive: 'No data' };
                    }
                }));

                setStudents(childrenWithData);
            } catch (err) {
                console.error("Failed to fetch progress", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchProgress();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
                    <p className="text-gray-600">Track your child's learning journey</p>
                </div>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </header>

            <div className="max-w-6xl mx-auto">
                {loading ? (
                    <p>Loading progress...</p>
                ) : (
                    <div className="grid gap-6">
                        {students.map(student => (
                            <div key={student.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                            <User size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">{student.name}</h3>
                                            <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                                {student.disability} Program
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-500 text-sm">Last Active</p>
                                        <p className="font-medium">{student.lastActive}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                        <p className="text-xs text-green-600 uppercase font-bold mb-1">Completed</p>
                                        <p className="text-2xl font-bold text-green-700">{student.statistics?.completedAssignments || 0}</p>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                        <p className="text-xs text-amber-600 uppercase font-bold mb-1">In Progress</p>
                                        <p className="text-2xl font-bold text-amber-700">{student.statistics?.inProgressAssignments || 0}</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <p className="text-xs text-blue-600 uppercase font-bold mb-1">Focus Level</p>
                                        <p className="text-2xl font-bold text-blue-700">
                                            {student.statistics?.totalDistractions === 0 ? 'High' : (student.statistics?.totalDistractions > 5 ? 'Low' : 'Med')}
                                        </p>
                                    </div>
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                        <p className="text-xs text-purple-600 uppercase font-bold mb-1">Time Spent</p>
                                        <p className="text-2xl font-bold text-purple-700">{Math.floor((student.statistics?.totalTimeSpent || 0) / 60)}m</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h4 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2">Recent Activities</h4>
                                    {student.submissions && student.submissions.length > 0 ? (
                                        <div className="space-y-2">
                                            {student.submissions.slice(0, 3).map(sub => (
                                                <div key={sub._id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded">
                                                    <span className="text-gray-600">{sub.assignment?.title || 'Learning Task'}</span>
                                                    <span className={`font-semibold ${sub.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>
                                                        {sub.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No recent activity detected.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParentDashboard;
