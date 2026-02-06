import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import TeacherDashboard from './dashboards/TeacherDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import ParentDashboard from './dashboards/ParentDashboard';
import './ModuleDashboard.css';
import './dashboards/Dashboards.css';

const ModuleDashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAppContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // user is loaded from AppContext
        if (user !== undefined) {
            setLoading(false);
        }
    }, [user]);

    const modules = [
        { id: 1, title: "Study 1: Session Entry & Setup", route: "/adhd/module/entry" },
        { id: 2, title: "Study 2: Single-Task Content Presentation", route: "/adhd/module/content" },
        { id: 3, title: "Study 3: Timer & Pacing", route: "/adhd/module/pacing" },
        { id: 4, title: "Study 4: Progress Tracking & Feedback", route: "/adhd/module/progress" },
        { id: 5, title: "Study 5: Lesson Completion & Review", route: "/adhd/module/completion" }
    ];

    const handleModuleClick = (route) => {
        navigate(route);
    };

    if (loading) return <div className="loading-screen">Loading ADHD Hub...</div>;

    if (!user) {
        return (
            <div className="error-screen">
                <h3>Please log in to access the ADHD Hub.</h3>
                <button onClick={() => navigate('/')} className="primary-btn">Go to Login</button>
            </div>
        );
    }

    const renderDashboard = () => {
        // Robust role detection
        const role = user.role ? user.role.toLowerCase() : (user.userType ? user.userType.toLowerCase() : 'student');
        console.log("ModuleDashboard Detected Role:", role);

        switch (role) {
            case 'teacher': return <TeacherDashboard user={user} />;
            case 'parent': return <ParentDashboard user={user} />;
            case 'student': return <StudentDashboard user={user} modules={modules} handleModuleClick={handleModuleClick} />;
            default:
                return <StudentDashboard user={user} modules={modules} handleModuleClick={handleModuleClick} />;
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="navbar-brand">
                        <img src="/LexFix-Logo.png" alt="LexFix Logo" className="logo" onClick={() => navigate('/dashboard')} />
                    </div>

                    <div className="navbar-actions">
                        <div className="user-context">
                            <span className="welcome-text">Welcome back, <strong>{user?.name || user?.username}</strong></span>
                            <span className="role-badge">{(user?.role || user?.userType || 'Student')} Mode</span>
                        </div>
                        <button onClick={() => navigate('/dashboard')} className="exit-btn">
                            Exit Module
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                {renderDashboard()}
            </main>
        </div>
    );
};

export default ModuleDashboard;
