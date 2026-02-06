import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '../../context/AppContext';
import Navbar from '../Navbar';

const DashboardLayout = ({ title, children }) => {
    const { user, logout, userType } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const userRole = (user && user.role) ? user.role : userType || 'Guest';
    const roleDisplay = userRole.charAt(0).toUpperCase() + userRole.slice(1);

    return (
        <div className="min-h-screen bg-brand-cream">
            <Navbar />

            <main className="max-w-7xl mx-auto w-full pt-28 px-4 md:px-8 pb-12">
                {title && (
                    <header className="mb-8 md:mb-12">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {title}
                        </h1>
                    </header>
                )}
                {children}
            </main>
        </div>
    );
};


export default DashboardLayout;
