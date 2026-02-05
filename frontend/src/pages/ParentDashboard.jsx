import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import { BarChart, Activity, User } from 'lucide-react';

const ParentDashboard = () => {
    const { user, logout } = useAppContext();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch linked students or mock data for now
        // In a real scenario, we'd fetch from /api/users/linked-students
        const fetchProgress = async () => {
            try {
                // Mocking data since specific endpoint might not exist yet
                // Use actual API call when 'linked-students' endpoint is ready
                setStudents([
                    { id: 1, name: "Student Demo", disability: "ADHD", progress: 75, lastActive: "2 hours ago" }
                ]);
            } catch (err) {
                console.error("Failed to fetch progress", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

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

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Course Completion</span>
                                        <span className="font-bold">{student.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: `${student.progress}%` }}
                                        ></div>
                                    </div>
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
