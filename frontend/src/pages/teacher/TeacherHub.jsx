// pages/teacher/TeacherHub.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TeacherHub.css';

export default function TeacherHub() {
    const navigate = useNavigate();

    const disabilities = [
        {
            id: 'adhd',
            name: 'ADHD',
            icon: '🎯',
            color: '#FF6B6B',
            description: 'Attention Deficit Hyperactivity Disorder'
        },
        {
            id: 'autism',
            name: 'Autism',
            icon: '🧩',
            color: '#4ECDC4',
            description: 'Autism Spectrum Disorder'
        },
        {
            id: 'dyslexia',
            name: 'Dyslexia',
            icon: '📖',
            color: '#95E1D3',
            description: 'Reading and language processing difficulty'
        },
        {
            id: 'dyscalculia',
            name: 'Dyscalculia',
            icon: '🔢',
            color: '#F38181',
            description: 'Mathematical learning disability'
        },
        {
            id: 'dysgraphia',
            name: 'Dysgraphia',
            icon: '✍️',
            color: '#AA96DA',
            description: 'Writing difficulties'
        }
    ];

    const handleDisabilityClick = (disabilityId) => {
        navigate(`/teacher/disability/${disabilityId}`);
    };

    return (
        <div className="teacher-hub">
            <header className="hub-header">
                <h1>🎓 Teacher Hub</h1>
                <p>Select a disability category to manage assignments and students</p>
            </header>

            <div className="disabilities-grid">
                {disabilities.map((disability) => (
                    <div
                        key={disability.id}
                        className="disability-card"
                        onClick={() => handleDisabilityClick(disability.id)}
                        style={{ borderColor: disability.color }}
                    >
                        <div className="card-icon" style={{ backgroundColor: disability.color }}>
                            {disability.icon}
                        </div>
                        <h3>{disability.name}</h3>
                        <p>{disability.description}</p>
                        <button
                            className="manage-btn"
                            style={{ backgroundColor: disability.color }}
                        >
                            Manage →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
