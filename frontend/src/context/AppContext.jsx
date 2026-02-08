import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isDyslexic, setIsDyslexic] = useState(() => {
        return localStorage.getItem('isDyslexic') === 'true';
    });

    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            console.error("Failed to parse user from local storage", e);
            return null;
        }
    });
    const [userType, setUserType] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            if (!savedUser) return 'student';
            const parsed = JSON.parse(savedUser);
            return parsed && (parsed.userType || parsed.role) ? (parsed.userType || parsed.role) : 'student';
        } catch (e) {
            return 'student';
        }
    });

    // Apply font class to body when state changes
    useEffect(() => {
        if (isDyslexic) {
            document.body.classList.add('font-dyslexic');
        } else {
            document.body.classList.remove('font-dyslexic');
        }
        localStorage.setItem('isDyslexic', isDyslexic);
    }, [isDyslexic]);

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AppContext.Provider value={{ isDyslexic, setIsDyslexic, userType, setUserType, user, setUser, logout }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
