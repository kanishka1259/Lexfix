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

    const mockSentences = [
        "Welcome to your focused reading session.",
        "This interface is designed to reduce visual clutter.",
        "You will read one sentence at a time.",
        "Take a deep breath and focus on the words.",
        "You are doing great, keep going!"
    ];

    useEffect(() => {
        const fetchTask = async () => {
            try {
                if (!taskId) {
                    setSentences(mockSentences);
                    setLoading(false);
                    return;
                }
                const token = localStorage.getItem('lexfix_token');
                // Fetch student tasks to find this specific one (monolith api)
                const res = await axios.get('/api/tasks/student/me', { // We'll need to handle 'me' or pass ID
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Find taskId in list or just use mock for now if endpoint is specific
                setSentences(mockSentences);
            } catch (e) {
                setSentences(mockSentences);
            } finally {
                setLoading(false);
            }
        }
        fetchTask();
    }, [taskId]);

    const handleNext = () => {
        if (currentSentenceIndex < sentences.length - 1) {
            setCurrentSentenceIndex(prev => prev + 1);
        } else {
            navigate(`/adhd/module/pacing?taskId=${taskId}`);
        }
    };

    const handlePrev = () => {
        if (currentSentenceIndex > 0) {
            setCurrentSentenceIndex(prev => prev - 1);
        }
    };

    const progress = ((currentSentenceIndex + 1) / sentences.length) * 100;

    if (loading) return <div>Loading content...</div>;

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

            <style dangerouslySetInnerHTML={{
                __html: `
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
            `}} />
        </div>
    );
};

export default Module2_Content;
