// pages/TeacherDashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

export default function TeacherDashboard() {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [students, setStudents] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: [''],
        difficulty: 'Medium',
        estimatedTime: 10
    });

    useEffect(() => {
        fetchTasks();
        fetchStudents();
    }, []);

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/tasks', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setTasks(data);
    };

    const fetchStudents = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/tasks/students', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setStudents(data);
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:5000/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            setShowCreateForm(false);
            setFormData({
                title: '',
                description: '',
                content: [''],
                difficulty: 'Medium',
                estimatedTime: 10
            });
            fetchTasks();
        }
    };

    const addContentField = () => {
        setFormData({
            ...formData,
            content: [...formData.content, '']
        });
    };

    const updateContent = (index, value) => {
        const newContent = [...formData.content];
        newContent[index] = value;
        setFormData({ ...formData, content: newContent });
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>👨‍🏫 Teacher Dashboard</h1>
                    <p>Welcome back, {user.name}!</p>
                </div>
                <button onClick={logout} className="btn-logout">Logout</button>
            </header>

            <div className="dashboard-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-info">
                            <h3>Total Tasks</h3>
                            <p className="stat-number">{tasks.length}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👨‍🎓</div>
                        <div className="stat-info">
                            <h3>Total Students</h3>
                            <p className="stat-number">{students.length}</p>
                        </div>
                    </div>
                </div>

                <div className="action-section">
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="btn-primary"
                    >
                        {showCreateForm ? '✕ Cancel' : '+ Create New Task'}
                    </button>
                </div>

                {showCreateForm && (
                    <div className="create-task-form">
                        <h2>Create New Task</h2>
                        <form onSubmit={handleCreateTask}>
                            <div className="form-group">
                                <label>Task Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="form-input"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Content (Sentences for ADHD Mode)</label>
                                {formData.content.map((sentence, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        className="form-input"
                                        placeholder={`Sentence ${index + 1}`}
                                        value={sentence}
                                        onChange={(e) => updateContent(index, e.target.value)}
                                        required
                                    />
                                ))}
                                <button type="button" onClick={addContentField} className="btn-secondary">
                                    + Add Sentence
                                </button>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Difficulty</label>
                                    <select
                                        className="form-input"
                                        value={formData.difficulty}
                                        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                    >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Estimated Time (minutes)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.estimatedTime}
                                        onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                                        min="1"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary">Create Task</button>
                        </form>
                    </div>
                )}

                <div className="tasks-section">
                    <h2>My Tasks</h2>
                    <div className="tasks-list">
                        {tasks.map((task) => (
                            <div key={task._id} className="task-card">
                                <div className="task-header">
                                    <h3>{task.title}</h3>
                                    <span className={`badge badge-${task.difficulty.toLowerCase()}`}>
                                        {task.difficulty}
                                    </span>
                                </div>
                                <p className="task-description">{task.description}</p>
                                <div className="task-meta">
                                    <span>⏱ {task.estimatedTime} min</span>
                                    <span>📝 {task.content.length} sentences</span>
                                    <span>👥 {task.assignedTo?.length || 0} students</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
