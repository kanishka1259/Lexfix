import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TeacherDashboard from './dashboards/TeacherDashboard';
import StudentDashboard from './dashboards/StudentDashboard';
import ParentDashboard from './dashboards/ParentDashboard';
import './ModuleDashboard.css';
import './dashboards/Dashboards.css';

const ModuleDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Give TokenHandler a moment to save the token if we just redirected
                await new Promise(resolve => setTimeout(resolve, 100));

                const token = localStorage.getItem('lexfix_token');
                if (!token) {
                    // Check if token is in URL (TokenHandler might not have processed it yet)
                    const params = new URLSearchParams(window.location.search);
                    if (params.get('token')) {
                        console.log("Token found in URL, waiting for TokenHandler...");
                        return;
                    }

                    console.log("No token found in storage or URL, redirecting to login");
                    window.location.href = 'http://localhost:5173';
                    return;
                }

                // Get user info
                console.log("Fetching /api/auth/me with token");
                const userRes = await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("User data received:", userRes.data);
                if (userRes.data.success) {
                    setUser(userRes.data.data);
                } else {
                    setUser(userRes.data.data); // Often data is direct
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setError("Failed to load user profile. Please login again.");
                // If 401, clear token
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('lexfix_token');
                    setTimeout(() => window.location.href = 'http://localhost:5173', 2000);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    const modules = [
        {
            id: 1,
            title: "1. Session Entry & Setup",
            description: "Initiate a focused learning session designed for ADHD minds.",
            route: "/module/entry"
        },
        {
            id: 2,
            title: "2. Content Presentation",
            description: "Experience single-task focus with our linear sentence-by-sentence reading interface.",
            route: "/module/content"
        },
        {
            id: 3,
            title: "3. Timer & Pacing",
            description: "Master time management with automatic timers and healthy break reminders.",
            route: "/module/pacing"
        },
        {
            id: 4,
            title: "4. Progress Tracking",
            description: "Visualize your achievements with real-time feedback.",
            route: "/module/progress"
        },
        {
            id: 5,
            title: "5. Review & Completion",
            description: "Celebrate your success and review your learning session insights.",
            route: "/module/completion"
        }
    ];

    const handleModuleClick = (route) => {
        navigate(route);
    };

    const handleLogout = () => {
        localStorage.removeItem('lexfix_token');
        window.location.href = 'http://localhost:5173';
    };

    if (loading) return (
        <div className="dashboard-container">
            <div className="loading-screen">Loading your workspace...</div>
        </div>
    );

    if (error) return (
        <div className="dashboard-container">
            <div className="error-screen">
                <h3>{error}</h3>
                <button onClick={handleLogout} className="primary-btn">Back to Login</button>
            </div>
        </div>
    );

    const renderDashboard = () => {
        if (!user) return null;

        // Normalizing role to handle potential case differences
        const role = user.role ? user.role.toLowerCase() : '';
        console.log("Rendering dashboard for role:", role);

        switch (role) {
            case 'teacher':
                return <TeacherDashboard user={user} />;
            case 'parent':
                return <ParentDashboard user={user} />;
            case 'student':
                return <StudentDashboard user={user} modules={modules} handleModuleClick={handleModuleClick} />;
            default:
                // Default to Student view but maybe show warning? 
                // Using Student dashboard as safe default
                return <StudentDashboard user={user} modules={modules} handleModuleClick={handleModuleClick} />;
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <div>
                        <h1>ADHD Learning Hub</h1>
                        <p className="subtitle">Welcome back, {user?.name}</p>
                    </div>
                    <div className="header-actions">
                        <span className="role-badge">{user?.role} Mode</span>
                        <button onClick={handleLogout} className="logout-btn">
                            Sign Out
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
