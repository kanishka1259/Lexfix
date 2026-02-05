import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Brain, BookOpen, Activity, Users, LogOut, GraduationCap, ArrowRight } from 'lucide-react';

const Hub = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const token = localStorage.getItem('token');

    const handleModuleClick = (moduleName) => {
        if (moduleName.toLowerCase() === 'adhd') {
            // Redirect Teacher to internal ADHD Dashboard
            navigate('/adhd');
        } else {
            alert("This module is coming soon!");
        }
    };

    const modules = [
        {
            name: "ADHD",
            icon: <Brain size={32} />,
            color: "bg-purple-100 text-purple-600",
            border: "border-purple-200",
            desc: "Attention & Hyperactivity Support",
            status: "Active"
        },
        {
            name: "Dyslexia",
            icon: <BookOpen size={32} />,
            color: "bg-blue-100 text-blue-600",
            border: "border-blue-200",
            desc: "Reading & Language Assistance",
            status: "Coming Soon"
        },
        {
            name: "Dyscalculia",
            icon: <Activity size={32} />,
            color: "bg-green-100 text-green-600",
            border: "border-green-200",
            desc: "Math & Number Learning",
            status: "Coming Soon"
        },
        {
            name: "Autism",
            icon: <Users size={32} />,
            color: "bg-orange-100 text-orange-600",
            border: "border-orange-200",
            desc: "Social & Communication Skills",
            status: "Coming Soon"
        },
        {
            name: "Dysgraphia",
            icon: <LayoutDashboard size={32} />,
            color: "bg-pink-100 text-pink-600",
            border: "border-pink-200",
            desc: "Writing & Motor Skills",
            status: "Coming Soon"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar / Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">LexFix Educator</h1>
                            <p className="text-xs text-gray-500">Empowering Every Learner</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right mr-2">
                            <p className="text-sm font-semibold text-gray-900">{user?.name || 'Educator'}</p>
                            <p className="text-xs text-gray-500">{user?.email || 'Teacher'}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Learning Modules</h2>
                    <p className="text-gray-600 max-w-2xl">
                        Select a specialized learning module to manage assignments, track progress, and support your students' unique needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {modules.map((mod) => (
                        <div
                            key={mod.name}
                            onClick={() => handleModuleClick(mod.name)}
                            className={`group relative bg-white rounded-2xl p-6 border ${mod.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden`}
                        >
                            {/* Decorative background blob */}
                            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 ${mod.color.split(' ')[0]} transition-transform group-hover:scale-150`}></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-4 rounded-xl ${mod.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                        {mod.icon}
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ${mod.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {mod.status}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                                    {mod.name}
                                </h3>
                                <p className="text-gray-500 mb-6 min-h-[48px]">
                                    {mod.desc}
                                </p>

                                <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:gap-2 transition-all">
                                    {mod.status === 'Active' ? 'Access Module' : 'Notify Me'} <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 ml-1 transition-opacity" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Hub;
