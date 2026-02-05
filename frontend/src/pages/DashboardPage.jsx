import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import TeacherDashboard from './teacher/TeacherDashboard';
import ParentDashboard from './ParentDashboard';  // Assuming this exists at root or pages
import StudentDashboard from './StudentDashboard'; // Assuming this exists at root or pages

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

    const userTypeString = user.userType || 'student';
    // Normalize role string
    const role = userTypeString.toLowerCase();

    console.log("DashboardPage Debug:", { user, userTypeString, role });

    // Dispatch to specific dashboards based on role
    if (role === 'teacher') {
        return <TeacherDashboard />;
    }

    if (role === 'parent') {
        return <ParentDashboard />;
    }

    if (role === 'student') {
        // If there's a specific Student Hub, use it. 
        // Otherwise, render the generic student view here or use StudentDashboard component
        return <StudentDashboard />;
    }

    // Fallback for unknown roles (or if StudentDashboard isn't desired for base student)
    return (
        <div className="min-h-screen bg-brand-cream p-8">
            <header className="flex justify-between items-center mb-12">
                {/* ... (keep existing header for fallback) ... */}
                <div className="flex items-center gap-4">
                    <img src="/LexFix-Logo.png" alt="LexFix Logo" className="h-12 w-auto object-contain" />
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                </div>
                <button onClick={logout}>Log Out</button>
            </header>
            <main>
                <h2>Unknown Role: {role}</h2>
            </main>
        </div>
    );
};

export default DashboardPage;
