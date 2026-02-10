// pages/student/StudentTaskList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './StudentTaskList.css';

export default function StudentTaskList() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const [stats, setStats] = useState({
        pending: 0,
        completed: 0,
        totalSentences: 0,
        totalMinutes: 0,
        totalBreaks: 0
    });
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignments();
        fetchSubmissions();
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/assignments/my-assignments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/submissions/my-submissions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setSubmissions(data || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    const getStatusBadge = (dueDate) => {
        if (!dueDate) return <span className="badge neutral">No Due Date</span>;
        const due = new Date(dueDate);
        const now = new Date();
        const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) return <span className="badge overdue">Overdue</span>;
        if (daysLeft <= 2) return <span className="badge urgent">Due Soon</span>;
        return <span className="badge active">Active</span>;
    };

    const startAssignment = (assignment) => {
        navigate(`/student/read/${assignment._id}`);
    };

    const pendingAssignments = assignments.filter(a => a.submissionStatus !== 'completed');
    const completedAssignments = assignments.filter(a => a.submissionStatus === 'completed');

    useEffect(() => {
        const totalSentences = assignments.reduce((sum, a) => sum + (a.sentences?.length || 0), 0);
        const totalMinutes = submissions.reduce((sum, s) => sum + Math.floor((s.timeSpent || 0) / 60), 0);
        const totalBreaks = submissions.reduce((sum, s) => sum + (s.breaksTaken || 0), 0);
        setStats({
            pending: pendingAssignments.length,
            completed: completedAssignments.length,
            totalSentences,
            totalMinutes,
            totalBreaks
        });
    }, [assignments, submissions]);

    return (
        <div className="student-task-list">
            <header className="task-header">
                <div>
                    <h1>👋 Hi, {user?.name}!</h1>
                    <p>Your {user?.disability?.toUpperCase()} learning hub</p>
                </div>
            </header>

            <div className="task-container">
                <div className="stats-bar">
                    <div className="stat-card">
                        <div className="stat-icon">🕒</div>
                        <div className="stat-info">
                            <h3>Pending</h3>
                            <p className="stat-number">{stats.pending}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>Completed</h3>
                            <p className="stat-number">{stats.completed}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-info">
                            <h3>Sentences</h3>
                            <p className="stat-number">{stats.totalSentences}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-info">
                            <h3>Time Spent</h3>
                            <p className="stat-number">{stats.totalMinutes}m</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🎮</div>
                        <div className="stat-info">
                            <h3>Breaks</h3>
                            <p className="stat-number">{stats.totalBreaks}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="loading">Syncing your progress...</div>
                ) : (
                    <>
                        {/* Pending Assignments */}
                        <section className="task-section">
                            <h2 className="section-title">🕒 Pending Tasks</h2>
                            {pendingAssignments.length === 0 ? (
                                <div className="no-assignments mini">
                                    <p>🎉 All caught up! No pending tasks.</p>
                                    {completedAssignments.length > 0 && (
                                        <p style={{ marginTop: '8px' }}>You can review completed activities below.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="task-grid">
                                    {pendingAssignments.map(assignment => (
                                        <div key={assignment._id} className="task-card">
                                            <div className="card-header">
                                                <h3>{assignment.title}</h3>
                                                {getStatusBadge(assignment.dueDate)}
                                            </div>
                                            <p className="task-description">{assignment.description || 'No description provided'}</p>
                                            <div className="card-footer">
                                                <div className="task-info">
                                                    <span>📚 {assignment.sentences?.length || 0} sentences</span>
                                                </div>
                                                <button className="start-btn" onClick={() => startAssignment(assignment)}>
                                                    {assignment.submissionStatus === 'in-progress' ? 'Continue →' : 'Start Reading →'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Completed Assignments */}
                        {completedAssignments.length > 0 && (
                            <section className="task-section completed-section">
                                <h2 className="section-title">✅ Completed Activities</h2>
                                <div className="task-grid">
                                    {completedAssignments.map(assignment => (
                                        <div key={assignment._id} className="task-card completed">
                                            <div className="card-header">
                                                <h3>{assignment.title}</h3>
                                                <span className="badge completed-badge">Completed ✓</span>
                                            </div>
                                            <p className="task-description">{assignment.description || 'No description provided'}</p>
                                            <div className="card-footer">
                                                <div className="task-info">
                                                    <span>📅 Finished: {assignment.completedAt ? new Date(assignment.completedAt).toLocaleDateString() : 'Recently'}</span>
                                                    <span>⏱️ {Math.floor((submissions.find(s => s.assignment?._id === assignment._id)?.timeSpent || 0) / 60)} min</span>
                                                    <span>🎮 Breaks: {submissions.find(s => s.assignment?._id === assignment._id)?.breaksTaken || 0}</span>
                                                </div>
                                                <button className="start-btn review-btn" onClick={() => startAssignment(assignment)}>
                                                    Read Again
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
