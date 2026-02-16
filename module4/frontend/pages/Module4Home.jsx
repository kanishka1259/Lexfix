import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Module4Home = () => {
    const navigate = useNavigate();
    const [tokenInput, setTokenInput] = useState('');

    const handleSaveToken = () => {
        if (tokenInput) {
            // Simple hack to save token for demo purposes if user pastes it
            const dummyUser = { token: tokenInput, data: { token: tokenInput } };
            localStorage.setItem('userInfo', JSON.stringify(dummyUser));
            localStorage.setItem('token', tokenInput);
            alert("Token Saved!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Your Learning <span className="text-[#8B5E3C]">Hub</span>
            </h1>
            <p className="text-gray-500 mb-12">Select a module to begin your adaptive journey.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                {/* Card 1: Learning Path */}
                <div
                    onClick={() => navigate('learning-path')}
                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center relative group"
                >
                    <span className="absolute top-4 right-4 text-xs text-gray-300 font-mono">01</span>
                    <div className="w-16 h-16 bg-[#F5EBE0] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#EEDBC0] transition-colors">
                        {/* Icon placeholder - Path/Map */}
                        <span className="text-2xl text-[#8B5E3C]">⚡</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#5A4A42] mb-3">Learning Path</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Your personalized roadmap. Adaptive lessons sorted by difficulty.
                    </p>
                </div>

                {/* Card 2: Recommendations */}
                <div
                    onClick={() => navigate('recommendations')}
                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center relative group"
                >
                    <span className="absolute top-4 right-4 text-xs text-gray-300 font-mono">02</span>
                    <div className="w-16 h-16 bg-[#F5EBE0] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#EEDBC0] transition-colors">
                        {/* Icon placeholder - Eye/Focus */}
                        <span className="text-2xl text-[#8B5E3C]">👁️</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#5A4A42] mb-3">Recommendations</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        AI-curated suggestions based on your recent performance streaks.
                    </p>
                </div>

                {/* Card 3: Study Group */}
                <div
                    onClick={() => navigate('collaboration')}
                    className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center relative group"
                >
                    <span className="absolute top-4 right-4 text-xs text-gray-300 font-mono">03</span>
                    <div className="w-16 h-16 bg-[#F5EBE0] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#EEDBC0] transition-colors">
                        {/* Icon placeholder - Group */}
                        <span className="text-2xl text-[#8B5E3C]">👥</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#5A4A42] mb-3">Study Group</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Join Room 101. Chat live with peers and solve problems together.
                    </p>
                </div>
            </div>

            {/* Footer Section - Pinned to Bottom */}
            <div className="w-full flex flex-col items-center pb-8 mt-auto">
                {/* Auth Token Input (from screenshot) */}
                <div className="bg-white p-2 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-4 max-w-2xl w-full">
                    <div className="flex items-center gap-2 pl-3">
                        <div className="w-2 h-2 rounded-full bg-[#8B5E3C]"></div>
                        <span className="text-sm font-bold text-[#5A4A42] whitespace-nowrap">Auth Token:</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Paste from Main App..."
                        className="flex-1 px-4 py-2 text-sm text-gray-600 bg-transparent border-b border-gray-100 focus:border-[#8B5E3C] outline-none transition-colors placeholder:text-gray-300 font-medium"
                        value={tokenInput}
                        onChange={(e) => setTokenInput(e.target.value)}
                    />
                    <button
                        onClick={handleSaveToken}
                        className="text-xs font-bold text-[#8B5E3C] border border-gray-200 rounded px-5 py-2 hover:bg-[#F5EBE0] hover:border-[#8B5E3C] transition-all uppercase tracking-wider shadow-sm"
                    >
                        SAVE
                    </button>
                </div>

                {/* Footer Links */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs font-medium text-gray-400">
                    <button className="hover:text-[#8B5E3C] transition-colors flex items-center gap-1">
                        Review Queue <span className="font-bold text-gray-300 transform translate-y-[-1px]">3</span>
                    </button>
                    <div className="h-3 w-[1px] bg-gray-300"></div>
                    <button onClick={() => navigate('performance')} className="hover:text-[#8B5E3C] transition-colors">
                        Log Manual Data
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Module4Home;
