import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = ({ user }) => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const userData = storedUser ? JSON.parse(storedUser) : null;
                const token = userData?.token || localStorage.getItem('lexfix_token') || localStorage.getItem('token');
                const studentId = user?.id || user?._id;

                if (!token || !studentId) {
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
                    tasksPromise.catch(e => ({ data: { success: false, data: [] } })),
                    assignmentsPromise.catch(e => ({ data: [] }))
                ]);

                let combinedTasks = [];

                if (tasksRes.data.success) {
                    combinedTasks = [...tasksRes.data.data];
                }

                const assignments = Array.isArray(assignRes.data) ? assignRes.data : (assignRes.data.data || []);
                const normalizedAssignments = assignments.map(a => ({
                    _id: a._id,
                    title: a.title,
                    description: a.description || "In-depth learning material",
                    status: (a.status === 'active' ? 'Pending' : a.status) || 'Pending',
                    dueDate: a.dueDate,
                    type: 'assignment',
                    contentCount: a.sentences?.length || a.content?.length || 0
                }));

                console.log("ADHD StudentDashboard Combined Tasks:", [...combinedTasks, ...normalizedAssignments]);
                setTasks([...combinedTasks, ...normalizedAssignments]);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTasks();
        }
    }, [user]);

    const handleStartTask = (task) => {
        if (task.type === 'assignment') {
            navigate(`/student/read/${task._id}`);
        } else {
            navigate(`/adhd/module/entry?taskId=${task._id}`);
        }
    };

    return (
        <div className="student-dashboard">
            <div className="dashboard-header-card">
                <h2>🎓 My Learning Assignments</h2>
                <p>Select a task below to begin your focused ADHD learning session.</p>
            </div>

            <div className="dashboard-grid single-column">
                {loading ? (
                    <div className="loading-state">Loading assignments...</div>
                ) : tasks.length > 0 ? (
                    <div className="tasks-grid">
                        {tasks.map(task => (
                            <div key={task._id} className="task-card">
                                <div className="task-icon">📚</div>
                                <div className="task-content">
                                    <h3>{task.title}</h3>
                                    <div className="task-meta">
                                        <span className={`status-badge ${task.status === 'Completed' ? 'completed' : 'pending'}`}>
                                            {task.status}
                                        </span>
                                        <span className="task-date">
                                            Due: {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="task-desc">
                                        {(task.content?.length || 0)} sentences to master.
                                    </p>
                                    {task.attachmentUrl && (
                                        <div className="task-attachment mt-3 p-2 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center gap-2">
                                            <span className="text-blue-500">📎</span>
                                            <a
                                                href={`http://localhost:5000${task.attachmentUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                View Attached Resource
                                            </a>
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="start-btn"
                                    onClick={() => handleStartTask(task)}
                                    disabled={task.status === 'Completed'}
                                >
                                    {task.status === 'Completed' ? 'Review' : 'Start Session'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🎉</div>
                        <h3>No Pending Assignments!</h3>
                        <p>You're all caught up. Check back later for new tasks from your teacher.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
