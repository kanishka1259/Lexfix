import { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDashboard = ({ user }) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskContent, setTaskContent] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [students, setStudents] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [recentTasks, setRecentTasks] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fetch students on component mount
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Get token from the stored user object
                const storedUser = localStorage.getItem('user');
                const userData = storedUser ? JSON.parse(storedUser) : null;
                const token = userData?.token || localStorage.getItem('lexfix_token');

                console.log("Token available:", !!token); // Debug

                if (!token) {
                    setMessage("Authentication token missing. Please login again.");
                    setLoading(false);
                    return;
                }

                console.log("Fetching students from http://localhost:5000/api/auth/students");
                const response = await axios.get('http://localhost:5000/api/auth/students', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Students fetched:", response.data);

                if (response.data.success) {
                    // Filter for ADHD students only
                    const adhdStudents = response.data.data.filter(s => {
                        const hasDisability = (d) => {
                            if (Array.isArray(d)) return d.some(x => x.toLowerCase().includes('adhd'));
                            return d && d.toLowerCase().includes('adhd');
                        };
                        return hasDisability(s.disability) || hasDisability(s.disabilities);
                    });
                    setStudents(adhdStudents);
                } else {
                    setMessage("Failed to retrieve students.");
                }
            } catch (error) {
                console.error("Failed to fetch students:", error);
                const errorMsg = error.response?.data?.message || error.message;
                setMessage(`Error loading student list: ${errorMsg}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const handleCheckboxChange = (studentId) => {
        setSelectedStudents(prev => {
            if (prev.includes(studentId)) {
                return prev.filter(id => id !== studentId);
            } else {
                return [...prev, studentId];
            }
        });
    };

    const handleAssignTask = async (e) => {
        e.preventDefault();
        if (selectedStudents.length === 0) {
            setMessage("Please select at least one student.");
            return;
        }

        setMessage("Assigning tasks...");

        try {
            const storedUser = localStorage.getItem('user');
            const token = storedUser ? JSON.parse(storedUser).token : null;

            // Loop through selected students and create tasks for each
            const assignmentPromises = selectedStudents.map(studentId => {
                const payload = {
                    title: taskTitle,
                    content: taskContent, // Send raw content or formatted array if backend expects it
                    studentId: studentId,
                    assignedBy: user._id || user.id
                };

                // Note: File upload temporarily disabled as backend needs Multer configuration
                // if (selectedFile) { ... }

                return axios.post('http://localhost:5000/api/tasks/create', payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            });

            await Promise.all(assignmentPromises);

            setMessage(`Successfully assigned task to ${selectedStudents.length} student(s)!`);
            setTaskTitle('');
            setTaskContent('');
            setSelectedStudents([]);
            setSelectedFile(null);
            // Clear file input manually if needed
            const fileInput = document.getElementById('file-upload');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error("Assignment error:", error);
            const errorDetail = error.response?.data?.message || error.message;
            setMessage(`Failed to assign task. Detail: ${errorDetail}`);
        }
    };

    return (
        <div className="teacher-dashboard">
            <div className="dashboard-welcome">
                <h2>Teacher Control Center</h2>
                <p>Manage your classroom, assign content, and track student performance.</p>
            </div>

            <div className="dashboard-grid">
                {/* Left Column: Create Task */}
                <div className="task-creation-card">
                    <div className="card-header">
                        <div className="icon-wrapper">📝</div>
                        <h3>Create New Assignment</h3>
                    </div>

                    <form onSubmit={handleAssignTask}>
                        <div className="form-group">
                            <label>Assignment Title</label>
                            <input
                                type="text"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                placeholder="e.g., Biology: The Cell Structure"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Select Students</label>
                            <div className="student-selection-list">
                                {loading ? (
                                    <p className="loading-text">Loading students...</p>
                                ) : students.length > 0 ? (
                                    students.map(student => (
                                        <div key={student._id} className="student-checkbox-item">
                                            <label className="checkbox-container">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student._id)}
                                                    onChange={() => handleCheckboxChange(student._id)}
                                                />
                                                <span className="checkmark"></span>
                                                <div className="student-info-label">
                                                    <span className="student-name">{student.name}</span>
                                                    <span className="student-email">{student.email}</span>
                                                </div>
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-students">No students found in the system.</p>
                                )}
                            </div>
                            <small className="helper-text">{selectedStudents.length} student(s) selected</small>
                        </div>

                        <div className="form-group">
                            <label>Learning Content</label>
                            <div className="textarea-wrapper">
                                <textarea
                                    value={taskContent}
                                    onChange={(e) => setTaskContent(e.target.value)}
                                    placeholder="Paste the lesson text here..."
                                    rows="8"
                                    required
                                ></textarea>
                                <small className="helper-text">Text will be auto-formatted for ADHD-focused reading.</small>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Attachments (Optional)</label>
                            <div className="file-upload-wrapper">
                                <input
                                    type="file"
                                    id="file-upload"
                                    disabled
                                    className="file-input opacity-50 cursor-not-allowed"
                                />
                                <p className="file-help">File uploads coming soon. Please paste content above.</p>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="primary-btn">
                                <span>Publish Assignment</span>
                                <span className="btn-icon">→</span>
                            </button>
                        </div>

                        {message && (
                            <div className={`notification ${message.includes('Failed') || message.includes('select') ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>

                {/* Right Column: Recent Activity & Quick Stats */}
                <div className="dashboard-sidebar">
                    <div className="sidebar-card stats-summary">
                        <h3>Classroom Overview</h3>
                        <div className="stat-row">
                            <div className="mini-stat">
                                <span className="stat-number">{students.length}</span>
                                <span className="stat-label">Total Students</span>
                            </div>
                            <div className="mini-stat">
                                <span className="stat-number">{selectedStudents.length}</span>
                                <span className="stat-label">Selected</span>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-card recent-assignments">
                        <h3>Recent Assignments</h3>
                        <div className="assignment-list">
                            {recentTasks.length > 0 ? (
                                recentTasks.map(task => (
                                    <div key={task._id} className="assignment-item">
                                        <div className="assignment-info">
                                            <h4>{task.title}</h4>
                                            <span className="assignment-date">
                                                {new Date(task.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <span className="status-badge completed">Active</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted" style={{ fontSize: '0.9rem', color: '#888' }}>No tasks assigned yet.</p>
                            )}
                        </div>
                        {recentTasks.length > 0 && <button className="view-all-btn">View All History</button>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
