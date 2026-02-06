import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Brain, BookOpen, Activity, Users, LayoutDashboard, ArrowRight } from 'lucide-react';
import './TeacherHub.css';

export default function TeacherHub() {
    const navigate = useNavigate();

    const modules = [
        {
            id: 'adhd',
            name: 'ADHD Learners',
            icon: <Brain size={32} />,
            color: "bg-purple-100 text-purple-600",
            border: "border-purple-200",
            description: 'Focus-enhancing tools, linear reading, and session pacing.',
            status: 'active'
        },
        {
            id: 'dyslexia',
            name: 'Dyslexia Support',
            icon: <BookOpen size={32} />,
            color: "bg-blue-100 text-blue-600",
            border: "border-blue-200",
            description: 'Specialized fonts, text-to-speech, and reading assistants.',
            status: 'coming-soon'
        },
        {
            id: 'dysgraphia',
            name: 'Dysgraphia Tools',
            icon: <LayoutDashboard size={32} />,
            color: "bg-pink-100 text-pink-600",
            border: "border-pink-200",
            description: 'Speech-to-text, writing guides, and motor skill aids.',
            status: 'coming-soon'
        },
        {
            id: 'dyscalculia',
            name: 'Dyscalculia Helper',
            icon: <Activity size={32} />,
            color: "bg-green-100 text-green-600",
            border: "border-green-200",
            description: 'Visual math aids, gamified numbers, and logic puzzles.',
            status: 'coming-soon'
        },
        {
            id: 'autism',
            name: 'Autism Assistant',
            icon: <Users size={32} />,
            color: "bg-orange-100 text-orange-600",
            border: "border-orange-200",
            description: 'Predictable routines, sensory-friendly UI, and social stories.',
            status: 'coming-soon'
        }
    ];

    const handleModuleClick = (moduleId, status) => {
        if (status === 'active') {
            navigate(`/teacher/disability/${moduleId}`);
        }
    };

    return (
        <DashboardLayout title="Teacher Control Center">
            <div className="teacher-hub-container-inner max-w-7xl mx-auto">
                <div className="text-center mb-10 mt-2">
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Select a learning path to manage tasks and monitor progress for your students.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((mod) => (
                        <div
                            key={mod.id}
                            onClick={() => handleModuleClick(mod.id, mod.status)}
                            className={`group relative bg-white rounded-2xl p-6 border ${mod.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden ${mod.status !== 'active' ? 'opacity-75' : ''}`}
                        >
                            {/* Decorative background blob */}
                            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 ${mod.color.split(' ')[0]} transition-transform group-hover:scale-150`}></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-xl ${mod.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                        {mod.icon}
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${mod.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {mod.status === 'active' ? 'Active' : 'Soon'}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                                    {mod.name}
                                </h3>
                                <p className="text-gray-500 mb-6 min-h-[48px]">
                                    {mod.description}
                                </p>

                                <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                                    {mod.status === 'active' ? 'Manage Module' : 'Notify Me'} <ArrowRight size={16} className={`opacity-0 group-hover:opacity-100 ml-1 transition-opacity ${mod.status === 'active' ? '' : 'hidden'}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
