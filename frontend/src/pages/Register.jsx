import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();

    // Step 1: Role Selection, Step 2: Details
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        parentEmail: '',
        childEmail: '',
        disability: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRoleSelect = (role) => {
        setFormData({ ...formData, role });
        setStep(2);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.role === 'student' && !formData.disability) {
            setError('Please select a learning issue');
            setLoading(false);
            return;
        }

        const { confirmPassword, ...registerData } = formData;

        // Ensure backend compatibility fields
        const payload = {
            ...registerData,
            role: registerData.role,
            disability: registerData.role === 'student' ? registerData.disability : undefined,
            childEmail: registerData.role === 'parent' ? registerData.childEmail : undefined
        };

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.success || response.ok) {
                // After registration, navigate to login so they can auto-redirect
                navigate('/');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className={`register-card ${step === 1 ? 'wide-card' : ''}`}>
                <div className="register-header">
                    <h1>Create Your Account</h1>
                    <p>Join Lexfix's inclusive learning community</p>
                </div>

                {step === 1 ? (
                    <div className="role-selection-step">
                        <img
                            src="/assets/roles.png"
                            alt="Learning Community"
                            className="roles-banner"
                        />
                        <h2 className="step-title">I am a...</h2>
                        <div className="role-cards">
                            <button
                                className="role-card"
                                onClick={() => handleRoleSelect('student')}
                            >
                                <div className="role-icon">🎓</div>
                                <h3>Student</h3>
                                <p>I want to learn with focus.</p>
                            </button>
                            <button
                                className="role-card"
                                onClick={() => handleRoleSelect('teacher')}
                            >
                                <div className="role-icon">👩‍🏫</div>
                                <h3>Teacher</h3>
                                <p>I want to track student progress.</p>
                            </button>
                            <button
                                className="role-card"
                                onClick={() => handleRoleSelect('parent')}
                            >
                                <div className="role-icon">👨‍👩‍👧‍👦</div>
                                <h3>Parent</h3>
                                <p>I want to support my child.</p>
                            </button>
                        </div>
                        <div className="register-footer">
                            <p>Already have an account? <Link to="/">Sign in here</Link></p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="register-form">
                        <button
                            type="button"
                            className="back-btn"
                            onClick={() => setStep(1)}
                        >
                            ← Back to Role Selection
                        </button>

                        <div className="selected-role-badge">
                            Signing up as: <strong>{formData.role}</strong>
                        </div>

                        {error && (
                            <div className="error-message">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {formData.role === 'student' && (
                            <div className="form-group">
                                <label htmlFor="disability">Learning Issue</label>
                                <select
                                    id="disability"
                                    name="disability"
                                    value={formData.disability}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select your learning path</option>
                                    <option value="adhd">ADHD</option>
                                    <option value="autism">Autism</option>
                                    <option value="dyslexia">Dyslexia</option>
                                    <option value="dysgraphia">Dysgraphia</option>
                                    <option value="dyscalculia">Dyscalculia</option>
                                </select>
                            </div>
                        )}

                        {formData.role === 'parent' && (
                            <div className="form-group">
                                <label htmlFor="childEmail">Child's Email (Optional)</label>
                                <input
                                    type="email"
                                    id="childEmail"
                                    name="childEmail"
                                    value={formData.childEmail}
                                    onChange={handleChange}
                                    placeholder="Enter your child's email to link progress"
                                />
                                <small>You can also link them later in settings.</small>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >
                            {loading ? 'Creating Account...' : 'Complete Registration'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Register;
