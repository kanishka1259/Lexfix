import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import PerformancePanel from '../components/performance/PerformancePanel';
import { addPerformance } from '../services/api';

jest.mock('../services/api', () => ({
    getPerformance: jest.fn(() => Promise.resolve([])),
    addPerformance: jest.fn(() => Promise.resolve({ success: true })),
}));

expect.extend(toHaveNoViolations);

describe('PerformancePanel Component', () => {
    it('renders correctly', async () => {
        const { container } = render(<PerformancePanel />);
        expect(screen.getByRole('heading', { name: /Performance Metrics/i })).toBeInTheDocument();

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('allows adding a new metric', async () => {
        render(<PerformancePanel />);

        fireEvent.change(screen.getByLabelText(/Metric Name/i), { target: { value: 'CPU Load' } });
        fireEvent.change(screen.getByLabelText(/Value/i), { target: { value: '45.5' } });

        fireEvent.click(screen.getByRole('button', { name: /Add Metric/i }));

        await waitFor(() => {
            expect(addPerformance).toHaveBeenCalledWith({ metric: 'CPU Load', value: '45.5' });
        });
    });
});
