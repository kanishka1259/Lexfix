import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('@/context/AppContext', () => ({
    useAppContext: vi.fn(),
}));

import ProtectedRoute from '../../../frontend/src/components/ProtectedRoute.jsx';
import { useAppContext } from '@/context/AppContext';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('ProtectedRoute', () => {
    beforeEach(() => vi.clearAllMocks());

    it('redirects when no user is logged in', () => {
        useAppContext.mockReturnValue({ user: null });
        const { container } = renderWithRouter(
            <ProtectedRoute><div>Protected</div></ProtectedRoute>
        );
        expect(screen.queryByText('Protected')).not.toBeInTheDocument();
    });

    it('redirects when user role does not match', () => {
        useAppContext.mockReturnValue({ user: { name: 'T', role: 'student' } });
        const { container } = renderWithRouter(
            <ProtectedRoute role="teacher"><div>Teacher Only</div></ProtectedRoute>
        );
        expect(screen.queryByText('Teacher Only')).not.toBeInTheDocument();
    });

    it('renders children when authorized', () => {
        useAppContext.mockReturnValue({ user: { name: 'T', role: 'teacher' } });
        renderWithRouter(
            <ProtectedRoute role="teacher"><div>Teacher Dashboard</div></ProtectedRoute>
        );
        expect(screen.getByText('Teacher Dashboard')).toBeInTheDocument();
    });

    it('renders children when no specific role required', () => {
        useAppContext.mockReturnValue({ user: { name: 'T', role: 'student' } });
        renderWithRouter(
            <ProtectedRoute><div>Any Content</div></ProtectedRoute>
        );
        expect(screen.getByText('Any Content')).toBeInTheDocument();
    });
});
