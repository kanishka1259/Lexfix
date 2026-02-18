const monitoringController = require('../../../controllers/monitoringController');
const AccessibilityLog = require('../../../models/AccessibilityLog');
const Usage = require('../../../models/UserAccessibilityUsage');

jest.mock('../../../models/AccessibilityLog');
jest.mock('../../../models/UserAccessibilityUsage');

describe('Monitoring Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('logError', () => {
        it('should create an accessibility log entry', async () => {
            const req = { body: { error: 'Test Error' } };
            const res = { json: jest.fn() };

            AccessibilityLog.create.mockResolvedValue(req.body);

            await monitoringController.logError(req, res);

            expect(AccessibilityLog.create).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(req.body);
        });
    });

    describe('trackUsage', () => {
        it('should create a usage entry', async () => {
            const req = { body: { userId: '123', tool: 'reader' } };
            const res = { json: jest.fn() };

            Usage.create.mockResolvedValue(req.body);

            await monitoringController.trackUsage(req, res);

            expect(Usage.create).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(req.body);
        });
    });
});
