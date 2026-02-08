import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ParentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChildrenData = async () => {
            try {
                const token = localStorage.getItem('token');

                // 1. Get children list from ADHD Backend (Port 5001)
                const childrenRes = await axios.get('http://localhost:5001/api/parent/children', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const childrenList = childrenRes.data;

                // 2. Fetch progress and assignments for each child
                const childrenWithData = await Promise.all(childrenList.map(async (child) => {
                    try {
                        const progressRes = await axios.get(`http://localhost:5001/api/parent/child/${child._id}/progress`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        return {
                            ...child,
                            statistics: progressRes.data.statistics,
                            submissions: progressRes.data.submissions
                        };
                    } catch (e) {
                        console.error(`Failed to fetch tasks for ${child.name}`, e);
                        return { ...child, statistics: null, submissions: [] };
                    }
                }));

                setChildren(childrenWithData);
            } catch (error) {
                console.error("Error fetching children's data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchChildrenData();
    }, [user]);

    return (
        <div className="dashboard-container" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                <div>
                    <h1 style={{ margin: 0 }}>Parent Dashboard</h1>
                    <p style={{ color: '#666' }}>Welcome back, {user?.name}</p>
                </div>
                <button onClick={() => { logout(); navigate('/'); }} style={{ padding: '10px 20px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer' }}>Sign Out</button>
            </header>

            <section className="children-section">
                <h2 style={{ marginBottom: '25px' }}>Linked Student Progress</h2>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <p>Syncing data from learning modules...</p>
                    </div>
                ) : children.length > 0 ? (
                    <div className="children-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
                        {children.map(child => (
                            <div key={child._id} className="child-card" style={{ padding: '25px', border: '1px solid #e0e0e0', borderRadius: '15px', background: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{child.name}</h3>
                                        <span style={{ fontSize: '0.85rem', padding: '4px 10px', background: '#e1f5fe', color: '#01579b', borderRadius: '20px', textTransform: 'uppercase', fontWeight: 600 }}>
                                            {child.disability} Path
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '1.5rem' }}>🎓</div>
                                </div>

                                <div className="tasks-summary">
                                    <h4 style={{ fontSize: '1rem', borderTop: '1px solid #f0f0f0', paddingTop: '15px', marginTop: '15px' }}>Progress Statistics</h4>
                                    {child.statistics ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                                            <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>Completed</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2ecc71' }}>{child.statistics.completedAssignments}</div>
                                            </div>
                                            <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>In Progress</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f39c12' }}>{child.statistics.inProgressAssignments}</div>
                                            </div>
                                            <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>Avg. Focus</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#3498db' }}>{child.statistics.totalDistractions === 0 ? 'High' : child.statistics.totalDistractions > 5 ? 'Low' : 'Med'}</div>
                                            </div>
                                            <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px' }}>
                                                <div style={{ fontSize: '0.75rem', color: '#666' }}>Time Spent</div>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#9b59b6' }}>{Math.floor(child.statistics.totalTimeSpent / 60)}m</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ color: '#999', fontStyle: 'italic', fontSize: '0.8rem' }}>No session data yet.</p>
                                    )}

                                    <h4 style={{ fontSize: '0.9rem', color: '#444' }}>Recent Submissions</h4>
                                    {child.submissions && child.submissions.length > 0 ? (
                                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {child.submissions.slice(0, 5).map(sub => (
                                                <div key={sub._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #fafafa' }}>
                                                    <span style={{ fontSize: '0.85rem' }}>{sub.assignment?.title || 'Unknown Task'}</span>
                                                    <span style={{ fontSize: '0.75rem', color: sub.status === 'completed' ? '#2ecc71' : '#f39c12', fontWeight: 600 }}>
                                                        {sub.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p style={{ color: '#999', fontStyle: 'italic', fontSize: '0.8rem' }}>No recent activity.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '60px', background: '#fcfcfc', border: '2px dashed #eee', borderRadius: '20px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>👨‍👩‍👧‍👦</div>
                        <h3>No Students Linked</h3>
                        <p style={{ color: '#666', maxWidth: '400px', margin: '0 auto' }}>
                            When your child registers, they must enter your email: <br />
                            <strong style={{ color: '#000' }}>{user?.email}</strong>
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default ParentDashboard;
