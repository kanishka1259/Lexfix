import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming context exists
import './Hub.css';

const Hub = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Assuming AuthContext provides user

    // We can get token from user context or localStorage
    const token = localStorage.getItem('lexfix_token');

    React.useEffect(() => {
        if (user && user.role === 'Student') {
            if (user.learningIssue === 'ADHD') {
                // Navigate to internal ADHD route
                navigate('/adhd');
            }
            // Add checks for other modules here in future
            // If issue is 'None', they stay on Hub
        }
    }, [user, navigate]);

    const handleEpicClick = (epic) => {
        if (epic.id === 'adhd') {
            // Navigate to ADHD Module (Internal Route)
            navigate('/adhd');
        } else {
            // Placeholder for others
            alert(`The ${epic.title} module is coming soon!`);
        }
    };

    const epics = [
        {
            id: 'adhd',
            title: "ADHD Learners",
            description: "Focus-enhancing tools, linear reading, and session pacing.",
            icon: "🧠",
            active: true,
            color: "#E2E8F0" // Soft Blue/Grey
        },
        {
            id: 'dyslexia',
            title: "Dyslexia Support",
            description: "Specialized fonts, text-to-speech, and reading assistants.",
            icon: "📖",
            active: false,
            color: "#FEFCBF" // Soft Yellow
        },
        {
            id: 'dysgraphia',
            title: "Dysgraphia Tools",
            description: "Speech-to-text, writing guides, and motor skill aids.",
            icon: "✍️",
            active: false,
            color: "#FED7D7" // Soft Red
        },
        {
            id: 'dyscalculia',
            title: "Dyscalculia Helper",
            description: "Visual math aids, gamified numbers, and logic puzzles.",
            icon: "🔢",
            active: false,
            color: "#C6F6D5" // Soft Green
        },
        {
            id: 'autism',
            title: "Autism Assistant",
            description: "Predictable routines, sensory-friendly UI, and social stories.",
            icon: "🧩",
            active: false,
            color: "#E9D8FD" // Soft Purple
        }
    ];

    return (
        <div className="hub-container">
            <header className="hub-navbar">
                <div className="navbar-content">
                    <img src="/LexFix-Logo.png" alt="LexFix Logo" className="logo" onClick={() => navigate('/dashboard')} />
                    <button className="logout-btn" onClick={() => {
                        localStorage.removeItem('lexfix_token');
                        navigate('/');
                    }}>Sign Out</button>
                </div>
            </header>

            <div className="hub-hero">
                <h1>Welcome to LexFix</h1>
                <p>Select your personalized learning path</p>
            </div>

            <div className="epics-grid">
                {epics.map(epic => (
                    <div
                        key={epic.id}
                        className={`epic-card ${epic.active ? 'active' : 'coming-soon'}`}
                        onClick={() => handleEpicClick(epic)}
                        style={{ borderTopColor: epic.color }}
                    >
                        <div className="epic-icon" style={{ backgroundColor: epic.color + '40' }}>
                            {epic.icon}
                        </div>
                        <h3>{epic.title}</h3>
                        <p>{epic.description}</p>
                        {epic.active ? (
                            <button className="enter-btn">Enter Module →</button>
                        ) : (
                            <span className="badge">Coming Soon</span>
                        )}
                    </div>
                ))}
            </div>

            <footer className="hub-footer">
                <button className="logout-link" onClick={() => {
                    localStorage.removeItem('lexfix_token');
                    navigate('/');
                }}>Sign Out</button>
            </footer>
        </div>
    );
};

export default Hub;
