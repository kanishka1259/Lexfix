import React from 'react';
import { useNavigate } from 'react-router-dom';

const Module5_Completion = () => {
    const navigate = useNavigate();

    return (
        <div className="module-container">
            <div className="celebration-card">
                <div className="trophy">🏆</div>
                <h1>Outstanding!</h1>
                <p>You have successfully completed this learning session.</p>

                <div className="xp-badge">
                    +50 XP Earned
                </div>

                <button className="primary-btn" onClick={() => navigate('/adhd')}>
                    Return to Hub
                </button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .module-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #FFFAF0 0%, #FFF5F5 100%);
                    overflow: hidden;
                    position: relative;
                }
                .celebration-card {
                    text-align: center;
                    padding: 60px;
                    background: white;
                    border-radius: 30px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.1);
                    z-index: 10;
                }
                .trophy { font-size: 6rem; margin-bottom: 20px; }
                h1 { color: #D69E2E; margin-bottom: 10px; font-size: 2.5rem; }
                .xp-badge {
                    background: #FEFCBF;
                    color: #B7791F;
                    padding: 10px 20px;
                    border-radius: 50px;
                    font-weight: bold;
                    display: inline-block;
                    margin: 20px 0 40px 0;
                }
                .primary-btn {
                    padding: 15px 40px;
                    background: #D69E2E;
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    cursor: pointer;
                }
            `}} />
        </div>
    );
};

export default Module5_Completion;
