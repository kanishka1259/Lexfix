// pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="auth-container">
            <div className="home-welcome">
                <div className="home-header">
                    <h1>🧠 ADHD Learning Platform</h1>
                    <p>Focus better, learn smarter with our specialized learning environment</p>
                </div>

                <div className="home-features">
                    <div className="feature-card">
                        <span className="feature-icon">👨‍🏫</span>
                        <h3>For Teachers</h3>
                        <p>Create and assign ADHD-friendly tasks</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">👨‍🎓</span>
                        <h3>For Students</h3>
                        <p>Learn with distraction-free focus mode</p>
                    </div>
                    <div className="feature-card">
                        <span className="feature-icon">👨‍👩‍👧</span>
                        <h3>For Parents</h3>
                        <p>Monitor your child's learning progress</p>
                    </div>
                </div>

                <div className="home-actions">
                    <button
                        className="auth-btn btn-primary"
                        onClick={() => navigate('/register')}
                    >
                        Get Started
                    </button>
                    <button
                        className="auth-btn btn-secondary"
                        onClick={() => navigate('/login')}
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
}
