import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import QAPanel from '../components/qa/QAPanel';
import { addQA } from '../services/api';

jest.mock('../services/api', () => ({
    getQA: jest.fn(() => Promise.resolve([])),
    addQA: jest.fn(() => Promise.resolve({ success: true })),
}));

expect.extend(toHaveNoViolations);

describe('QAPanel Component', () => {
    it('renders correctly', () => {
        render(<QAPanel />);
        expect(screen.getByText(/QA Testing Dashboard/i)).toBeInTheDocument();
    });

    it('should have no accessibility violations', async () => {
        const { container } = render(<QAPanel />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('allows adding a test result', async () => {
        render(<QAPanel />);

        fireEvent.change(screen.getByLabelText(/Test Name/i), { target: { value: 'UI Test' } });
        fireEvent.change(screen.getByLabelText(/Result/i), { target: { value: 'passed' } }); // This might fail if select doesn't have label

        fireEvent.click(screen.getByRole('button', { name: /Add Test Result/i }));

        await waitFor(() => {
            expect(addQA).toHaveBeenCalledWith({ testName: 'UI Test', result: 'passed' });
        });
    });
});
