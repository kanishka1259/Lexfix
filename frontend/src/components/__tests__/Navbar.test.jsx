import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { useAppContext } from '@/context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

// Mock dependencies
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
    useLocation: vi.fn()
}));

vi.mock('@/context/AppContext', () => ({
    useAppContext: vi.fn()
}));

vi.mock('@reading-support/components/dyslexia-font/DyslexiaFontProvider', () => ({
    useDyslexiaFontContext: vi.fn()
}));

// Mock child components to avoid deep rendering issues
vi.mock('../auth/LoginModal', () => ({
    default: ({ trigger }) => <div data-testid="login-modal">{trigger}</div>
}));

vi.mock('../auth/SignupModal', () => ({
    default: ({ trigger }) => <div data-testid="signup-modal">{trigger}</div>
}));

describe('Navbar Component', () => {
    let mockContext;
    let mockNavigate;
    let mockLocation;

    let mockDyslexiaContext;

    beforeEach(async () => {
        mockNavigate = vi.fn();
        mockLocation = { pathname: '/' };
        useNavigate.mockReturnValue(mockNavigate);
        useLocation.mockReturnValue(mockLocation);

        mockContext = {
            userType: 'student',
            setUserType: vi.fn(),
            user: null,
            logout: vi.fn(),
            // isDyslexic removed from here
        };
        useAppContext.mockReturnValue(mockContext);

        mockDyslexiaContext = {
            font: 'default',
            toggleFont: vi.fn()
        };
        // We need to import the mocked module to set the return value
        const { useDyslexiaFontContext } = await import('@reading-support/components/dyslexia-font/DyslexiaFontProvider');
        useDyslexiaFontContext.mockReturnValue(mockDyslexiaContext);

        vi.clearAllMocks();
    });

    it('renders logo and persona buttons', () => {
        render(<Navbar />);
        expect(screen.getByAltText('LexFix Logo')).toBeInTheDocument();
        expect(screen.getByText('For Students')).toBeInTheDocument();
        expect(screen.getByText('For Teachers')).toBeInTheDocument();
        expect(screen.getByText('For Parents')).toBeInTheDocument();
    });

    it('shows Login and Sign Up when no user', () => {
        render(<Navbar />);
        expect(screen.getByText('Log In')).toBeInTheDocument();
        expect(screen.getByText('Sign Up')).toBeInTheDocument();
        expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
    });

    it('shows User Name and Sign Out when user is logged in', () => {
        mockContext.user = { name: 'John Doe', role: 'student' };
        render(<Navbar />);
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('student')).toBeInTheDocument();
        expect(screen.getByText('Sign Out')).toBeInTheDocument();
        expect(screen.queryByText('Log In')).not.toBeInTheDocument();
    });

    it('calls logout when Sign Out is clicked', () => {
        mockContext.user = { name: 'John Doe', role: 'student' };
        render(<Navbar />);
        fireEvent.click(screen.getByText('Sign Out'));
        expect(mockContext.logout).toHaveBeenCalled();
    });

    it('toggles dyslexic font', () => {
        render(<Navbar />);
        fireEvent.click(screen.getByTitle('Toggle OpenDyslexic Font'));
        expect(mockDyslexiaContext.toggleFont).toHaveBeenCalled();
    });

    it('changes user type when persona buttons are clicked', () => {
        render(<Navbar />);
        fireEvent.click(screen.getByText('For Teachers'));
        expect(mockContext.setUserType).toHaveBeenCalledWith('teacher');
    });

    it('navigates back when back arrow is clicked and not on root path', () => {
        useLocation.mockReturnValue({ pathname: '/some/other/path' });
        render(<Navbar />);
        const backButton = screen.getByTitle('Go Back');
        fireEvent.click(backButton);
        expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
});
