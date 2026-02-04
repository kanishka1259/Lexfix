import React, { useEffect } from 'react';
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

                <button className="primary-btn" onClick={() => navigate('/')}>
                    Return to Dashboard
                </button>
            </div>

            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>
            <div className="confetti-piece"></div>

            <style jsx>{`
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
                    animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 10;
                }
                .trophy { font-size: 6rem; margin-bottom: 20px; animation: bounce 2s infinite; }
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
                    transition: transform 0.2s;
                }
                .primary-btn:hover { transform: scale(1.05); }
                
                /* CSS Only Confetti */
                .confetti-piece {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: #ffd300;
                    top: -10px;
                    opacity: 0;
                }
                .confetti-piece:nth-child(2n) { background: #ff005c; }
                .confetti-piece:nth-child(3n) { background: #00bfff; }
                .confetti-piece:nth-child(4n) { background: #50e3c2; }
                
                .confetti-piece:nth-child(1) { left: 10%; animation: fall 3s infinite ease-out; animation-delay: 0s; }
                .confetti-piece:nth-child(2) { left: 20%; animation: fall 3s infinite ease-out; animation-delay: 1s; }
                .confetti-piece:nth-child(3) { left: 30%; animation: fall 3s infinite ease-out; animation-delay: 0.5s; }
                .confetti-piece:nth-child(4) { left: 40%; animation: fall 3s infinite ease-out; animation-delay: 2s; }
                .confetti-piece:nth-child(5) { left: 50%; animation: fall 3s infinite ease-out; animation-delay: 1.5s; }
                .confetti-piece:nth-child(6) { left: 60%; animation: fall 3s infinite ease-out; animation-delay: 0.2s; }
                .confetti-piece:nth-child(7) { left: 70%; animation: fall 3s infinite ease-out; animation-delay: 1.2s; }
                .confetti-piece:nth-child(8) { left: 80%; animation: fall 3s infinite ease-out; animation-delay: 2.5s; }
                .confetti-piece:nth-child(9) { left: 90%; animation: fall 3s infinite ease-out; animation-delay: 0.8s; }
                
                @keyframes popIn {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes fall {
                    0% { top: -10%; transform: rotate(0deg); opacity: 1; }
                    100% { top: 110%; transform: rotate(720deg); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default Module5_Completion;
