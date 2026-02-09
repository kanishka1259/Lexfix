// pages/teacher/DisabilityManagement.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DisabilityManagement.css';

export default function DisabilityManagement() {
    const { disabilityId } = useParams();
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        assignedStudents: [],
        dueDate: ''
    });

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/assignments/students/${disabilityId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const fetchAssignments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/assignments/disability/${disabilityId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchAssignments();
    }, [disabilityId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5001/api/assignments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    disability: disabilityId
                })
            });

            if (response.ok) {
                setShowCreateForm(false);
                setFormData({
                    title: '',
                    description: '',
                    content: '',
                    assignedStudents: [],
                    dueDate: ''
                });
                fetchAssignments();
            }
        } catch (error) {
            console.error('Error creating assignment:', error);
        }
    };

    const toggleStudent = (studentId) => {
        setFormData(prev => ({
            ...prev,
            assignedStudents: prev.assignedStudents.includes(studentId)
                ? prev.assignedStudents.filter(id => id !== studentId)
                : [...prev.assignedStudents, studentId]
        }));
    };

    return (
        <div className="disability-management">
            <header className="management-header">
                <h1>{disabilityId.toUpperCase()} Management</h1>
                <button
                    className="create-btn"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? '✕ Cancel' : '+ Create Assignment'}
                </button>
            </header>

            {showCreateForm && (
                <div className="create-form-card">
                    <h2>Create New Assignment</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Content (will be split into sentences for reading)</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows="8"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Assign to Students</label>
                            <div className="student-checkboxes">
                                {students.map(student => (
                                    <label key={student._id} className="student-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={formData.assignedStudents.includes(student._id)}
                                            onChange={() => toggleStudent(student._id)}
                                        />
                                        <span>{student.name} ({student.email})</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="submit-btn">Create Assignment</button>
                    </form>
                </div>
            )}

            <div className="assignments-list">
                <h2>Existing Assignments</h2>
                {assignments.length === 0 ? (
                    <p className="no-data">No assignments yet. Create one to get started!</p>
                ) : (
                    assignments.map(assignment => (
                        <div key={assignment._id} className="assignment-card">
                            <h3>{assignment.title}</h3>
                            <p>{assignment.description}</p>
                            <div className="assignment-meta">
                                <span>📅 {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</span>
                                <span>👥 {assignment.assignedStudents.length} students</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
