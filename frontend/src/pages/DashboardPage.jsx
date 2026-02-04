import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const { user, logout } = useAppContext();
    const navigate = useNavigate();

    // Redirect if not logged in
    React.useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) return null;

    const userRole = user.userType.charAt(0).toUpperCase() + user.userType.slice(1);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-brand-cream p-8">
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <img src="/LexFix-Logo.png" alt="LexFix Logo" className="h-12 w-auto object-contain" />
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-gray-900 font-bold">Welcome, {user.username}</p>
                        <p className="text-xs text-gray-500">{userRole} {user.studentId ? `| ID: ${user.studentId}` : ''}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-white transition-colors"
                    >
                        Log Out
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Learning Journey Starts Here</h2>
                    <p className="text-gray-600 mb-8">
                        This is your personal {user.userType} dashboard where you can access lessons, track progress, and manage your account.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Placeholder cards */}
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="h-48 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 font-medium">
                                Module {item}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
