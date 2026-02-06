import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';

const StudentDashboard = () => {
    const { disability } = useParams();
    const { logout } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (disability === 'adhd' && token) {
            // Auto-redirect ADHD students to their module internally
            navigate('/adhd');
        }
    }, [disability, navigate]);

    return (
        <div className="dashboard-container" style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Student Dashboard</h1>
            <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '15px', display: 'inline-block' }}>
                <p style={{ fontSize: '1.2rem' }}>Your learning path: <strong style={{ color: '#4a90e2' }}>{disability?.toUpperCase()}</strong></p>
                <p>Personalized tools for {disability} are loading...</p>

                {disability !== 'adhd' && (
                    <div style={{ marginTop: '20px' }}>
                        <p style={{ color: '#666' }}>The {disability} module is currently being prepared for you.</p>
                        <button
                            onClick={() => { logout(); navigate('/'); }}
                            style={{
                                marginTop: '20px',
                                padding: '10px 20px',
                                background: '#ff4d4d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
