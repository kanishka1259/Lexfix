import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Hero from '../Hero';
import { useAppContext } from '@/context/AppContext';

// Mock the context hook
vi.mock('@/context/AppContext', () => ({
    useAppContext: vi.fn(),
}));

// Mock the SignupModal to avoid complexity
vi.mock('../auth/SignupModal', () => ({
    default: ({ trigger }) => <div>{trigger}</div>,
}));

describe('Hero Component', () => {
    it('renders correctly for student user type', () => {
        useAppContext.mockReturnValue({ userType: 'student' });

        render(<Hero />);

        expect(screen.getByText('Learning tailored for YOU')).toBeInTheDocument();
        expect(screen.getByText('Overcome challenges with tools designed for your success.')).toBeInTheDocument();
    });

    it('renders correctly for teacher user type', () => {
        useAppContext.mockReturnValue({ userType: 'teacher' });

        render(<Hero />);

        expect(screen.getByText('Empower every student in your classroom')).toBeInTheDocument();
        expect(screen.getByText('Data-driven insights and structured literacy tools.')).toBeInTheDocument();
    });

    it('renders "Get Started Free" button', () => {
        useAppContext.mockReturnValue({ userType: 'student' });

        render(<Hero />);

        expect(screen.getByRole('button', { name: /get started free/i })).toBeInTheDocument();
    });
});
