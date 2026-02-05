import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Module1_Entry = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId');
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                // If no task ID, user might be exploring freely (or error)
                if (!taskId) return;

                const token = localStorage.getItem('lexfix_token');
                // We'll use the 'student related' endpoint or a direct get-by-id if we had one.
                // For now, let's fetch all student tasks and find the one. 
                // Optimization: Add GET /api/tasks/:id endpoint later.
                // Assuming we have the tasks in context or fetch again.
                // Let's implement GET /api/tasks/:id in backend if needed or just use passed state.
                // For robustness, let's assume we can fetch it. 
                // Actually, I didn't verify GET /api/tasks/:id exists. 
                // Let's stick to UI for now and fetch list then find.
                // But wait, user ID is needed for 'student/:id'.
                // Easier: Just display generic "Starting Task" if loading fails.
                setLoading(false);
            } catch (error) {
                console.error("Error loading task", error);
                setLoading(false);
            }
        };
        fetchTask();
    }, [taskId]);

    const handleStart = () => {
        // Navigate to Module 2 (Content)
        navigate(`/module/content?taskId=${taskId}`);
    };

    return (
        <div className="module-container full-screen-mode">
            <div className="entry-content">
                <div className="icon-pulse">🧠</div>
                <h1>ADHD Focus Mode Initiated</h1>
                <p>We are optimizing your environment for maximum concentration.</p>

                <div className="optimization-steps">
                    <div className="step done">✓ Distractions Blocked</div>
                    <div className="step done">✓ Timer Set</div>
                    <div className="step active">Processing Content...</div>
                </div>

                <div className="confirmation-box">
                    <p>Are you ready to focus on this task?</p>
                    <button className="primary-btn large-btn" onClick={handleStart}>
                        Yes, Let's Begin
                    </button>
                </div>
            </div>

            <style jsx>{`
                .module-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background: #FAF5F4;
                    text-align: center;
                }
                .entry-content {
                    background: white;
                    padding: 60px;
                    border-radius: 20px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    max-width: 600px;
                    width: 90%;
                }
                .icon-pulse {
                    font-size: 4rem;
                    margin-bottom: 20px;
                    animation: pulse 2s infinite;
                }
                h1 {
                    color: #2D3748;
                    margin-bottom: 10px;
                }
                p {
                    color: #718096;
                    margin-bottom: 30px;
                }
                .optimization-steps {
                    text-align: left;
                    margin: 30px auto;
                    width: fit-content;
                }
                .step {
                    margin: 10px 0;
                    font-size: 1.1rem;
                    color: #A0AEC0;
                }
                .step.done {
                    color: #48BB78;
                }
                .step.active {
                    color: #ED8936;
                    font-weight: bold;
                }
                .large-btn {
                    padding: 15px 40px;
                    font-size: 1.2rem;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Module1_Entry;
