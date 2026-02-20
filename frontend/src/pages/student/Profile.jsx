import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useDyslexiaFontContext } from '@reading-support/components/dyslexia-font/DyslexiaFontProvider'
import { useTTS } from '@reading-support/components/tts/TTSProvider'
import Navbar from '../../components/Navbar';
import { User, Mail, Shield, Copy, Check, Settings, Eye, EyeOff, Layout, Bell } from 'lucide-react';

const Profile = () => {
    const { user } = useAppContext();
    const { font, toggleFont } = useDyslexiaFontContext();
    const { rate, setRate } = useTTS();
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState('account');

    const studentId = user?.id || user?._id || 'N/A';

    const handleCopyId = () => {
        navigator.clipboard.writeText(studentId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: 'account', label: 'Account Info', icon: User },
        { id: 'preferences', label: 'Preferences', icon: Settings },
        { id: 'accessibility', label: 'Accessibility', icon: Layout },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />
            <div className="pt-24 pb-12 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-8">

                        {/* Sidebar / Tabs */}
                        <div className="w-full md:w-64 flex flex-col gap-2">
                            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4 text-center">
                                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <User className="w-10 h-10 text-blue-600" />
                                </div>
                                <h2 className="font-bold text-slate-800 text-lg">{user?.name}</h2>
                                <p className="text-slate-500 text-sm uppercase tracking-wider font-semibold">{user?.role}</p>
                            </div>

                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
                                        }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                            {activeTab === 'account' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Account Information</h3>

                                    <div className="space-y-6">
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Student ID</label>
                                            <div className="flex items-center justify-between gap-4">
                                                <code className="text-lg font-mono text-blue-700 font-bold break-all">{studentId}</code>
                                                <button
                                                    onClick={handleCopyId}
                                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                                                        }`}
                                                >
                                                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                    <span className="text-sm font-semibold">{copied ? 'Copied!' : 'Copy'}</span>
                                                </button>
                                            </div>
                                            <p className="text-slate-400 text-xs mt-3">Ready to share with parents or teachers for account linking.</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="p-4 border border-slate-100 rounded-xl">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-orange-50 rounded-lg"><User className="w-4 h-4 text-orange-500" /></div>
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                                                </div>
                                                <p className="text-slate-800 font-semibold pl-9">{user?.name || 'N/A'}</p>
                                            </div>

                                            <div className="p-4 border border-slate-100 rounded-xl">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-blue-50 rounded-lg"><Mail className="w-4 h-4 text-blue-500" /></div>
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                                                </div>
                                                <p className="text-slate-800 font-semibold pl-9">{user?.email || 'N/A'}</p>
                                            </div>

                                            <div className="p-4 border border-slate-100 rounded-xl">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-purple-50 rounded-lg"><Shield className="w-4 h-4 text-purple-500" /></div>
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">User Role</label>
                                                </div>
                                                <p className="text-slate-800 font-semibold pl-9 capitalize">{user?.role || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'preferences' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Usage Preferences</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div>
                                                <p className="font-bold text-slate-700">Display Email to Teachers</p>
                                                <p className="text-xs text-slate-500">Allow verified teachers to see your contact info.</p>
                                            </div>
                                            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div>
                                                <p className="font-bold text-slate-700">Daily Reminder</p>
                                                <p className="text-xs text-slate-500">Get a notification to keep up your learning streak.</p>
                                            </div>
                                            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'accessibility' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Accessibility Settings</h3>

                                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 mb-6">
                                        <div className="flex items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-amber-200/50 rounded-lg"><Layout className="w-5 h-5 text-amber-700" /></div>
                                                    <h4 className="font-bold text-amber-900 text-lg">OpenDyslexic Font</h4>
                                                </div>
                                                <p className="text-amber-800/80 text-sm leading-relaxed">
                                                    A typeface designed to mitigate some of the common reading errors caused by dyslexia.
                                                    When enabled, the entire platform will use this font.
                                                </p>
                                            </div>
                                            <button
                                                onClick={toggleFont}
                                                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none ${font === 'opendyslexic' ? 'bg-amber-600' : 'bg-amber-200'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${font === 'opendyslexic' ? 'translate-x-9' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 border border-slate-100 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed">
                                            <span className="text-slate-700 font-semibold">High Contrast Mode</span>
                                            <div className="w-10 h-5 bg-slate-200 rounded-full"></div>
                                        </div>
                                        <div className="p-4 border border-slate-100 rounded-xl flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-slate-700 font-semibold">Text-to-Speech Speed</span>
                                                <span className="text-slate-500 font-mono text-xs">{rate.toFixed(1)}x</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0.5"
                                                max="2.0"
                                                step="0.1"
                                                value={rate}
                                                onChange={(e) => setRate(parseFloat(e.target.value))}
                                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-in-from-bottom {
                    from { transform: translateY(1rem); }
                    to { transform: translateY(0); }
                }
                .animate-in {
                    animation-name: fade-in, slide-in-from-bottom;
                    animation-fill-mode: forwards;
                }
            `}</style>
            </div>
        </div>
    );
};

export default Profile;
