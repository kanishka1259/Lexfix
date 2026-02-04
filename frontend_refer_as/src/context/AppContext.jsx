import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [isDyslexic, setIsDyslexic] = useState(false);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [userType, setUserType] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser).userType : 'student';
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
