import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock dependencies
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
    useLocation: vi.fn(() => ({ pathname: '/' })),
}));

vi.mock('@/context/AppContext', () => ({
    useAppContext: vi.fn(),
}));

vi.mock('@/components/auth/SignupModal', () => ({
    default: ({ trigger }) => <div data-testid="signup-modal">{trigger}</div>,
}));

import Hero from '../../../frontend/src/components/Hero.jsx';
import { useAppContext } from '@/context/AppContext';

describe('Hero Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders student content by default', () => {
        useAppContext.mockReturnValue({ userType: 'student' });
        render(<Hero />);
        expect(screen.getByText('Learning tailored for YOU')).toBeInTheDocument();
        expect(screen.getByText('Text-to-Speech')).toBeInTheDocument();
        expect(screen.getByText('Gamified Learning')).toBeInTheDocument();
        expect(screen.getByText('Personalized Settings')).toBeInTheDocument();
    });

    it('renders teacher content when userType is teacher', () => {
        useAppContext.mockReturnValue({ userType: 'teacher' });
        render(<Hero />);
        expect(screen.getByText('Empower every student in your classroom')).toBeInTheDocument();
        expect(screen.getByText('Progress Tracking')).toBeInTheDocument();
        expect(screen.getByText('Structured Curriculum')).toBeInTheDocument();
    });

    it('renders parent content when userType is parent', () => {
        useAppContext.mockReturnValue({ userType: 'parent' });
        render(<Hero />);
        expect(screen.getByText("Support your child's learning journey")).toBeInTheDocument();
        expect(screen.getByText('Parent Dashboard')).toBeInTheDocument();
    });

    it('falls back to student content for unknown userType', () => {
        useAppContext.mockReturnValue({ userType: 'unknown' });
        render(<Hero />);
        expect(screen.getByText('Learning tailored for YOU')).toBeInTheDocument();
    });

    it('renders Get Started button', () => {
        useAppContext.mockReturnValue({ userType: 'student' });
        render(<Hero />);
        expect(screen.getByText('Get Started Free')).toBeInTheDocument();
    });
});
