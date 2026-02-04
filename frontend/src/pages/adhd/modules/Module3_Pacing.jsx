import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Module3_Pacing = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleContinue = () => {
        navigate(`/adhd/module/progress?taskId=${taskId}`);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="module-container">
            <div className="timer-card">
                <div className="icon">⏱️</div>
                <h2>Pacing Checkpoint</h2>
                <p>Take a moment to process what you just read. Deep breath.</p>

                <div className="time-display">
                    {formatTime(timeLeft)}
                </div>

                <div className="controls">
                    <button className="secondary-btn" onClick={() => setIsActive(!isActive)}>
                        {isActive ? 'Pause Timer' : 'Resume Timer'}
                    </button>
                    <button className="primary-btn" onClick={handleContinue}>
                        Continue Learning
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .module-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: #EBF8FF;
                }
                .timer-card {
                    background: white;
                    padding: 50px;
                    border-radius: 20px;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    width: 90%;
                    max-width: 500px;
                }
                .icon {
                    font-size: 4rem;
                    margin-bottom: 20px;
                }
                .time-display {
                    font-size: 5rem;
                    font-weight: 700;
                    color: #3182CE;
                    margin: 20px 0;
                    font-variant-numeric: tabular-nums;
                }
                .controls {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                .primary-btn {
                    padding: 12px 24px;
                    background: #3182CE;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .secondary-btn {
                    padding: 12px 24px;
                    background: #E2E8F0;
                    color: #2D3748;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }
            `}} />
        </div>
    );
};

export default Module3_Pacing;
