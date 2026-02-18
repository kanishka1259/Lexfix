import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import DeploymentList from '../components/deployment/DeploymentList';

expect.extend(toHaveNoViolations);

describe('DeploymentList Component', () => {
    it('renders empty state when no deployments provided', async () => {
        const { container } = render(<DeploymentList deployments={[]} />);
        expect(screen.getByText(/No deployments yet/i)).toBeInTheDocument();

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('renders list of deployments correctly', async () => {
        const deployments = [
            { _id: '1', name: 'API V1', version: '1.0.0', status: 'completed', timestamp: new Date().toISOString() },
            { _id: '2', name: 'Frontend', version: '2.0.0', status: 'in-progress', timestamp: new Date().toISOString() }
        ];

        const { container } = render(<DeploymentList deployments={deployments} />);

        expect(screen.getByText('API V1')).toBeInTheDocument();
        expect(screen.getByText('Frontend')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('In Progress')).toBeInTheDocument();

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
