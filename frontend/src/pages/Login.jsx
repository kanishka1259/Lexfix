import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useAppContext();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const [loading, setLoading] = useState(false);

    // Auto-redirect removed as per user request

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

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                return setError(data.message || 'Login failed');
            }

            const user = data.data || data;

            // Normalize user data
            const normalizedUser = {
                ...user,
                userType: user.role || user.userType || 'student',
                username: user.name || user.username || user.email.split('@')[0],
                token: user.token || data.token
            };

            localStorage.setItem('user', JSON.stringify(normalizedUser));
            localStorage.setItem('token', normalizedUser.token); // Often needed for requests
            setUser(normalizedUser);

            const role = normalizedUser.userType.toLowerCase();

            if (role === "student") {
                navigate('/dashboard');
            } else if (role === "teacher") {
                navigate("/teacher-hub");
            } else if (role === "parent") {
                navigate("/parent");
            } else {
                navigate("/hub"); // Fallback
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <main className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue your learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            <span>⚠️</span> {error}
                        </div>
                    )}

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

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="login-footer">
                    <p>New here? <Link to="/register">Create an account</Link></p>
                </div>
            </div>
        </main>
    );
};

export default Login;
