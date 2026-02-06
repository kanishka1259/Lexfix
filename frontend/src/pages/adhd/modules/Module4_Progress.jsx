import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Module4_Progress = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId');
    const timeSpent = searchParams.get('time') || 45;

    const handleNext = () => {
        navigate(`/adhd/module/completion?taskId=${taskId}`);
    };

    return (
        <div className="module-container font-dyslexic study-4">
            <header className="progress-header">
                <h1>Focus Summary</h1>
                <p>Visible progress drives focus stability. Here's how you did today.</p>
            </header>

            <main className="metrics-dashboard">
                <div className="card-row">
                    <div className="metric animate-pop" style={{ animationDelay: '0s' }}>
                        <div className="visual"><span className="val">100%</span></div>
                        <label>Task Completed</label>
                    </div>
                    <div className="metric animate-pop" style={{ animationDelay: '0.1s' }}>
                        <div className="visual"><span className="val">{timeSpent}s</span></div>
                        <label>Pure Focus Time</label>
                    </div>
                    <div className="metric animate-pop" style={{ animationDelay: '0.2s' }}>
                        <div className="visual"><span className="val">High</span></div>
                        <label>Attention Quality</label>
                    </div>
                </div>

                <div className="feedback-card animate-slide-up">
                    <div className="confetti-hint">✨✨✨</div>
                    <h2>You stayed in the zone!</h2>
                    <p>Your reading pace was consistent across all sentences. This linear flow is building strong neural focus paths.</p>
                    <button className="primary-btn" onClick={handleNext}>Finish Lesson →</button>
                </div>
            </main>

            <style jsx>{`
                .study-4 { min-height: 100vh; background: #FAF7F2; padding: 4rem; display: flex; flex-direction: column; align-items: center; }
                .progress-header { text-align: center; margin-bottom: 4rem; }
                .progress-header h1 { font-size: 3rem; color: #1A202C; }
                
                .metrics-dashboard { max-width: 900px; width: 100%; display: flex; flex-direction: column; gap: 3rem; }
                .card-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
                
                .metric { background: white; padding: 3rem 2rem; border-radius: 2rem; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 2px solid #E2E8F0; }
                .visual { width: 100px; height: 100px; border: 4px solid #FBCFE8; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; }
                .val { font-size: 1.5rem; font-weight: 800; color: #F59E0B; }
                .metric label { color: #718096; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; }
                
                .feedback-card { background: white; padding: 4rem; border-radius: 3rem; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.05); }
                .confetti-hint { font-size: 2rem; margin-bottom: 1rem; }
                h2 { font-size: 2.2rem; margin-bottom: 1rem; color: #1A202C; }
                
                @keyframes pop { from { scale: 0.8; opacity: 0; } to { scale: 1; opacity: 1; } }
                .animate-pop { animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
                .animate-slide-up { animation: slideUp 0.8s ease-out; }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default Module4_Progress;
