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
    const { user, userType, logout } = useAppContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // user is loaded from AppContext
        if (user !== undefined) {
            setLoading(false);
        }
    }, [user]);

    const modules = [
        { id: 1, title: "1. Session Entry", route: "/adhd/module/entry" },
        { id: 2, title: "2. Content Presentation", route: "/adhd/module/content" },
        { id: 3, title: "3. Timer & Pacing", route: "/adhd/module/pacing" },
        { id: 4, title: "4. Progress Tracking", route: "/adhd/module/progress" },
        { id: 5, title: "5. Completion Review", route: "/adhd/module/completion" }
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
        const role = userType || user.userType || 'student';
        console.log("ModuleDashboard Detected Role:", role);

        switch (role.toLowerCase()) {
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
                    <div>
                        <h1>ADHD Learning Hub</h1>
                        <p className="subtitle">Welcome back, {user?.username || user?.name || 'Student'}</p>
                    </div>
                    <div className="header-actions">
                        <span className="role-badge">{(userType || 'Student')} Mode</span>
                        <button onClick={() => navigate('/dashboard')} className="logout-btn">
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
