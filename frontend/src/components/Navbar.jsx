import React from 'react';
import { useAppContext } from '@/context/AppContext';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import { Type } from 'lucide-react'; // Icon for font toggle

const Navbar = () => {
    const { userType, setUserType, user, logout, isDyslexic, setIsDyslexic } = useAppContext();

    const getButtonClass = (type) => {
        const isActive = userType === type;
        // Updated colors and rounding to match the image more closely
        const baseClass = "px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm";
        return isActive
            ? `${baseClass} bg-[#c9e7ff] text-[#1e40af] border border-[#bfdbfe]`
            : `${baseClass} bg-[#f1f5f9] text-[#475569] border border-transparent hover:bg-[#e2e8f0]`;
    };

    return (
        <nav className="w-full h-20 border-b border-gray-100 bg-white flex items-center justify-between px-4 md:px-10 py-4">
            <div className="flex items-center gap-4 lg:gap-8">
                {/* Logo */}
                <div className="flex items-center">
                    <img src="/LexFix-Logo.png" alt="LexFix Logo" className="h-6 md:h-8 w-auto object-contain cursor-pointer" onClick={() => window.location.href = '/'} />
                </div>

                {/* Persona Selectors - ALWAYS show these */}
                <div className="flex items-center gap-2 lg:gap-4">
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
            </div>

            <div className="flex items-center gap-6">
                {/* Auth Buttons - ALWAYS show Login and Signup */}
                <div className="flex items-center gap-4">
                    <LoginModal
                        trigger={
                            <button className="px-8 py-2.5 text-sm font-bold text-gray-900 border border-black rounded-lg hover:bg-gray-50 transition-colors">
                                Login
                            </button>
                        }
                    />
                    <SignupModal
                        trigger={
                            <button className="px-8 py-2.5 text-sm font-bold bg-brand-orange text-gray-900 rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg">
                                Signup
                            </button>
                        }
                    />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
