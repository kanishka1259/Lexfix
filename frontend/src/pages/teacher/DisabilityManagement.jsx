// pages/teacher/DisabilityManagement.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
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

    useEffect(() => {
        fetchStudents();
        fetchAssignments();
    }, [disabilityId]);

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/assignments/students/${disabilityId}`, {
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
            const response = await fetch(`http://localhost:5000/api/assignments/disability/${disabilityId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/assignments', {
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
        <DashboardLayout title={`${disabilityId} Management`}>
            <div className="disability-management">
                <header className="management-header-simple">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">{disabilityId} Management</h1>
                            <p className="text-gray-500">Create assignments and track student progress</p>
                        </div>
                        <button
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                            onClick={() => setShowCreateForm(!showCreateForm)}
                        >
                            {showCreateForm ? '✕ Cancel' : '+ Create Assignment'}
                        </button>
                    </div>
                </header>

                {showCreateForm && (
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8 animate-fade-in-down">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Create New Assignment</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content (will be split into sentences)</label>
                                <textarea
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows="6"
                                    required
                                    placeholder="Enter reading material here..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Students</label>
                                    <div className="max-h-40 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                                        {students.length === 0 ? (
                                            <p className="text-sm text-gray-400 italic p-2">No students found for {disabilityId}</p>
                                        ) : (
                                            students.map(student => (
                                                <label key={student._id} className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                                        checked={formData.assignedStudents.includes(student._id)}
                                                        onChange={() => toggleStudent(student._id)}
                                                    />
                                                    <span className="text-sm text-gray-700">{student.name}</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                                    Create Assignment
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="assignments-list">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Existing Assignments</h2>
                    {assignments.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No assignments created yet.</p>
                            <button onClick={() => setShowCreateForm(true)} className="text-indigo-600 font-semibold mt-2 hover:underline">Create your first one</button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {assignments.map(assignment => (
                                <div key={assignment._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">{assignment.title}</h3>
                                            <p className="text-gray-600 mt-1">{assignment.description}</p>
                                        </div>
                                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {assignment.assignedStudents.length} Students
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 border-t pt-4">
                                        <span>📅 Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'None'}</span>
                                        <span>📄 {assignment.content ? assignment.content.substring(0, 30) + '...' : 'No content'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
