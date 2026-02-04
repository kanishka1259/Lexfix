// pages/ParentDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

export default function ParentDashboard() {
    const { user, logout } = useAuth();
    const [children, setChildren] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('token');

        // Fetch tasks assigned to children
        const tasksResponse = await fetch('http://localhost:5000/api/tasks', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);

        // Fetch sessions
        const sessionsResponse = await fetch('http://localhost:5000/api/sessions', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData);
    };

    const totalTime = sessions.reduce((acc, session) => acc + (session.totalTime || 0), 0);
    const totalSentences = sessions.reduce((acc, session) => acc + (session.sentencesViewed || 0), 0);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>👨‍👩‍👧 Parent Dashboard</h1>
                    <p>Welcome, {user.name}!</p>
                </div>
                <button onClick={logout} className="btn-logout">Logout</button>
            </header>

            <div className="dashboard-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-info">
                            <h3>Active Tasks</h3>
                            <p className="stat-number">{tasks.length}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏱</div>
                        <div className="stat-info">
                            <h3>Total Study Time</h3>
                            <p className="stat-number">{Math.floor(totalTime / 60)} min</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📖</div>
                        <div className="stat-info">
                            <h3>Sentences Viewed</h3>
                            <p className="stat-number">{totalSentences}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🎯</div>
                        <div className="stat-info">
                            <h3>Sessions Completed</h3>
                            <p className="stat-number">{sessions.length}</p>
                        </div>
                    </div>
                </div>

                <div className="monitoring-section">
                    <h2>📊 Child's Activity</h2>

                    <div className="activity-card">
                        <h3>Recent Sessions</h3>
                        {sessions.length === 0 ? (
                            <p className="empty-state">No sessions yet</p>
                        ) : (
                            <div className="sessions-list">
                                {sessions.slice(0, 5).map((session) => (
                                    <div key={session._id} className="session-item">
                                        <div className="session-info">
                                            <span className="session-date">
                                                {new Date(session.startTime).toLocaleDateString()}
                                            </span>
                                            <span className="session-time">
                                                ⏱ {Math.floor(session.totalTime / 60)} min
                                            </span>
                                            <span className="session-sentences">
                                                📝 {session.sentencesViewed} sentences
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="activity-card">
                        <h3>Assigned Tasks</h3>
                        {tasks.length === 0 ? (
                            <p className="empty-state">No tasks assigned</p>
                        ) : (
                            <div className="tasks-list">
                                {tasks.map((task) => (
                                    <div key={task._id} className="task-card-small">
                                        <h4>{task.title}</h4>
                                        <div className="task-meta">
                                            <span>👨‍🏫 {task.createdBy?.name}</span>
                                            <span className={`badge badge-${task.difficulty.toLowerCase()}`}>
                                                {task.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
