import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BreakReminder, EncouragementMessage } from '../components/DashboardComponents';

describe('BreakReminder', () => {
    it('renders when userHasADHD is true and it has been more than 30 minutes', () => {
        render(<BreakReminder userHasADHD={true} minutesSinceLastBreak={45} />);
        expect(screen.getByText(/Time for a break!/i)).toBeInTheDocument();
    });

    it('does not render when minutesSinceLastBreak is less than 30', () => {
        render(<BreakReminder userHasADHD={true} minutesSinceLastBreak={20} />);
        expect(screen.queryByText(/Time for a break!/i)).not.toBeInTheDocument();
    });

    it('hides when the close button is clicked', async () => {
        render(<BreakReminder userHasADHD={true} minutesSinceLastBreak={45} />);
        const closeButton = screen.getByLabelText(/Dismiss break reminder/i);
        fireEvent.click(closeButton);
        expect(screen.queryByText(/Time for a break!/i)).not.toBeInTheDocument();
    });
});

describe('EncouragementMessage', () => {
    it('renders with learner name', () => {
        render(<EncouragementMessage learnerName="Alex" />);
        expect(screen.getByText(/Alex/)).toBeInTheDocument();
    });
});
