import React from 'react';
import { render, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from '../App';

// Mock the API services to prevent network calls during tests
jest.mock('../services/api', () => ({
    getDeployments: jest.fn(() => Promise.resolve([])),
    getMonitoringData: jest.fn(() => Promise.resolve([])),
    getQAMetrics: jest.fn(() => Promise.resolve([])),
    getPerformanceMetrics: jest.fn(() => Promise.resolve([])),
}));

expect.extend(toHaveNoViolations);

describe('App Component', () => {
    it('should render without crashing', () => {
        const { container } = render(<App />);
        expect(container).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
        const { container } = render(<App />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
