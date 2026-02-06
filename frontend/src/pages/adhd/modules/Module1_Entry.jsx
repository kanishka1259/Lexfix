import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

const Module1_Entry = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId');
    const { user } = useAppContext();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Simulate ADHD session initialization
        const timer = setTimeout(() => {
            setIsInitialized(true);
            console.log("ADHD Session Initialized for task:", taskId);
        }, 1500);
        return () => clearTimeout(timer);
    }, [taskId]);

    const handleStart = () => {
        navigate(`/adhd/module/content?taskId=${taskId}`);
    };

    return (
        <div className="module-container font-dyslexic full-screen-focus">
            <div className="entry-content-box animate-in">
                <div className="session-badge">🧠 ADHD Focus Mode</div>

                <header className="entry-header">
                    <h1>Ready to Focus?</h1>
                    <p>We've prepared your environment for maximum concentration.</p>
                </header>

                <div className="setup-status">
                    <div className={`status-item ${isInitialized ? 'done' : 'loading'}`}>
                        <span className="icon">{isInitialized ? '✓' : '●'}</span>
                        <span className="text">Optimizing UI for distractions</span>
                    </div>
                    <div className={`status-item ${isInitialized ? 'done' : 'loading'}`}>
                        <span className="icon">{isInitialized ? '✓' : '●'}</span>
                        <span className="text">Initializing Session Timer</span>
                    </div>
                    <div className={`status-item ${isInitialized ? 'done' : 'loading'}`}>
                        <span className="icon">{isInitialized ? '✓' : '●'}</span>
                        <span className="text">Ready to track focus metrics</span>
                    </div>
                </div>

                <div className="action-area">
                    {isInitialized ? (
                        <button className="primary-btn large-pulse" onClick={handleStart}>
                            Enter Distraction-Free Mode
                        </button>
                    ) : (
                        <div className="initializing-text">Setting up environment...</div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .full-screen-focus {
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background: #FAF7F2;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    overflow: hidden;
                }
                .entry-content-box {
                    background: white;
                    padding: 3rem;
                    border-radius: 2rem;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.05);
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                }
                .session-badge {
                    display: inline-block;
                    padding: 0.5rem 1.5rem;
                    background: #E1F5FE;
                    color: #01579B;
                    border-radius: 2rem;
                    font-weight: 700;
                    margin-bottom: 2rem;
                    font-size: 0.9rem;
                    letter-spacing: 0.05em;
                }
                h1 {
                    font-size: 2.5rem;
                    color: #1A202C;
                    margin-bottom: 1rem;
                }
                .setup-status {
                    margin: 2.5rem 0;
                    text-align: left;
                }
                .status-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1rem;
                    color: #718096;
                    transition: all 0.3s;
                }
                .status-item.done {
                    color: #48BB78;
                }
                .status-item.loading {
                    animation: pulse 1.5s infinite;
                }
                .icon {
                    font-weight: bold;
                }
                .large-pulse {
                    width: 100%;
                    padding: 1.25rem;
                    font-size: 1.25rem;
                    animation: buttonPulse 2s infinite;
                }
                @keyframes buttonPulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
                    70% { transform: scale(1.02); box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
                }
                .animate-in {
                    animation: fadeInUp 0.8s ease-out;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 1; }
                    100% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default Module1_Entry;
