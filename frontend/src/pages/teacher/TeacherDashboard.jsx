import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import '../Hub.css';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAppContext();

    const handleEpicClick = (epic) => {
        if (epic.id === 'adhd') {
            console.log("TeacherDashboard: Navigating to ADHD module");
            navigate('/adhd');
        } else {
            console.log("TeacherDashboard: Module coming soon:", epic.title);
            alert(`${epic.title} module integration is coming soon!`);
        }
    };

    const epics = [
        { id: 'adhd', title: "ADHD Learners", description: "Focus-enhancing tools, linear reading, and session pacing.", icon: "🧠", active: true, color: "#E2E8F0" },
        { id: 'dyslexia', title: "Dyslexia Support", description: "Specialized fonts, text-to-speech, and reading assistants.", icon: "📖", active: false, color: "#FEFCBF" },
        { id: 'dysgraphia', title: "Dysgraphia Tools", description: "Speech-to-text, writing guides, and motor skill aids.", icon: "✍️", active: false, color: "#FED7D7" },
        { id: 'dyscalculia', title: "Dyscalculia Helper", description: "Visual math aids, gamified numbers, and logic puzzles.", icon: "🔢", active: false, color: "#C6F6D5" },
        { id: 'autism', title: "Autism Assistant", description: "Predictable routines, sensory-friendly UI, and social stories.", icon: "🧩", active: false, color: "#E9D8FD" }
    ];

    return (
        <div className="hub-container">
            <header className="hub-header">
                <h1>Teacher Control Center</h1>
                <p>Select a learning path to manage tasks and monitor progress</p>
            </header>

            <div className="epics-grid">
                {epics.map(epic => (
                    <div
                        key={epic.id}
                        className={`epic-card ${epic.active ? 'active' : 'coming-soon'}`}
                        style={{ borderTopColor: epic.color }}
                        onClick={() => epic.active && handleEpicClick(epic)}
                    >
                        <div className="epic-icon" style={{ backgroundColor: epic.color + '40' }}>
                            {epic.icon}
                        </div>
                        <h3>{epic.title}</h3>
                        <p>{epic.description}</p>
                        {epic.active ? (
                            <button
                                className="enter-btn"
                                onClick={(e) => {
                                    e.stopPropagation(); // prevent double trigger
                                    handleEpicClick(epic);
                                }}
                            >
                                Manage Module →
                            </button>
                        ) : (
                            <span className="badge">Coming Soon</span>
                        )}
                    </div>
                ))}
            </div>

            <footer className="hub-footer">
                <button className="logout-link" onClick={() => {
                    logout();
                    navigate('/');
                }}>Sign Out</button>
            </footer>
        </div>
    );
};

export default TeacherDashboard;
