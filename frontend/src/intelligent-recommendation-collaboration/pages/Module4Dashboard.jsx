import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Module4Dashboard = () => {
    const location = useLocation();
    // Check if we are on the main module4 path (which renders Module4Home via index route)
    // The path could be "/module4" or "/module4/"
    const isHome = location.pathname === '/module4' || location.pathname === '/module4/';

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-800">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                    <Link to="/module4" className="text-xl font-bold text-[#5A4A42] tracking-tight hover:opacity-80 transition-opacity">
                        Lexfix Recommendation
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    {/* Only show nav links if NOT on home page, or always show them? 
                        The screenshot doesn't show nav links, but for usability we might want them. 
                        Let's keep them but make them subtle or only when deep in app. 
                        For now, let's hide them on Home to match "clean" look. */}
                    {!isHome && (
                        <div className="flex gap-6 text-sm font-medium text-gray-500 mr-4">
                            <Link to="/module4/recommendations" className={`hover:text-[#8B5E3C] transition-colors ${location.pathname.includes('recommendation') ? 'text-[#8B5E3C]' : ''}`}>Recommendations</Link>
                            <Link to="/module4/learning-path" className={`hover:text-[#8B5E3C] transition-colors ${location.pathname.includes('learning-path') ? 'text-[#8B5E3C]' : ''}`}>Learning Path</Link>
                            <Link to="/module4/collaboration" className={`hover:text-[#8B5E3C] transition-colors ${location.pathname.includes('collaboration') ? 'text-[#8B5E3C]' : ''}`}>Study Group</Link>
                        </div>
                    )}
                    <span className="bg-[#F5EBE0] text-[#5A4A42] text-xs font-bold px-3 py-1 rounded-full">
                        Module 4
                    </span>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="p-6 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
                <Outlet />
            </main>
        </div>
    );
};

export default Module4Dashboard;
