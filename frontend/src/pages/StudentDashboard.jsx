import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { BookOpen, CheckCircle, Clock, PlayCircle } from 'lucide-react';

const StudentDashboard = () => {
    console.log("StudentDashboard Rendering...");
    const { user, logout } = useAppContext();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const studentId = user?.id || user?._id;
                console.log("StudentDashboard Fetching for ID:", studentId);

                if (!token || !studentId) {
                    console.warn("Missing token or studentId", { token: !!token, studentId });
                    setLoading(false);
                    return;
                }

                // 1. Fetch from /api/tasks (Original System)
                const tasksPromise = axios.get(`http://localhost:5000/api/tasks/student/${studentId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // 2. Fetch from /api/assignments (Learning System)
                const assignmentsPromise = axios.get(`http://localhost:5000/api/assignments/my-assignments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const [tasksRes, assignRes] = await Promise.all([
                    tasksPromise.catch(e => {
                        console.error("System A (tasks) error:", e.message);
                        return { data: { success: false, data: [] } };
                    }),
                    assignmentsPromise.catch(e => {
                        console.error("System B (assignments) error:", e.message);
                        return { data: [] };
                    })
                ]);

                console.log("StudentDashboard Data Received:", {
                    tasks: tasksRes?.data,
                    assignments: assignRes?.data
                });

                let combinedTasks = [];

                // Normalize tasksRes
                if (tasksRes?.data?.data && Array.isArray(tasksRes.data.data)) {
                    combinedTasks = [...tasksRes.data.data];
                }

                // Normalize assignRes
                const rawAssignments = assignRes?.data?.data || assignRes?.data || [];
                const assignments = Array.isArray(rawAssignments) ? rawAssignments : [];

                const normalizedAssignments = assignments.map(a => ({
                    ...a,
                    type: 'assignment',
                    status: (a.status === 'active' ? 'Pending' : a.status) || 'Pending'
                }));

                setTasks([...combinedTasks, ...normalizedAssignments]);
            } catch (error) {
                console.error("Critical error in fetchTasks:", error);
                setFetchError(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTasks();
        }
    }, [user]);

    const handleStartTask = (task) => {
        if (!task || !task._id) return;
        if (task.type === 'assignment') {
            navigate(`/student/read/${task._id}`);
        } else {
            navigate(`/adhd/module/entry?taskId=${task._id}`);
        }
    };

    if (fetchError) {
        return (
            <div className="p-10 text-center text-red-600">
                <h2 className="text-2xl font-bold mb-2">Error Loading Dashboard</h2>
                <p>{fetchError}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Retry</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.name || 'Student'}! Here are your tasks.</p>
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
                    <div className="flex justify-center items-center h-64">
                        <div className="text-xl text-gray-500 animate-pulse">Loading assignments...</div>
                    </div>
                ) : tasks.length > 0 ? (
                    <div className="grid gap-6">
                        {tasks.map(task => {
                            if (!task) return null;
                            const isCompleted = task.status === 'Completed';
                            return (
                                <div key={task._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {task.title || "Untitled Task"}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-1">
                                                Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {task.status || 'Pending'}
                                        </span>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-gray-600 line-clamp-3">
                                            {Array.isArray(task.content) ? task.content.join(' ') : (task.description || "No description provided.")}
                                        </p>
                                        {task.attachmentUrl && (
                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center gap-3">
                                                <div className="p-2 bg-white rounded shadow-sm">
                                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <a
                                                    href={`http://localhost:5000${task.attachmentUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-blue-600 hover:underline"
                                                >
                                                    View Attachment
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleStartTask(task)}
                                        disabled={isCompleted}
                                        className={`w-full py-2 px-4 rounded-lg transition font-medium flex items-center justify-center gap-2 ${isCompleted ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-gray-800'
                                            }`}
                                    >
                                        {isCompleted ? 'Completed' : 'Start Task'}
                                        {!isCompleted && (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4 text-gray-300">🎉</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Pending Assignments!</h3>
                        <p className="text-gray-600">You're all caught up. Check back later for new tasks.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
