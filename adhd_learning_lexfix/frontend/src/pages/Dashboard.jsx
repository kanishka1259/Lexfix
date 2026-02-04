// pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-page">
            <h1>📊 Your Dashboard</h1>
            <div className="stats-container">
                <div className="stat-card">
                    <h3>Sessions Completed</h3>
                    <p className="stat-value">0</p>
                </div>
                <div className="stat-card">
                    <h3>Total Time</h3>
                    <p className="stat-value">0 min</p>
                </div>
                <div className="stat-card">
                    <h3>Sentences Viewed</h3>
                    <p className="stat-value">0</p>
                </div>
            </div>
            <button className="adhd-btn" onClick={() => navigate('/')}>
                Start New Session
            </button>
        </div>
    );
}
