import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('lexfix_token'));
    const [loading, setLoading] = useState(true);

    const API_URL = '/api/auth';

    // Load user on mount if token exists
    useEffect(() => {
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const loadUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data.data);
        } catch (error) {
            console.error('Failed to load user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            const { token: newToken, ...userInfo } = response.data.data;

            localStorage.setItem('lexfix_token', newToken);
            setToken(newToken);
            setUser(userInfo);

            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            const { token: newToken, ...userInfo } = response.data.data;

            localStorage.setItem('lexfix_token', newToken);
            setToken(newToken);
            setUser(userInfo);

            return { success: true, data: response.data.data };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('lexfix_token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
