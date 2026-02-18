import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import MonitoringPanel from '../components/monitoring/MonitoringPanel';
import { addMonitoring } from '../services/api';

jest.mock('../services/api', () => ({
    getMonitoring: jest.fn(() => Promise.resolve([])),
    addMonitoring: jest.fn(() => Promise.resolve({ success: true })),
}));

expect.extend(toHaveNoViolations);

describe('MonitoringPanel Component', () => {

    it('renders correctly', async () => {
        const { container } = render(<MonitoringPanel />);
        expect(screen.getByText(/System Monitoring/i)).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
        const { container } = render(<MonitoringPanel />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('allows adding a new monitor', async () => {
        render(<MonitoringPanel />);

        // Fill form
        fireEvent.change(screen.getByLabelText(/Service Name/i), { target: { value: 'Database' } });
        fireEvent.change(screen.getByLabelText(/Uptime/i), { target: { value: '99.99' } });

        // Submit
        fireEvent.click(screen.getByRole('button', { name: /Add Monitor/i }));

        await waitFor(() => {
            expect(addMonitoring).toHaveBeenCalledWith({ service: 'Database', uptime: '99.99' });
        });
    });
});
