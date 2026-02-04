// pages/StudentDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

export default function StudentDashboard() {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/tasks', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setTasks(data);
    };

    const startTask = (task) => {
        // Store task data and navigate to ADHD session
        localStorage.setItem('currentTask', JSON.stringify(task));
        navigate('/session');
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>👨‍🎓 Student Dashboard</h1>
                    <p>Welcome, {user.name}!</p>
                </div>
                <button onClick={logout} className="btn-logout">Logout</button>
            </header>

            <div className="dashboard-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-info">
                            <h3>Assigned Tasks</h3>
                            <p className="stat-number">{tasks.length}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>Completed</h3>
                            <p className="stat-number">0</p>
                        </div>
                    </div>
                </div>

                <div className="tasks-section">
                    <h2>Your Assigned Tasks</h2>
                    {tasks.length === 0 ? (
                        <div className="empty-state">
                            <p>No tasks assigned yet. Check back later!</p>
                        </div>
                    ) : (
                        <div className="tasks-list">
                            {tasks.map((task) => (
                                <div key={task._id} className="task-card">
                                    <div className="task-header">
                                        <h3>{task.title}</h3>
                                        <span className={`badge badge-${task.difficulty.toLowerCase()}`}>
                                            {task.difficulty}
                                        </span>
                                    </div>
                                    <p className="task-description">{task.description}</p>
                                    <div className="task-meta">
                                        <span>⏱ {task.estimatedTime} min</span>
                                        <span>📝 {task.content.length} sentences</span>
                                        <span>👨‍🏫 By {task.createdBy?.name}</span>
                                    </div>
                                    <button
                                        onClick={() => startTask(task)}
                                        className="btn-primary"
                                    >
                                        🚀 Start ADHD Focus Mode
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
