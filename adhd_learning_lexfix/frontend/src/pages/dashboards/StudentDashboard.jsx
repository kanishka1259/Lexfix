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
                const token = localStorage.getItem('lexfix_token');
                if (!token) return;

                const response = await axios.get(`http://localhost:5001/api/tasks/student/${user._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // If API returns successfully
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
        // Navigate to the first module with the task ID
        navigate(`/module/entry?taskId=${taskId}`);
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
                                        {task.content.length} sentences to master.
                                    </p>
                                </div>
                                <button
                                    className="start-btn"
                                    onClick={() => handleStartTask(task._id)}
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
