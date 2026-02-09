import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

const Module5_Completion = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId');

    useEffect(() => {
        // Celebratory confetti
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#F59E0B', '#10B981', '#3B82F6']
        });
    }, []);

    const handleExit = () => {
        navigate('/dashboard');
    };

    return (
        <div className="module-container study-5">
            <div className="completion-card animate-pop">
                <div className="trophy-icon">🎓</div>
                <h1>Lesson Mastered!</h1>
                <p>You've successfully completed this focused learning session.</p>

                <div className="badges-row">
                    <div className="badge-item">
                        <span className="icon">🏆</span>
                        <span className="txt">Study 5 Done</span>
                    </div>
                    <div className="badge-item">
                        <span className="icon">⚡</span>
                        <span className="txt">Focus Level up</span>
                    </div>
                </div>

                <div className="action-btns">
                    <button className="primary-btn wide" onClick={handleExit}>Back to Dashboard</button>
                    <button className="secondary-btn" onClick={() => navigate('/adhd')}>Open ADHD Hub</button>
                </div>
            </div>

            <style jsx>{`
                .study-5 { height: 100vh; background: #FAF7F2; display: flex; justify-content: center; align-items: center; padding: 2rem; }
                .completion-card { background: white; padding: 5rem 3rem; border-radius: 3.5rem; box-shadow: 0 40px 100px -20px rgba(0,0,0,0.1); max-width: 550px; width: 100%; text-align: center; border: 2px solid #FEF3C7; }
                .trophy-icon { font-size: 6rem; margin-bottom: 2.5rem; }
                h1 { font-size: 3.2rem; color: #1A202C; margin-bottom: 1rem; }
                p { font-size: 1.25rem; color: #718096; margin-bottom: 3rem; }
                
                .badges-row { display: flex; justify-content: center; gap: 1.5rem; margin-bottom: 4rem; }
                .badge-item { display: flex; align-items: center; gap: 0.8rem; background: #FFFBEB; padding: 1rem 1.5rem; border-radius: 1.5rem; border: 1px solid #FEF3C7; }
                .badge-item .icon { font-size: 1.2rem; }
                .badge-item .txt { font-weight: 800; color: #B45309; font-size: 0.9rem; text-transform: uppercase; }
                
                .action-btns { display: flex; flex-direction: column; gap: 1rem; }
                .primary-btn.wide { padding: 1.5rem; font-size: 1.25rem; }
                .secondary-btn { background: none; border: 2px solid #E2E8F0; padding: 1.2rem; border-radius: 1rem; font-weight: 800; color: #64748B; cursor: pointer; font-size: 1.1rem; }
                
                @keyframes pop { from { scale: 0.5; opacity: 0; } to { scale: 1; opacity: 1; } }
                .animate-pop { animation: pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
            `}</style>
        </div>
    );
};

export default Module5_Completion;
