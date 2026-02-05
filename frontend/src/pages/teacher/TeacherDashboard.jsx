import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAppContext();

    const handleEpicClick = (epic) => {
        if (epic.id === 'adhd') {
            navigate('/adhd');
        } else {
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm py-6 px-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Teacher Control Center</h1>
                    <p className="text-gray-500 mt-1">Select a learning path to manage tasks and monitor progress</p>
                </div>
                <button
                    onClick={() => {
                        logout();
                        navigate('/');
                    }}
                    className="px-4 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                    Sign Out
                </button>
            </header>

            <main className="flex-grow p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {epics.map(epic => (
                        <div
                            key={epic.id}
                            className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${epic.active
                                    ? 'hover:shadow-md hover:-translate-y-1 cursor-pointer'
                                    : 'opacity-75 grayscale-[0.5] cursor-not-allowed'
                                }`}
                            onClick={() => epic.active && handleEpicClick(epic)}
                        >
                            <div className="h-2 w-full" style={{ backgroundColor: epic.color }}></div>
                            <div className="p-6">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4" style={{ backgroundColor: epic.color }}>
                                    {epic.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{epic.title}</h3>
                                <p className="text-gray-600 mb-6 min-h-[48px]">{epic.description}</p>

                                <div className="flex items-center justify-between">
                                    {epic.active ? (
                                        <span className="text-blue-600 font-semibold flex items-center gap-2">
                                            Manage Module
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm font-medium rounded-full">Coming Soon</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
