const mongoose = require('mongoose');
const DeploymentStatus = require('../../../models/DeploymentStatus');

describe('DeploymentStatus Model', () => {
    it('should have a schema with zone, status, and timestamp', () => {
        const schema = DeploymentStatus.schema.obj;
        expect(schema).toHaveProperty('zone');
        expect(schema).toHaveProperty('status');
        expect(schema).toHaveProperty('timestamp');
    });

    it('should set default timestamp', () => {
        const schema = DeploymentStatus.schema.obj;
        expect(schema.timestamp.default).toBe(Date.now);
    });
});
