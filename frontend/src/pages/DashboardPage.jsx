import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TeacherDashboard from './teacher/TeacherDashboard';
import ParentDashboard from './ParentDashboard';
import StudentDashboard from './StudentDashboard';

const DashboardPage = () => {
    const { user } = useAppContext();
    const navigate = useNavigate();

    // Redirect if not logged in
    React.useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) return null;

    // Normalize role string
    const role = (user.role || user.userType || 'student').toLowerCase();

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 mt-20">
                {role === 'teacher' && <TeacherDashboard user={user} />}
                {role === 'parent' && <ParentDashboard user={user} />}
                {role === 'student' && <StudentDashboard user={user} />}
            </div>
        </div>
    );
};

export default DashboardPage;
