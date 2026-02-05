import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isDyslexic, setIsDyslexic] = useState(false);
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
            return parsed && parsed.userType ? parsed.userType : 'student';
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
    }, [isDyslexic]);

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        // We don't necessarily reset userType to 'student' here if we want to remember it for future landing page views
    };

    return (
        <AppContext.Provider value={{ isDyslexic, setIsDyslexic, userType, setUserType, user, setUser, logout }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
