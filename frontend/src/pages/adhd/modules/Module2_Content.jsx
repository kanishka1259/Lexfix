import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Module2_Content = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId');
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [sentences, setSentences] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock Content if fetching fails (so user sees something working)
    const mockSentences = [
        "Welcome to your focused reading session.",
        "This interface is designed to reduce visual clutter.",
        "You will read one sentence at a time.",
        "Take a deep breath and focus on the words.",
        "You are doing great, keep going!"
    ];

    useEffect(() => {
        // Fetch task content (Mocking for now to ensure "fast" working state)
        // In real impl, we fetch logic from API
        // For now, let's use mock data if ID is present
        setSentences(mockSentences);
        setLoading(false);
    }, [taskId]);

    const handleNext = () => {
        if (currentSentenceIndex < sentences.length - 1) {
            setCurrentSentenceIndex(prev => prev + 1);
        } else {
            // Navigate to next module
            navigate(`/module/pacing?taskId=${taskId}`);
        }
    };

    const handlePrev = () => {
        if (currentSentenceIndex > 0) {
            setCurrentSentenceIndex(prev => prev - 1);
        }
    };

    const progress = ((currentSentenceIndex + 1) / sentences.length) * 100;

    return (
        <div className="module-container">
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="content-area">
                <div className="sentence-display">
                    {sentences[currentSentenceIndex]}
                </div>
            </div>

            <div className="controls">
                <button className="nav-btn prev" onClick={handlePrev} disabled={currentSentenceIndex === 0}>
                    ← Previous
                </button>
                <div className="counter">
                    {currentSentenceIndex + 1} / {sentences.length}
                </div>
                <button className="nav-btn next" onClick={handleNext}>
                    {currentSentenceIndex === sentences.length - 1 ? 'Finish Section' : 'Next Sentence →'}
                </button>
            </div>

            <style jsx>{`
                .module-container {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: #FAF5F4;
                }
                .progress-bar-container {
                    height: 8px;
                    background: #E2E8F0;
                    width: 100%;
                }
                .progress-bar {
                    height: 100%;
                    background: #E9D8FD; /* Soft purple */
                    background: linear-gradient(90deg, #6B46C1, #9F7AEA);
                    transition: width 0.3s ease;
                }
                .content-area {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px;
                }
                .sentence-display {
                    font-size: 2.5rem;
                    font-weight: 500;
                    color: #2D3748;
                    line-height: 1.4;
                    text-align: center;
                    max-width: 900px;
                    animation: fadeIn 0.5s ease;
                }
                .controls {
                    padding: 40px;
                    background: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 -5px 20px rgba(0,0,0,0.05);
                }
                .nav-btn {
                    padding: 15px 30px;
                    border: none;
                    background: #EDF2F7;
                    color: #4A5568;
                    font-size: 1.1rem;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .nav-btn:hover:not(:disabled) {
                    background: #E2E8F0;
                    transform: translateY(-2px);
                }
                .nav-btn.next {
                    background: #2D3748;
                    color: white;
                }
                .nav-btn.next:hover {
                    background: #1A202C;
                }
                .nav-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .counter {
                    font-size: 1.2rem;
                    color: #A0AEC0;
                    font-weight: 600;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Module2_Content;
