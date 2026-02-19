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
                const storedUser = localStorage.getItem('user');
                const userData = storedUser ? JSON.parse(storedUser) : null;
                const token = userData?.token || localStorage.getItem('lexfix_token') || localStorage.getItem('token');

                const studentId = user?.id || user?._id || user?.data?.id || user?.data?._id;
                console.log("StudentDashboard Fetching for ID:", studentId);

                if (!token || !studentId) {
                    console.warn("Missing token or studentId", { token: !!token, studentId });
                    setLoading(false);
                    return;
                }

                const headers = { Authorization: `Bearer ${token}` };

                // 1. Fetch from /api/tasks (Original System)
                const tasksRes = await axios.get(`http://localhost:5000/api/tasks/student/${studentId}`, { headers })
                    .then(r => r.data)
                    .catch(e => ({ success: false, data: [] }));

                // 2. Fetch from /api/assignments (ADHD Learning System)
                const adhdAssignRes = await axios.get(`http://localhost:5000/api/assignments/my-assignments`, { headers })
                    .then(r => r.data)
                    .catch(() => []);

                // 3. Fetch Progress/Submissions to determine completion
                const [adhdProgress, submissions] = await Promise.all([
                    axios.get(`http://localhost:5000/api/adhd/progress/${studentId}`, { headers })
                        .then(r => r.data?.data?.sessions || [])
                        .catch(() => []),
                    axios.get(`http://localhost:5000/api/submissions/my-submissions`, { headers })
                        .then(r => r.data || [])
                        .catch(() => [])
                ]);

                let combinedTasks = [];

                // Normalize tasksRes (Port 5000)
                if (tasksRes?.data && Array.isArray(tasksRes.data)) {
                    combinedTasks = tasksRes.data.map(t => {
                        const sess = adhdProgress.find(s => s.taskId?._id === t._id || s.taskId === t._id);
                        return {
                            ...t,
                            type: 'task',
                            status: sess ? sess.completionStatus : (t.status === 'Published' ? 'Pending' : t.status),
                            backend: 5000
                        };
                    });
                }

                // Normalize assignments (Port 5000)
                const allAssignments = [
                    ...(Array.isArray(adhdAssignRes) ? adhdAssignRes : (adhdAssignRes.data || [])).map(a => ({ ...a, backend: 5000 }))
                ];

                const normalizedAssignments = allAssignments.map(a => {
                    // Robust ID finding
                    const sub = submissions.find(s => {
                        const sAssignId = String(s.assignment?._id || s.assignment || s.assignmentId || '');
                        const aId = String(a._id || '');
                        return sAssignId === aId && sAssignId !== '';
                    });

                    let status = 'Pending';

                    // If ADHD backend already calculated it, use that as primary source
                    if (a.submissionStatus === 'completed') {
                        status = 'Completed';
                    } else if (a.submissionStatus === 'in-progress') {
                        status = 'In Progress';
                    } else if (sub) {
                        // Fallback to submission search
                        status = sub.status === 'completed' ? 'Completed' : 'In Progress';
                    }

                    return {
                        ...a,
                        type: 'assignment',
                        status: status
                    };
                });

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

    const pendingTasks = tasks.filter(t => t.status !== 'Completed');
    const completedTasks = tasks.filter(t => t.status === 'Completed');

    const TaskCard = ({ task }) => {
        const isCompleted = task.status === 'Completed';
        return (
            <div key={task._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition group">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {task.title || "Untitled Task"}
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">
                            {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'Recommended Activity'}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-800'}`}>
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
                    className={`w-full py-2 px-4 rounded-lg transition font-medium flex items-center justify-center gap-2 ${isCompleted
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                >
                    {isCompleted ? 'Retake Session' : 'Start Task'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        );
    };

    return (
        <main className="min-h-screen bg-[#f8fafc] pb-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Dashboard Welcome */}
                <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                        Student Dashboard
                    </h1>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Welcome back, {user?.name || 'Student'}
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col justify-center items-center h-80 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <div className="text-lg text-slate-500 font-medium animate-pulse">Syncing your learning progress...</div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Pending Section */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Clock className="w-5 h-5 text-amber-600" />
                                </div>
                                Pending Assignments
                                <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-800 text-xs rounded-full">
                                    {pendingTasks.length}
                                </span>
                            </h2>

                            {pendingTasks.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pendingTasks.map(task => <TaskCard key={task._id} task={task} />)}
                                </div>
                            ) : (
                                <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="text-7xl mb-6">✨</div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">All Caught Up!</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto">
                                            No pending tasks found. Great job on staying on top of your learning!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Completed Section */}
                        {completedTasks.length > 0 && (
                            <section className="opacity-90 hover:opacity-100 transition-opacity duration-300">
                                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    Completed History
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {completedTasks.map(task => <TaskCard key={task._id} task={task} />)}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slide-in-from-top { from { transform: translateY(-1rem); } to { transform: translateY(0); } }
                .animate-in { animation-name: fade-in, slide-in-from-top; animation-fill-mode: forwards; }
            `}</style>
        </main>
    );
};

export default StudentDashboard;
