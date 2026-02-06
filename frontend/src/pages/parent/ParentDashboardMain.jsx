// pages/parent/ParentDashboardMain.jsx
import { useState, useEffect } from 'react';
import './ParentDashboardMain.css';

export default function ParentDashboardMain() {
    const [children, setChildren] = useState([]);
    const [childEmail, setChildEmail] = useState('');
    const [selectedChild, setSelectedChild] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/parent/children', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setChildren(data);
        } catch (error) {
            console.error('Error fetching children:', error);
        }
    };

    const handleLinkChild = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/parent/link-child', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ childEmail })
            });

            if (response.ok) {
                setChildEmail('');
                fetchChildren();
            }
        } catch (error) {
            console.error('Error linking child:', error);
        } finally {
            setLoading(false);
        }
    };

    const viewChildProgress = async (child) => {
        setSelectedChild(child);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/parent/child/${child._id}/progress`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setProgress(data);
        } catch (error) {
            console.error('Error fetching progress:', error);
        }
    };

    return (
        <div className="parent-dashboard-main">
            <header className="parent-header">
                <h1>👨‍👩‍👧 Parent Dashboard</h1>
                <p>Monitor your child's learning progress</p>
            </header>

            <div className="dashboard-content">
                <div className="link-child-section">
                    <h2>Link a Child</h2>
                    <form onSubmit={handleLinkChild} className="link-form">
                        <input
                            type="email"
                            placeholder="Enter child's email"
                            value={childEmail}
                            onChange={(e) => setChildEmail(e.target.value)}
                            required
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Linking...' : '+ Link Child'}
                        </button>
                    </form>
                </div>

                <div className="children-list">
                    <h2>Your Children</h2>
                    {children.length === 0 ? (
                        <p className="no-data">No children linked yet. Add one above!</p>
                    ) : (
                        <div className="children-grid">
                            {children.map(child => (
                                <div key={child._id} className="child-card">
                                    <h3>{child.name}</h3>
                                    <p>{child.email}</p>
                                    <span className="disability-badge">
                                        {child.disability?.toUpperCase()}
                                    </span>
                                    <button onClick={() => viewChildProgress(child)}>
                                        View Progress
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {selectedChild && progress && (
                    <div className="progress-section">
                        <h2>Progress for {selectedChild.name}</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>{progress.statistics.totalAssignments}</h3>
                                <p>Total Assignments</p>
                            </div>
                            <div className="stat-card completed">
                                <h3>{progress.statistics.completedAssignments}</h3>
                                <p>Completed</p>
                            </div>
                            <div className="stat-card">
                                <h3>{Math.floor(progress.statistics.totalTimeSpent / 60)}m</h3>
                                <p>Time Spent</p>
                            </div>
                            <div className="stat-card">
                                <h3>{progress.statistics.totalDistractions}</h3>
                                <p>Break Times</p>
                            </div>
                        </div>

                        <h3 className="submissions-header">Recent Assignments</h3>
                        <div className="submissions-list">
                            {progress.submissions.map(submission => (
                                <div key={submission._id} className="submission-card">
                                    <h4>{submission.assignment.title}</h4>
                                    <div className="submission-meta">
                                        <span className={`status ${submission.status}`}>
                                            {submission.status}
                                        </span>
                                        <span>{submission.completedSentences.length} sentences read</span>
                                        <span>{Math.floor(submission.timeSpent / 60)} min</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
