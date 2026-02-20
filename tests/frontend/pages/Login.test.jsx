import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(() => vi.fn()),
    Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

vi.mock('@/context/AppContext', () => ({
    useAppContext: vi.fn(() => ({ setUser: vi.fn() })),
}));

import Login from '../../../frontend/src/pages/Login.jsx';

describe('Login Page', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders email and password fields', () => {
        render(<Login />);
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
    });

    it('renders Sign In button', () => {
        render(<Login />);
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('renders link to registration', () => {
        render(<Login />);
        expect(screen.getByText('Create an account')).toBeInTheDocument();
    });

    it('updates form data on input change', () => {
        render(<Login />);
        const emailInput = screen.getByLabelText('Email Address');
        fireEvent.change(emailInput, { target: { name: 'email', value: 'test@mail.com' } });
        expect(emailInput.value).toBe('test@mail.com');
    });

    it('renders heading text', () => {
        render(<Login />);
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
        expect(screen.getByText('Sign in to continue your learning journey')).toBeInTheDocument();
    });
});
