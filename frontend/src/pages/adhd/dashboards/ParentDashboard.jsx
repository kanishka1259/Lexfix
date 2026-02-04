import { useState, useEffect } from 'react';
import axios from 'axios';

const ParentDashboard = ({ user }) => {
    const [childrenProgress, setChildrenProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChildrenProgress = async () => {
            try {
                const token = localStorage.getItem('lexfix_token');
                // 1. Get linked children
                const childrenRes = await axios.get('/api/auth/children', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (childrenRes.data.success) {
                    const children = childrenRes.data.data;

                    // 2. For each child, get their tasks/sessions
                    const progressPromises = children.map(async (child) => {
                        const taskRes = await axios.get(`/api/tasks/student/${child._id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        return {
                            ...child,
                            tasks: taskRes.data.success ? taskRes.data.data : []
                        };
                    });

                    const fullData = await Promise.all(progressPromises);
                    setChildrenProgress(fullData);
                }
            } catch (e) {
                console.error("Parent fetch error", e);
            } finally {
                setLoading(false);
            }
        }
        fetchChildrenProgress();
    }, [user]);

    return (
        <div className="parent-dashboard">
            <div className="dashboard-header-card">
                <h2>👨‍👩‍👧‍👦 Parent Monitor</h2>
                <p>Track your child's learning progress and focus metrics across modules.</p>
            </div>

            {loading ? <p>Loading data...</p> : (
                <div className="children-list">
                    {childrenProgress.length > 0 ? childrenProgress.map(child => (
                        <div key={child._id} className="child-progress-card sidebar-card" style={{ marginBottom: '20px' }}>
                            <h3>Progress for {child.name}</h3>
                            <div className="stats-grid" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                                <div className="stat-card">
                                    <h4>Assignments</h4>
                                    <p className="stat-value">{child.tasks.length}</p>
                                </div>
                            </div>

                            <h4>Recent Activity</h4>
                            <div className="activity-list">
                                {child.tasks.map(task => (
                                    <div key={task._id} className="activity-item">
                                        <span className="activity-name">{task.title}</span>
                                        <span className={`status-badge ${task.status === 'Published' ? 'pending' : 'completed'}`}>
                                            {task.status}
                                        </span>
                                        <span className="activity-date">{new Date(task.createdAt).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )) : (
                        <div className="empty-state">
                            <p>No linked children found. Please ensure your child is registered with the email you provided.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ParentDashboard;
