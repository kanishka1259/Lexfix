import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../../../frontend/src/context/AppContext.jsx';

// Test component that exposes context values
const TestConsumer = () => {
    const { user, userType, isDyslexic, logout, setUserType, setIsDyslexic } = useAppContext();
    return (
        <div>
            <div data-testid="user">{user ? user.name : 'none'}</div>
            <div data-testid="userType">{userType}</div>
            <div data-testid="isDyslexic">{isDyslexic ? 'yes' : 'no'}</div>
            <button onClick={logout}>Logout</button>
            <button onClick={() => setUserType('teacher')}>SetTeacher</button>
            <button onClick={() => setIsDyslexic(true)}>SetDyslexic</button>
        </div>
    );
};

describe('AppContext', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('initializes with default values when localStorage is empty', () => {
        render(
            <AppProvider><TestConsumer /></AppProvider>
        );
        expect(screen.getByTestId('user')).toHaveTextContent('none');
        expect(screen.getByTestId('userType')).toHaveTextContent('student');
        expect(screen.getByTestId('isDyslexic')).toHaveTextContent('no');
    });

    it('initializes user from localStorage', () => {
        localStorage.setItem('user', JSON.stringify({ name: 'Test', role: 'teacher' }));
        render(
            <AppProvider><TestConsumer /></AppProvider>
        );
        expect(screen.getByTestId('user')).toHaveTextContent('Test');
        expect(screen.getByTestId('userType')).toHaveTextContent('teacher');
    });

    it('initializes isDyslexic from localStorage', () => {
        localStorage.setItem('isDyslexic', 'true');
        render(
            <AppProvider><TestConsumer /></AppProvider>
        );
        expect(screen.getByTestId('isDyslexic')).toHaveTextContent('yes');
    });

    it('clears user state on logout', async () => {
        localStorage.setItem('user', JSON.stringify({ name: 'Test', role: 'student' }));
        localStorage.setItem('token', 'tok123');
        render(
            <AppProvider><TestConsumer /></AppProvider>
        );

        expect(screen.getByTestId('user')).toHaveTextContent('Test');

        await act(async () => {
            screen.getByText('Logout').click();
        });

        expect(screen.getByTestId('user')).toHaveTextContent('none');
        expect(localStorage.getItem('user')).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('updates userType when setUserType is called', async () => {
        render(
            <AppProvider><TestConsumer /></AppProvider>
        );

        await act(async () => {
            screen.getByText('SetTeacher').click();
        });

        expect(screen.getByTestId('userType')).toHaveTextContent('teacher');
    });
});
