import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
    Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
    useNavigate: () => mockNavigate,
}));

vi.mock('@/context/AppContext', () => ({
    useAppContext: vi.fn(),
}));

import ProtectedRoute from '../../../frontend/src/components/ProtectedRoute.jsx';
import { useAppContext } from '@/context/AppContext';

describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('redirects to / when no user is logged in', () => {
        useAppContext.mockReturnValue({ user: null });
        render(
            <ProtectedRoute>
                <div>Protected Content</div>
            </ProtectedRoute>
        );
        expect(screen.getByTestId('navigate')).toHaveTextContent('/');
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects when user role does not match required role', () => {
        useAppContext.mockReturnValue({ user: { name: 'Test', role: 'student' } });
        render(
            <ProtectedRoute role="teacher">
                <div>Teacher Only</div>
            </ProtectedRoute>
        );
        expect(screen.getByTestId('navigate')).toHaveTextContent('/');
        expect(screen.queryByText('Teacher Only')).not.toBeInTheDocument();
    });

    it('renders children when user is authorized', () => {
        useAppContext.mockReturnValue({ user: { name: 'Test', role: 'teacher' } });
        render(
            <ProtectedRoute role="teacher">
                <div>Teacher Dashboard</div>
            </ProtectedRoute>
        );
        expect(screen.getByText('Teacher Dashboard')).toBeInTheDocument();
    });

    it('renders children when no specific role is required', () => {
        useAppContext.mockReturnValue({ user: { name: 'Test', role: 'student' } });
        render(
            <ProtectedRoute>
                <div>Any User Content</div>
            </ProtectedRoute>
        );
        expect(screen.getByText('Any User Content')).toBeInTheDocument();
    });
});
