// pages/Register.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
        parentEmail: '',
        childEmail: '',
        disability: 'adhd'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const result = await register(formData);

        if (!result.success) {
            setError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>🎓 Create Account</h1>
                    <p>Join our learning community</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>I am a...</label>
                        <div className="role-selector">
                            <div className="role-option">
                                <input
                                    type="radio"
                                    id="student"
                                    name="role"
                                    value="student"
                                    checked={formData.role === 'student'}
                                    onChange={handleChange}
                                />
                                <label htmlFor="student" className="role-label">
                                    <span className="role-icon">👨‍🎓</span>
                                    <span className="role-name">Student</span>
                                </label>
                            </div>

                            <div className="role-option">
                                <input
                                    type="radio"
                                    id="teacher"
                                    name="role"
                                    value="teacher"
                                    checked={formData.role === 'teacher'}
                                    onChange={handleChange}
                                />
                                <label htmlFor="teacher" className="role-label">
                                    <span className="role-icon">👨‍🏫</span>
                                    <span className="role-name">Teacher</span>
                                </label>
                            </div>

                            <div className="role-option">
                                <input
                                    type="radio"
                                    id="parent"
                                    name="role"
                                    value="parent"
                                    checked={formData.role === 'parent'}
                                    onChange={handleChange}
                                />
                                <label htmlFor="parent" className="role-label">
                                    <span className="role-icon">👨‍👩‍👧</span>
                                    <span className="role-name">Parent</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-input"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="Create a password (min 6 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    {formData.role === 'student' && (
                        <>
                            <div className="form-group">
                                <label htmlFor="disability">Learning Disability</label>
                                <select
                                    id="disability"
                                    name="disability"
                                    className="form-input"
                                    value={formData.disability}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="adhd">ADHD</option>
                                    <option value="autism">Autism</option>
                                    <option value="dyslexia">Dyslexia</option>
                                    <option value="dyscalculia">Dyscalculia</option>
                                    <option value="dysgraphia">Dysgraphia</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="parentEmail">Parent's Email (Required for monitoring)</label>
                                <input
                                    type="email"
                                    id="parentEmail"
                                    name="parentEmail"
                                    className="form-input"
                                    placeholder="Enter parent's email"
                                    value={formData.parentEmail}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {formData.role === 'parent' && (
                        <div className="form-group">
                            <label htmlFor="childEmail">Child's Email (Required for linking)</label>
                            <input
                                type="email"
                                id="childEmail"
                                name="childEmail"
                                className="form-input"
                                placeholder="Enter student's email"
                                value={formData.childEmail}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`auth-btn btn-primary ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? <span className="spinner"></span> : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
}
