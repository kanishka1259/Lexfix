import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Module4_Progress = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId');
    const sessionId = searchParams.get('sessionId');
    const [stats, setStats] = useState({
        focusScore: 85,
        readingSpeed: 'Normal',
        assertions: ['Good Focus', 'Steady Pace']
    });

    const handleFinish = async () => {
        try {
            if (sessionId) {
                const token = localStorage.getItem('token');
                await axios.post('http://localhost:5000/api/adhd/session/complete', {
                    sessionId,
                    moduleCompleted: 4
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            navigate(`/adhd/module/completion?taskId=${taskId}`);
        } catch (error) {
            console.error("Error saving progress", error);
            navigate(`/adhd/module/completion?taskId=${taskId}`);
        }
    };

    return (
        <div className="module-container">
            <div className="progress-dashboard">
                <div className="icon">📈</div>
                <h2>Session Analytics</h2>
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="label">Focus Score</span>
                        <span className="value high">{stats.focusScore}%</span>
                    </div>
                    <div className="stat-card">
                        <span className="label">Pace</span>
                        <span className="value">{stats.readingSpeed}</span>
                    </div>
                </div>

                <div className="feedback-section">
                    <h3>Insights</h3>
                    <ul>
                        {stats.assertions.map((note, i) => (
                            <li key={i}>✨ {note}</li>
                        ))}
                    </ul>
                </div>

                <button className="primary-btn" onClick={handleFinish}>
                    Complete Session
                </button>
            </div>

            <style jsx>{`
                .module-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: #F0FFF4;
                }
                .progress-dashboard {
                    background: white;
                    padding: 50px;
                    border-radius: 20px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    width: 90%;
                    max-width: 600px;
                }
                .icon { font-size: 3rem; margin-bottom: 10px; }
                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin: 30px 0;
                }
                .stat-card {
                    background: #F7FAFC;
                    padding: 20px;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                }
                .label { color: #718096; font-size: 0.9rem; }
                .value { font-size: 2rem; font-weight: bold; color: #2D3748; }
                .value.high { color: #38A169; }
                .feedback-section { text-align: left; margin-bottom: 30px; }
                ul { list-style: none; padding: 0; }
                li { padding: 10px 0; border-bottom: 1px solid #EDF2F7; color: #4A5568; }
                .primary-btn {
                    width: 100%;
                    padding: 15px;
                    background: #38A169;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .primary-btn:hover { background: #2F855A; }
            `}</style>
        </div>
    );
};

export default Module4_Progress;
