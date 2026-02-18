import { getDeployments, addDeployment, getMonitoring, addMonitoring } from '../api';

const BASE_URL = "http://localhost:5000";

describe('API Service', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('Deployment API', () => {
        it('getDeployments should fetch deployments', async () => {
            const mockData = [{ id: 1, name: 'Test' }];
            fetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockData),
            });

            const result = await getDeployments();

            expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/deployment`);
            expect(result).toEqual(mockData);
        });

        it('addDeployment should post data', async () => {
            const mockData = { id: 1, name: 'Test' };
            const payload = { name: 'Test' };
            fetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockData),
            });

            const result = await addDeployment(payload);

            expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/deployment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            expect(result).toEqual(mockData);
        });
    });

    describe('Monitoring API', () => {
        it('getMonitoring should fetch monitoring data', async () => {
            const mockData = [{ id: 1, metric: 'CPU' }];
            fetch.mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockData),
            });

            const result = await getMonitoring();

            expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/monitoring`);
            expect(result).toEqual(mockData);
        });
    });
});
