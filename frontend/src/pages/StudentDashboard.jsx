import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { BookOpen, CheckCircle, Clock, PlayCircle } from 'lucide-react';

const StudentDashboard = () => {
    const { user, logout } = useAppContext();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('lexfix_token');
                if (!token || !user) return;

                const response = await axios.get(`http://localhost:5001/api/tasks/student/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setTasks(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchTasks();
        }
    }, [user]);

    const handleStartTask = (taskId) => {
        navigate(`/adhd/module/entry?taskId=${taskId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center mb-10 max-w-6xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.name || 'Student'}! Here are your assignments.</p>
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
                        <div className="text-xl text-gray-500">Loading assignments...</div>
                    </div>
                ) : tasks.length > 0 ? (
                    <div className="grid gap-6">
                        {tasks.map(task => (
                            <div key={task._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition hover:shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                                            <BookOpen size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                                            <span className={`text-xs px-2 py-1 rounded font-medium ${task.status === 'Completed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {task.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center text-gray-500 text-sm mb-1">
                                            <Clock size={16} className="mr-1" />
                                            <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <p className="text-gray-600">
                                        {task.description || `${task.content?.length || 0} sentences to master.`}
                                    </p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleStartTask(task._id)}
                                        disabled={task.status === 'Completed'}
                                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${task.status === 'Completed'
                                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {task.status === 'Completed' ? (
                                            <>
                                                <CheckCircle size={18} /> Completed
                                            </>
                                        ) : (
                                            <>
                                                <PlayCircle size={18} /> Start Session
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Pending Assignments!</h3>
                        <p className="text-gray-600">You're all caught up. Check back later for new tasks.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
