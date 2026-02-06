import { useState, useEffect } from 'react';
import axios from 'axios';

const ParentDashboard = ({ user }) => {
    const [childStats, setChildStats] = useState(null);

    useEffect(() => {
        // Mock data fetch - essentially fetching progress for the linked child
        // In a real app, we'd fetch based on parent's ID
        const fetchStats = async () => {
            // Placeholder stats
            setChildStats({
                totalSessions: 12,
                completedTasks: 8,
                focusTime: 340, // minutes
                recentActivity: [
                    { id: 1, task: "History Lesson", status: "Completed", date: "2024-02-04" },
                    { id: 2, task: "Math Practice", status: "In Progress", date: "2024-02-03" }
                ]
            });
        };
        fetchStats();
    }, [user]);

    return (
        <div className="parent-dashboard">
            <div className="dashboard-header-card">
                <h2>👨‍👩‍👧‍👦 Parent Monitor</h2>
                <p>Track your child's learning progress and focus metrics.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Focus Time</h3>
                    <p className="stat-value">{childStats?.focusTime || 0} mins</p>
                </div>
                <div className="stat-card">
                    <h3>Tasks Completed</h3>
                    <p className="stat-value">{childStats?.completedTasks || 0}</p>
                </div>
                <div className="stat-card">
                    <h3>Sessions</h3>
                    <p className="stat-value">{childStats?.totalSessions || 0}</p>
                </div>
            </div>

            <div className="recent-activity-card">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                    {childStats?.recentActivity?.map(activity => (
                        <div key={activity.id} className="activity-item">
                            <span className="activity-name">{activity.task}</span>
                            <span className={`activity-status status-${activity.status.toLowerCase().replace(' ', '-')}`}>
                                {activity.status}
                            </span>
                            <span className="activity-date">{activity.date}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
