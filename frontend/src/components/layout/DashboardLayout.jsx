import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppContext } from '../../context/AppContext';

const DashboardLayout = ({ title, children }) => {
    const { user, logout } = useAuth();
    const { userType } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userRole = (user && user.role) ? user.role : userType || 'Guest';
    const roleDisplay = userRole.charAt(0).toUpperCase() + userRole.slice(1);

    return (
        <div className="min-h-screen bg-brand-cream p-4 md:p-8">
            <header className="flex justify-between items-center mb-8 md:mb-12 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <img
                        src="/LexFix-Logo.png"
                        alt="LexFix Logo"
                        className="h-8 md:h-12 w-auto object-contain cursor-pointer"
                        onClick={() => navigate('/')}
                    />
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 border-l border-gray-300 pl-4">
                        {title || 'Dashboard'}
                    </h1>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-gray-900 font-bold text-sm md:text-base">Welcome, {user?.name || user?.username}</p>
                        <p className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-semibold">
                            {roleDisplay} {user?.studentId ? `| ID: ${user.studentId}` : ''}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold border border-gray-300 rounded-lg hover:bg-white transition-all bg-white/50 shadow-sm"
                    >
                        Log Out
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
