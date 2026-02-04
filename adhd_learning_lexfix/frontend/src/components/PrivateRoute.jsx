import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = () => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            let token = localStorage.getItem('lexfix_token');

            // Fallback: Check URL if token not in storage yet (race condition)
            if (!token) {
                const params = new URLSearchParams(window.location.search);
                token = params.get('token');
            }

            if (!token || token === 'null' || token === 'undefined') {
                setAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                // Verify with Lexfix Auth Server
                await axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAuthenticated(true);
            } catch (error) {
                console.error("Auth check failed:", error);
                localStorage.removeItem('lexfix_token');
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div className="loading-screen">Loading your session...</div>;
    }

    // Redirect to main Lexfix Login if not authenticated
    return authenticated ? <Outlet /> : <div className="auth-redirect">
        <h2>Authentication Required</h2>
        <p>Please log in through the main Lexfix portal.</p>
        <button onClick={() => window.location.href = 'http://localhost:5173'}>
            Go to Login
        </button>
    </div>;
};

export default PrivateRoute;
