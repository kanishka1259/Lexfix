import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';
import { Type, ArrowLeft } from 'lucide-react'; // Icon for font toggle

const Navbar = () => {
    const { userType, setUserType, user, logout, isDyslexic, setIsDyslexic } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Define root paths where back button should NOT show
    const rootPaths = ['/', '/dashboard', '/teacher-hub', '/parent-dashboard', '/student-tasks'];
    const showBackArrow = !rootPaths.includes(location.pathname);

    const getButtonClass = (type) => {
        const isActive = userType === type;
        const baseClass = "px-6 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm";
        return isActive
            ? `${baseClass} bg-[#c9e7ff] text-[#1e40af] border border-[#bfdbfe]`
            : `${baseClass} bg-[#f1f5f9] text-[#475569] border border-transparent hover:bg-[#e2e8f0]`;
    };

    return (
        <nav className="fixed top-0 left-0 w-full h-20 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 z-50 flex items-center justify-between px-4 md:px-10 transition-all duration-300">
            <div className="flex items-center gap-4 lg:gap-8">
                {/* Back Arrow - Conditional */}
                {showBackArrow && (
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        title="Go Back"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                )}

                {/* Logo */}
                <div className="flex items-center">
                    <img src="/LexFix-Logo.png" alt="LexFix Logo" className="h-6 md:h-8 w-auto object-contain cursor-pointer" onClick={() => window.location.href = '/'} />
                </div>

                {/* Persona Selectors - ALWAYS show these */}
                <div className="hidden md:flex items-center gap-2 lg:gap-4">
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
                {/* Font Toggle */}
                <button
                    onClick={() => setIsDyslexic(!isDyslexic)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${isDyslexic
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                        }`}
                    title="Toggle OpenDyslexic Font"
                >
                    <Type className="w-4 h-4" />
                    <span className="hidden sm:inline">Dyslexic Font</span>
                </button>

                {/* Auth Buttons */}
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden lg:block">
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">{user.role}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="px-4 py-2 text-sm font-bold text-red-600 border border-red-100 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <LoginModal
                            trigger={
                                <button className="px-8 py-2.5 text-sm font-bold text-gray-900 border border-black rounded-lg hover:bg-gray-50 transition-colors">
                                    Log In
                                </button>
                            }
                        />
                        <SignupModal
                            trigger={
                                <button className="px-8 py-2.5 text-sm font-bold bg-brand-orange text-gray-900 rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg">
                                    Sign Up
                                </button>
                            }
                        />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
