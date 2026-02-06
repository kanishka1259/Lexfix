import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Module3_Pacing = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId');

    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [showBreak, setShowBreak] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive && !showBreak) {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, showBreak]);

    // Break reminder every 45 seconds for study purposes
    useEffect(() => {
        if (timer > 0 && timer % 45 === 0) {
            setShowBreak(true);
        }
    }, [timer]);

    const handleResume = () => {
        setShowBreak(false);
    };

    const handleComplete = () => {
        navigate(`/adhd/module/progress?taskId=${taskId}&time=${timer}`);
    };

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    return (
        <div className="module-container font-dyslexic study-3">
            <header className="fixed-timer">
                <div className="timer-pill">
                    <span className="dot"></span>
                    <span className="time">{formatTime(timer)}</span>
                </div>
            </header>

            <main className="pacing-center">
                {showBreak ? (
                    <div className="break-overlay animate-pop">
                        <div className="icon">🧘</div>
                        <h2>Time for a Focus Reset</h2>
                        <p>Look away from the screen for 10 seconds. Breathe in... Breathe out...</p>
                        <button className="primary-btn" onClick={handleResume}>I'm back and focused</button>
                    </div>
                ) : (
                    <div className="pacing-status animate-in">
                        <div className="pulse-ring"></div>
                        <h3>Pacing is Active</h3>
                        <p>We are tracking your time per sentence to help identify where you need more support.</p>
                        <div className="metrics-row">
                            <div className="mini-stat">
                                <strong>4.8s</strong>
                                <span>Recent Pace</span>
                            </div>
                            <div className="mini-stat">
                                <strong>Good</strong>
                                <span>Stability</span>
                            </div>
                        </div>
                        <button className="secondary-btn" onClick={handleComplete}>See My Focus Results →</button>
                    </div>
                )}
            </main>

            <style jsx>{`
                .study-3 { height: 100vh; background: #FAF7F2; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .fixed-timer { position: fixed; top: 2rem; }
                .timer-pill { background: white; padding: 0.8rem 2rem; border-radius: 3rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .dot { width: 10px; height: 10px; background: #F59E0B; border-radius: 50%; animation: pulse 1s infinite; }
                .time { font-size: 2rem; font-weight: 800; color: #1A202C; font-variant-numeric: tabular-nums; }
                
                .break-overlay, .pacing-status { background: white; padding: 4rem; border-radius: 2.5rem; text-align: center; max-width: 600px; width: 90%; box-shadow: 0 20px 50px rgba(0,0,0,0.05); }
                .icon { font-size: 4rem; margin-bottom: 2rem; }
                h2, h3 { font-size: 2.5rem; color: #1A202C; margin-bottom: 1rem; }
                
                .pulse-ring { width: 60px; height: 60px; border: 4px solid #FBCFE8; border-radius: 50%; margin: 0 auto 2rem; position: relative; }
                .pulse-ring::after { content: ''; position: absolute; top: -4px; left: -4px; right: -4px; bottom: -4px; border: 4px solid #F59E0B; border-radius: 50%; animation: ringScale 2s infinite; }
                
                .metrics-row { display: flex; justify-content: center; gap: 3rem; margin: 3rem 0; }
                .mini-stat { display: flex; flex-direction: column; }
                .mini-stat strong { font-size: 1.5rem; color: #1A202C; }
                .mini-stat span { color: #718096; font-size: 0.8rem; text-transform: uppercase; font-weight: 700; }
                
                .secondary-btn { margin-top: 2rem; background: none; border: none; color: #F59E0B; font-weight: 800; font-size: 1.2rem; cursor: pointer; }
                
                @keyframes ringScale { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
            `}</style>
        </div>
    );
};

export default Module3_Pacing;
