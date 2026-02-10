import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';
import axios from 'axios';
import { useAppContext } from '@/context/AppContext';

const Module5_Completion = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const taskId = searchParams.get('taskId');
    const { user } = useAppContext();
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(!!sessionId);

    useEffect(() => {
        const fetchSessionStats = async () => {
            if (!sessionId) return;
            try {
                const storedUser = localStorage.getItem('user');
                const userData = storedUser ? JSON.parse(storedUser) : null;
                const token = userData?.token || localStorage.getItem('lexfix_token');

                const response = await axios.get(`http://localhost:5000/api/adhd/session/${sessionId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setSessionData(response.data);
                }
            } catch (error) {
                console.error("Error fetching session stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessionStats();

        // Celebratory confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#10B981', '#3B82F6']
        });
    }, [sessionId]);

    const handleExit = () => {
        navigate('/dashboard');
    };

    const handleRetake = () => {
        const tId = taskId || sessionData?.data?.taskId?._id || sessionData?.data?.taskId;
        if (tId) {
            navigate(`/adhd/module/entry?taskId=${tId}`);
        } else {
            navigate('/dashboard');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        return `${mins}m ${Math.floor(seconds % 60)}s`;
    };

    // Calculate a "Focus Score" based on breaks and time
    const calculateScore = () => {
        if (!sessionData?.stats) return 100;
        const { breaksTaken } = sessionData.stats;
        // Simple algorithm: Start at 100, deduct 5 per break. Min 50.
        const score = Math.max(50, 100 - (breaksTaken * 10));
        return score;
    };

    if (loading) {
        return (
            <div className="module-container study-5">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-24 w-24 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
                </div>
            </div>
        );
    }

    const stats = sessionData?.stats || { totalTime: 0, breaksTaken: 0, averageTimePerSentence: 0 };
    const focusScore = calculateScore();

    return (
        <div className="module-container study-5">
            <div className="completion-card animate-pop glass-panel">
                <div className="header-section">
                    <div className="trophy-icon">{focusScore >= 90 ? '🏆' : '🎓'}</div>
                    <h1>Session Report</h1>
                    <p className="subtitle">Outstanding focus! Here is your performance summary.</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-box">
                        <span className="label">Focus Score</span>
                        <div className="value-ring" style={{ borderColor: focusScore >= 80 ? '#10B981' : '#F59E0B' }}>
                            {focusScore}
                        </div>
                    </div>

                    <div className="stat-box">
                        <span className="label">Total Focus Time</span>
                        <span className="value">{formatTime(stats.totalTime)}</span>
                    </div>

                    <div className="stat-box">
                        <span className="label">Distractions</span>
                        <span className="value">{stats.breaksTaken} <span className="unit">breaks</span></span>
                    </div>

                    <div className="stat-box">
                        <span className="label">Avg. Pace</span>
                        <span className="value">{Math.round(stats.averageTimePerSentence)}s <span className="unit">/ sentence</span></span>
                    </div>
                </div>

                <div className="action-btns">
                    <button className="primary-btn wide" onClick={handleExit}>Back to Dashboard</button>
                    <button className="secondary-btn" onClick={handleRetake}>
                        <span className="icon">↺</span> Retake Lesson
                    </button>
                </div>
            </div>

            <style jsx>{`
                .study-5 { 
                    height: 100vh; 
                    background: linear-gradient(135deg, #FAF7F2 0%, #E2E8F0 100%); 
                    display: flex; 
                    justify-content: center; 
                    align-items: center; 
                    padding: 2rem; 
                }
                .glass-panel {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    padding: 4rem 3rem;
                    border-radius: 3rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
                    max-width: 600px;
                    width: 100%;
                    text-align: center;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                }
                .trophy-icon { font-size: 5rem; margin-bottom: 1.5rem; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1)); }
                h1 { font-size: 3rem; color: #1E293B; margin-bottom: 0.5rem; letter-spacing: -0.02em; font-weight: 800; }
                .subtitle { font-size: 1.1rem; color: #64748B; margin-bottom: 3rem; }
                
                .stats-grid { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 1.5rem; 
                    margin-bottom: 3rem; 
                }
                .stat-box { 
                    background: white; 
                    padding: 1.5rem; 
                    border-radius: 1.5rem; 
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center;
                    border: 1px solid #F1F5F9;
                    transition: transform 0.2s;
                }
                .stat-box:hover { transform: translateY(-5px); }
                .label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #94A3B8; font-weight: 700; margin-bottom: 0.5rem; }
                .value { font-size: 1.5rem; font-weight: 800; color: #334155; }
                .unit { font-size: 0.9rem; color: #94A3B8; font-weight: 600; }
                
                .value-ring {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    border: 4px solid #10B981;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #1E293B;
                    background: #F8FAFC;
                }

                .action-btns { display: flex; flex-direction: column; gap: 1rem; }
                .primary-btn.wide { 
                    padding: 1.25rem; 
                    font-size: 1.1rem; 
                    background: #0F172A; 
                    color: white; 
                    border-radius: 1rem;
                    font-weight: 700;
                    transition: all 0.2s;
                }
                .primary-btn.wide:hover { background: #1E293B; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                
                .secondary-btn { 
                    background: white; 
                    border: 2px solid #E2E8F0; 
                    padding: 1rem; 
                    border-radius: 1rem; 
                    font-weight: 700; 
                    color: #64748B; 
                    cursor: pointer; 
                    font-size: 1rem; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    transition: all 0.2s;
                }
                .secondary-btn:hover { border-color: #CBD5E1; color: #475569; background: #F8FAFC; }
                .secondary-btn .icon { font-size: 1.2rem; }
                
                @keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
                .animate-pop { animation: pop 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
            `}</style>
        </div>
    );
};

export default Module5_Completion;
