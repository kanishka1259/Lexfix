import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Module2_Content = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sentences, setSentences] = useState([]);
    const [loading, setLoading] = useState(true);

    const mockSentences = [
        "Welcome to your focused reading session.",
        "We view one sentence at a time in a large, readable format.",
        "I see the active sentence clearly highlighted.",
        "I move through the lesson in a linear flow without skipping.",
        "This helps avoid information overload and keeps me focused."
    ];

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                const userData = storedUser ? JSON.parse(storedUser) : null;
                const token = userData?.token || localStorage.getItem('lexfix_token');

                if (taskId) {
                    const response = await axios.get(`http://localhost:5000/api/tasks/detail/${taskId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (response.data.success && response.data.data.content) {
                        setSentences(response.data.data.content);
                    } else {
                        setSentences(mockSentences);
                    }
                } else {
                    setSentences(mockSentences);
                }
            } catch (error) {
                console.error("Error loading sentences:", error);
                setSentences(mockSentences);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [taskId]);

    const handleNext = () => {
        if (currentIndex < sentences.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            navigate(`/adhd/module/pacing?taskId=${taskId}`);
        }
    };

    const progress = ((currentIndex + 1) / sentences.length) * 100;

    if (loading) return <div className="loading">Preparing sentences...</div>;

    return (
        <div className="module-container study-2">
            <div className="top-progress">
                <div className="fill" style={{ width: `${progress}%` }}></div>
            </div>

            <main className="focus-viewer">
                <div className="sentence-card animate-pop">
                    <p className="active-sentence text-shadow">{sentences[currentIndex]}</p>
                </div>
            </main>

            <footer className="footer-nav">
                <div className="counter">Step {currentIndex + 1} of {sentences.length}</div>
                <button className="primary-btn next-action" onClick={handleNext}>
                    {currentIndex === sentences.length - 1 ? 'Start Timer Study →' : 'Next Sentence →'}
                </button>
            </footer>

            <style jsx>{`
                .study-2 {
                    height: 100vh;
                    background: #FAF7F2;
                    display: flex;
                    flex-direction: column;
                }
                .top-progress { height: 10px; background: #E2E8F0; width: 100%; }
                .fill { height: 100%; background: #F59E0B; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                
                .focus-viewer {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                }
                .sentence-card {
                    background: white;
                    padding: 5rem;
                    border-radius: 3rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.05);
                    max-width: 1000px;
                    width: 100%;
                    text-align: center;
                    border: 1px solid #FEF3C7;
                }
                .active-sentence {
                    font-size: 3.5rem;
                    line-height: 1.3;
                    color: #1A202C;
                    font-weight: 600;
                }
                .footer-nav {
                    padding: 4rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: rgba(255,255,255,0.5);
                }
                .counter { margin-bottom: 1.5rem; color: #718096; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
                .next-action { padding: 1.5rem 4rem; font-size: 1.4rem; border-radius: 1rem; }
                
                @keyframes pop {
                    from { opacity: 0; transform: scale(0.95) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-pop { animation: pop 0.6s ease-out; }
            `}</style>
        </div>
    );
};

export default Module2_Content;
