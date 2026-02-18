const deploymentController = require('../../../controllers/deploymentController');
const Deployment = require('../../../models/DeploymentStatus');
const awsConfig = require('../../../config/awsConfig');

// Mock dependencies
jest.mock('../../../models/DeploymentStatus');
jest.mock('../../../config/awsConfig', () => ({
    availabilityZones: ['zone-a', 'zone-b'],
    disasterRecovery: { strategy: 'backup' }
}));

describe('Deployment Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('deployPlatform', () => {
        it('should create deployments for all availability zones', async () => {
            const req = {};
            const res = {
                json: jest.fn()
            };

            // Mock Deployment.create to return the created object
            Deployment.create.mockImplementation((data) => Promise.resolve(data));

            await deploymentController.deployPlatform(req, res);

            expect(Deployment.create).toHaveBeenCalledTimes(2);
            expect(Deployment.create).toHaveBeenCalledWith({ zone: 'zone-a', status: 'Active' });
            expect(Deployment.create).toHaveBeenCalledWith({ zone: 'zone-b', status: 'Active' });

            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Platform deployed',
                deployments: expect.any(Array)
            }));
        });
    });

    describe('getDisasterRecovery', () => {
        it('should return disaster recovery config', () => {
            const req = {};
            const res = {
                json: jest.fn()
            };

            deploymentController.getDisasterRecovery(req, res);
            expect(res.json).toHaveBeenCalledWith({ strategy: 'backup' });
        });
    });
});
