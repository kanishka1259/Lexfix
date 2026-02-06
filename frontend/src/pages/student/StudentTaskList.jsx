// pages/student/StudentTaskList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './StudentTaskList.css';

export default function StudentTaskList() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/assignments/my-assignments', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (dueDate) => {
        if (!dueDate) return <span className="badge neutral">No Due Date</span>;
        const due = new Date(dueDate);
        const now = new Date();
        const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

        if (daysLeft < 0) return <span className="badge overdue">Overdue</span>;
        if (daysLeft <= 2) return <span className="badge urgent">Due Soon</span>;
        return <span className="badge active">Active</span>;
    };

    const startAssignment = (assignment) => {
        navigate(`/student/read/${assignment._id}`);
    };

    return (
        <div className="student-task-list">
            <header className="task-header">
                <div>
                    <h1>👋 Hi, {user?.name}!</h1>
                    <p>Your {user?.disability?.toUpperCase()} learning assignments</p>
                </div>
            </header>

            <div className="task-container">
                {loading ? (
                    <div className="loading">Loading your assignments...</div>
                ) : assignments.length === 0 ? (
                    <div className="no-assignments">
                        <p>🎉 No assignments yet! Check back later.</p>
                    </div>
                ) : (
                    <div className="task-grid">
                        {assignments.map(assignment => (
                            <div key={assignment._id} className="task-card">
                                <div className="card-header">
                                    <h3>{assignment.title}</h3>
                                    {getStatusBadge(assignment.dueDate)}
                                </div>

                                <p className="task-description">
                                    {assignment.description || 'No description provided'}
                                </p>

                                <div className="card-footer">
                                    <div className="task-info">
                                        <span>📚 {assignment.sentences?.length || 0} sentences</span>
                                        {assignment.dueDate && (
                                            <span>📅 Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                        )}
                                    </div>

                                    <button
                                        className="start-btn"
                                        onClick={() => startAssignment(assignment)}
                                    >
                                        Start Reading →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
