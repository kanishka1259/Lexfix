import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(() => vi.fn()),
    Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

import Register from '../../../frontend/src/pages/Register.jsx';

describe('Register Page', () => {
    beforeEach(() => vi.clearAllMocks());

    it('renders role selection on step 1', () => {
        render(<Register />);
        expect(screen.getByText('I am a...')).toBeInTheDocument();
        expect(screen.getByText('Student')).toBeInTheDocument();
        expect(screen.getByText('Teacher')).toBeInTheDocument();
        expect(screen.getByText('Parent')).toBeInTheDocument();
    });

    it('advances to step 2 when a role is selected', () => {
        render(<Register />);
        fireEvent.click(screen.getByText('Student'));
        expect(screen.getByText('Signing up as:')).toBeInTheDocument();
        expect(screen.getByText('student')).toBeInTheDocument();
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    });

    it('shows disability field for student role', () => {
        render(<Register />);
        fireEvent.click(screen.getByText('Student'));
        expect(screen.getByLabelText('Learning Issue')).toBeInTheDocument();
    });

    it('shows child email field for parent role', () => {
        render(<Register />);
        fireEvent.click(screen.getByText('Parent'));
        expect(screen.getByLabelText("Child's Email (Optional)")).toBeInTheDocument();
    });

    it('does not show disability/child fields for teacher', () => {
        render(<Register />);
        fireEvent.click(screen.getByText('Teacher'));
        expect(screen.queryByLabelText('Learning Issue')).not.toBeInTheDocument();
        expect(screen.queryByLabelText("Child's Email (Optional)")).not.toBeInTheDocument();
    });

    it('has a back button to return to role selection', () => {
        render(<Register />);
        fireEvent.click(screen.getByText('Student'));
        fireEvent.click(screen.getByText('← Back to Role Selection'));
        expect(screen.getByText('I am a...')).toBeInTheDocument();
    });

    it('renders heading text', () => {
        render(<Register />);
        expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    });
});
