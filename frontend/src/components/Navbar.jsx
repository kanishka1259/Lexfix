import React from 'react';
import { useAppContext } from '@/context/AppContext';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import { Type } from 'lucide-react'; // Icon for font toggle

const Navbar = () => {
    const { userType, setUserType, user, logout } = useAppContext();

    const getButtonClass = (type) => {
        const isActive = userType === type;
        // Active: #c9e7ff, Normal: #e8f1f8 per user request
        const baseClass = "px-4 py-2 text-sm font-medium rounded-md transition-colors";
        return isActive
            ? `${baseClass} bg-[#c9e7ff] text-blue-900 border border-blue-200`
            : `${baseClass} bg-[#e8f1f8] text-gray-600 hover:bg-gray-200`;
    };

    return (
        <nav className="w-full h-18 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-8 py-3">
            <div className="flex items-center gap-6">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="/LexFix-Logo.png" alt="LexFix Logo" className="h-8 md:h-10 w-auto object-contain" />
                </div>

                {/* Persona Selectors - Only show if NO user is logged in */}
                {!user && (
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={() => setUserType('student')}
                            className={getButtonClass('student')}
                        >
                            For Students
                        </button>
                        <button
                            onClick={() => setUserType('teacher')}
                            className={getButtonClass('teacher')}
                        >
                            For Teachers
                        </button>
                        <button
                            onClick={() => setUserType('parent')}
                            className={getButtonClass('parent')}
                        >
                            For Parents
                        </button>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <a href="/dashboard" className="text-sm font-semibold text-gray-700 hover:text-brand-orange">Dashboard</a>
                            <button
                                onClick={logout}
                                className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <LoginModal
                                trigger={
                                    <button className="px-5 py-2 text-sm font-semibold border border-gray-900 rounded-md hover:bg-gray-50 transition-colors">
                                        Login
                                    </button>
                                }
                            />
                            <SignupModal
                                trigger={
                                    <button className="px-5 py-2 text-sm font-semibold bg-brand-orange text-gray-900 border border-brand-orange rounded-md hover:opacity-90 transition-opacity">
                                        Signup
                                    </button>
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
