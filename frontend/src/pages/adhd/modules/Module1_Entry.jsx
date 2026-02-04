import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Module1_Entry = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const taskId = searchParams.get('taskId');

    const handleStart = () => {
        navigate(`/adhd/module/content?taskId=${taskId}`);
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

            <style dangerouslySetInnerHTML={{
                __html: `
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
                    background: #2D3748;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}} />
        </div>
    );
};

export default Module1_Entry;
