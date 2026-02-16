import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeploymentForm from '../components/deployment/DeploymentForm';
import { addDeployment } from '../services/api';

// Mock the API module
jest.mock('../services/api', () => ({
    addDeployment: jest.fn(() => Promise.resolve({ success: true })),
}));

describe('DeploymentForm Component', () => {
    const refreshListMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form correctly', () => {
        render(<DeploymentForm refreshList={refreshListMock} />);
        expect(screen.getByPlaceholderText(/e.g., Production API/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/e.g., v1.2.3/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Add Deployment/i })).toBeInTheDocument();
    });

    it('submits the form with correct data', async () => {
        // Mock the alert since it's used in the component
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });

        render(<DeploymentForm refreshList={refreshListMock} />);

        // Fill out the form
        fireEvent.change(screen.getByPlaceholderText(/e.g., Production API/i), {
            target: { value: 'New Service' },
        });
        fireEvent.change(screen.getByPlaceholderText(/e.g., v1.2.3/i), {
            target: { value: 'v2.0.0' },
        });
        // Select status (default is pending, let's change it)
        fireEvent.change(screen.getByLabelText(/Status/i), {
            target: { value: 'in-progress' },
        });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Add Deployment/i }));

        // Verify API was called with correct arguments
        await waitFor(() => {
            expect(addDeployment).toHaveBeenCalledWith({
                name: 'New Service',
                version: 'v2.0.0',
                status: 'in-progress',
            });
        });

        // Verify refreshList was called
        await waitFor(() => {
            expect(refreshListMock).toHaveBeenCalled();
        });

        // Verify form reset (check input values)
        expect(screen.getByPlaceholderText(/e.g., Production API/i).value).toBe('');
        expect(screen.getByPlaceholderText(/e.g., v1.2.3/i).value).toBe('');

        alertMock.mockRestore();
    });

    it('shows alert if fields are missing', () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { });
        render(<DeploymentForm refreshList={refreshListMock} />);

        // Click submit without filling fields
        fireEvent.click(screen.getByRole('button', { name: /Add Deployment/i }));

        expect(alertMock).toHaveBeenCalledWith('Please fill in all fields');
        expect(addDeployment).not.toHaveBeenCalled();

        alertMock.mockRestore();
    });
});
