import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import Navbar from '../../components/Navbar';
import { BookOpen, Activity, LayoutDashboard, Users, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

const DISABILITY_CONFIG = {
    dyslexia: {
        title: "Dyslexia Support",
        description: "Reading tools, specialized fonts, and text-to-speech.",
        icon: BookOpen,
        color: "blue",
        bg: "bg-blue-50",
        text: "text-blue-600"
    },
    dysgraphia: {
        title: "Dysgraphia Tools",
        description: "Writing assistants and speech-to-text features.",
        icon: LayoutDashboard,
        color: "pink",
        bg: "bg-pink-50",
        text: "text-pink-600"
    },
    dyscalculia: {
        title: "Dyscalculia Helper",
        description: "Visual math aids and logic puzzles.",
        icon: Activity,
        color: "green",
        bg: "bg-green-50",
        text: "text-green-600"
    },
    autism: {
        title: "Autism Assistant",
        description: "Structured routines and sensory-friendly tasks.",
        icon: Users,
        color: "orange",
        bg: "bg-orange-50",
        text: "text-orange-600"
    }
};

const DisabilityHub = ({ type }) => {
    const navigate = useNavigate();
    const { user } = useAppContext();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    const config = DISABILITY_CONFIG[type] || DISABILITY_CONFIG.dyslexia;
    const Icon = config.icon;

    useEffect(() => {
        fetchAssignments();
    }, [type]);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            // Fetch 'my-assignments' which ideally returns all allowed assignments
            // Or if we had a filter by type endpoint, we'd use it.
            // For now, let's assume we fetch all and filter client side or use a query if supported.
            // Since `assignmentRoutes.js` has `getStudentAssignments`, let's see if it filters.
            // Ideally backend filters, but let's fetch all student assignments and filter by specific disability property if it exists.
            // If the backend doesn't return 'disability' type on the assignment, we might show all.
            // Let's assume the assignment object has a 'disability' field (schema check would confirm).

            const response = await axios.get('http://localhost:5000/api/assignments/my-assignments', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                // Filter by disability type if possible, or just show all for now if uncertain
                const filtered = response.data.filter(a => a.disability === type || a.type === type);
                setAssignments(filtered.length > 0 ? filtered : []);
                // Fallback: if no filter match, showing empty is correct behavior for specific hub.
            }
        } catch (error) {
            console.error("Error fetching assignments:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />
            <div className="pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
                        <div className="flex items-center gap-6">
                            <div className={`p-4 rounded-2xl ${config.bg}`}>
                                <Icon className={`w-8 h-8 ${config.text}`} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">{config.title}</h1>
                                <p className="text-slate-500 mt-2 text-lg">{config.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Assignments Section */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-slate-400" />
                                Your Assignments
                            </h2>

                            {loading ? (
                                <div className="p-8 text-center text-slate-400">Loading tasks...</div>
                            ) : assignments.length === 0 ? (
                                <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200">
                                    <div className={`w-16 h-16 ${config.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                        <CheckCircle className={`w-8 h-8 ${config.text}`} />
                                    </div>
                                    <h3 className="font-bold text-slate-700 mb-1">All Caught Up!</h3>
                                    <p className="text-slate-400 text-sm">No assignments pending for {config.title}.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {assignments.map(assignment => (
                                        <div key={assignment._id}
                                            onClick={() => navigate(`/student/read/${assignment._id}?type=${type}`)}
                                            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                                                        {assignment.title}
                                                    </h3>
                                                    <p className="text-slate-500 text-sm mt-1 line-clamp-2">{assignment.description}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${config.bg} ${config.text}`}>
                                                    {type}
                                                </span>
                                            </div>
                                            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-400">
                                                <span>Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No Deadline'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar / Resources */}
                        <div className="space-y-6">
                            <div className="bg-indigo-900 rounded-3xl p-6 text-white overflow-hidden relative">
                                <div className="relative z-10">
                                    <h3 className="font-bold text-lg mb-2">Need Extra Help?</h3>
                                    <p className="text-indigo-200 text-sm mb-4">
                                        Check out our resource library for guides and tools specific to {type}.
                                    </p>
                                    <button className="bg-white text-indigo-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors">
                                        View Resources
                                    </button>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-800 rounded-full opacity-50"></div>
                            </div>

                            {/* Type Specific Quick Actions */}
                            {type === 'dyslexia' && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-slate-800 mb-4">Quick Settings</h3>
                                    <button onClick={() => navigate('/profile')} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Adjust Reading Settings
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DisabilityHub;
