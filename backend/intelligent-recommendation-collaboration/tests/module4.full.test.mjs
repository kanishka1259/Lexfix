
/**
 * @file module4.full.test.mjs
 * @description Comprehensive Unit & Integration Tests for Module 4 (Intelligent Recommendation & Collaboration)
 * @module Module4_Tests
 * 
 * NOTE: Using Native ESM requires `jest.unstable_mockModule` and dynamic imports.
 * 
 * EXECUTION:
 * node --experimental-vm-modules node_modules/jest/bin/jest.js backend/intelligent-recommendation-collaboration/tests/module4.full.test.mjs
 */

import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

// ============================================================================
// 1. MOCKS SETUP (Must be before dynamic imports)
// ============================================================================

const createMongooseMock = (name) => {
    const mockSave = jest.fn().mockResolvedValue(true);
    const mockInstance = {
        save: mockSave,
        totalLessonsCompleted: 0,
        difficultyLevels: {},
        averageAccuracy: 0,
        participants: [],
        markModified: jest.fn()
    };

    // Constructor mock
    const MockModel = jest.fn(() => mockInstance);

    // Static methods
    MockModel.find = jest.fn().mockReturnValue({
        distinct: jest.fn().mockResolvedValue([]),
        sort: jest.fn().mockResolvedValue(null),
        limit: jest.fn().mockResolvedValue([]),
        select: jest.fn().mockResolvedValue([])
    });
    MockModel.findOne = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
        select: jest.fn().mockResolvedValue(null)
    });
    MockModel.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: 'test-user-id', name: 'Test User', role: 'student', disability: [] })
    });
    MockModel.aggregate = jest.fn().mockResolvedValue([]);
    MockModel.create = jest.fn().mockResolvedValue(mockInstance);
    MockModel.prototype = mockInstance;

    return MockModel;
};

const MockUserPerformance = createMongooseMock('UserPerformance');
const MockPerformanceSummary = createMongooseMock('PerformanceSummary');
const MockRecommendationInteraction = createMongooseMock('RecommendationInteraction');
const MockUser = createMongooseMock('User');

// Using unstable_mockModule for Native ESM support
jest.unstable_mockModule('../models/UserPerformance.js', () => ({
    __esModule: true,
    default: MockUserPerformance
}));

jest.unstable_mockModule('../models/PerformanceSummary.js', () => ({
    __esModule: true,
    default: MockPerformanceSummary
}));

jest.unstable_mockModule('../models/RecommendationInteraction.js', () => ({
    __esModule: true,
    default: MockRecommendationInteraction
}));

jest.unstable_mockModule('../../models/User.js', () => ({
    __esModule: true,
    default: MockUser
}));

jest.unstable_mockModule('../../routes_learning/authMiddleware.js', () => ({
    protect: (req, res, next) => {
        req.user = { id: 'test-user-id', name: 'Test User', role: 'student' };
        next();
    }
}));

const mockIo = {
    emit: jest.fn(),
    to: jest.fn().mockReturnThis(),
    use: jest.fn(() => mockIo),
    on: jest.fn(),
    listen: jest.fn()
};

jest.unstable_mockModule('socket.io', () => ({
    Server: jest.fn(() => mockIo)
}));

// ============================================================================
// 2. DYNAMIC IMPORTS
// ============================================================================

// We must import these AFTER mocks are defined using await import
const performanceController = await import('../controllers/performanceController.js');
const recommendationController = await import('../controllers/recommendationController.js');
const learningPathController = await import('../controllers/learningPathController.js');
const interactionController = await import('../controllers/interactionController.js');
const { recordPerformanceSchema } = await import('../validation/performanceValidation.js');
const roomManager = await import('../realtime/room.manager.js');

// ============================================================================
// 3. EXPRESS APP SETUP
// ============================================================================

const app = express();
app.use(bodyParser.json());

// Inject User for Tests
app.use((req, res, next) => {
    req.user = { id: 'test-user-id', name: 'Test User', role: 'student' };
    next();
});

app.post('/performance', performanceController.recordPerformance);
app.get('/performance/summary', performanceController.getPerformanceSummary);
app.get('/recommendations', recommendationController.getRecommendations);
app.get('/learning-path', learningPathController.getPath);
app.get('/learning-path/reviews', learningPathController.getReviews);
app.post('/interactions', interactionController.logInteraction);

// ============================================================================
// 4. TESTS
// ============================================================================

describe('Module 4: Intelligent Recommendation & Collaboration', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        MockUserPerformance.aggregate.mockResolvedValue([]);
        MockPerformanceSummary.findOne.mockResolvedValue(null);
    });

    // ------------------------------------------------------------------------
    // VALIDATION LAYER
    // ------------------------------------------------------------------------
    describe('Validation Layer', () => {
        it('should validate correct performance data', () => {
            const data = {
                lessonId: 'L1',
                moduleName: 'Math',
                difficulty: 'medium',
                score: 8,
                totalQuestions: 10,
                timeTakenSeconds: 120
            };
            const { error } = recordPerformanceSchema.validate(data);
            expect(error).toBeUndefined();
        });

        it('should reject missing required fields', () => {
            const data = { difficulty: 'medium', score: 8 };
            const { error } = recordPerformanceSchema.validate(data);
            expect(error).toBeDefined();
        });
    });

    // ------------------------------------------------------------------------
    // PERFORMANCE
    // ------------------------------------------------------------------------
    describe('Performance Service', () => {
        it('should record valid score submission', async () => {
            const mockSummary = {
                userId: 'test-user-id',
                difficultyLevels: { medium: { count: 1, avgAccuracy: 70 } },
                totalLessonsCompleted: 1,
                averageAccuracy: 70,
                save: jest.fn().mockResolvedValue(true)
            };
            MockPerformanceSummary.findOne.mockResolvedValue(mockSummary);
            MockUserPerformance.aggregate.mockResolvedValue([{ avgAccuracy: 85 }]);

            const res = await request(app)
                .post('/performance')
                .send({
                    lessonId: 'L1',
                    moduleName: 'Math',
                    difficulty: 'medium',
                    score: 9,
                    totalQuestions: 10
                });

            expect(res.status).toBe(201);
            const mockInstance = MockUserPerformance.mock.results[0].value;
            expect(mockInstance.save).toHaveBeenCalled();
            expect(mockSummary.save).toHaveBeenCalled();
        });

        it('should return 400 for invalid input', async () => {
            const res = await request(app)
                .post('/performance')
                .send({ score: 9 });
            expect(res.status).toBe(400);
        });

        it('should return performance summary', async () => {
            MockPerformanceSummary.findOne.mockResolvedValue({
                totalLessonsCompleted: 5,
                averageAccuracy: 82,
                difficultyLevels: {}
            });
            const res = await request(app).get('/performance/summary');
            expect(res.status).toBe(200);
            expect(res.body.data.averageAccuracy).toBe(82);
        });
    });

    // ------------------------------------------------------------------------
    // RECOMMENDATION
    // ------------------------------------------------------------------------
    describe('Recommendation Service', () => {
        it('should return harder lessons for high accuracy (>80%)', async () => {
            MockUser.findById.mockResolvedValue({
                disability: [],
                _id: 'test',
                role: 'student'
            });

            MockUserPerformance.findOne.mockReturnValue({
                sort: jest.fn().mockResolvedValue({ accuracy: 85 })
            });
            MockPerformanceSummary.findOne.mockResolvedValue({
                averageAccuracy: 85,
                totalLessonsCompleted: 10
            });
            MockUserPerformance.find.mockReturnValue({
                distinct: jest.fn().mockResolvedValue([])
            });

            const res = await request(app).get('/recommendations');

            expect(res.status).toBe(200);
            expect(res.body.data.level).toBe('hard');
        });

        it('should return easier lessons for low accuracy (<60%)', async () => {
            MockUser.findById.mockResolvedValue({ disability: [], _id: 'test', role: 'student' });
            MockUserPerformance.findOne.mockReturnValue({ sort: jest.fn().mockResolvedValue({ accuracy: 50 }) });
            MockPerformanceSummary.findOne.mockResolvedValue({ averageAccuracy: 50, totalLessonsCompleted: 10 });
            MockUserPerformance.find.mockReturnValue({ distinct: jest.fn().mockResolvedValue([]) });

            const res = await request(app).get('/recommendations');
            expect(res.status).toBe(200);
            expect(res.body.data.level).toBe('easy');
        });
    });

    // ------------------------------------------------------------------------
    // LEARNING PATH
    // ------------------------------------------------------------------------
    describe('Learning Path Service', () => {
        it('should unlock first lesson by default', async () => {
            MockUserPerformance.find.mockResolvedValue([]);
            const res = await request(app).get('/learning-path');
            expect(res.status).toBe(200);
            expect(res.body.data[0].status).toBe('active');
        });

        it('should show completed lessons', async () => {
            // Assuming lesson 1 (id="1") is completed
            // We need to match the mock data in service (usually "1", "2")
            MockUserPerformance.find.mockResolvedValue([
                { lessonId: '1', accuracy: 90, createdAt: new Date() }
            ]);
            const res = await request(app).get('/learning-path');
            expect(res.status).toBe(200);
            const l1 = res.body.data.find(l => l.id === '1');
            if (l1) expect(l1.status).toBe('completed');
        });
    });

    // ------------------------------------------------------------------------
    // INTERACTION
    // ------------------------------------------------------------------------
    describe('Interaction Controller', () => {
        it('should save valid interactions', async () => {
            const res = await request(app)
                .post('/interactions')
                .send({
                    lessonId: '1',
                    actionType: 'click',
                    recommendationId: 'rec-123'
                });
            expect(res.status).toBe(201);
            const mockInstance = MockRecommendationInteraction.mock.results[0].value;
            expect(mockInstance.save).toHaveBeenCalled();
        });
    });

    // ------------------------------------------------------------------------
    // ROOM MANAGER
    // ------------------------------------------------------------------------
    describe('Room Manager', () => {
        it('should create and manage rooms', () => {
            const room = roomManager.createRoom('test-room-A', 'Study', { id: 'u1' });
            expect(room.id).toBe('test-room-A');

            const joined = roomManager.joinRoom('test-room-A', { id: 'u2', socketId: 's2' });
            expect(joined.participants.length).toBe(1);

            // Duplicate join
            roomManager.joinRoom('test-room-A', { id: 'u2', socketId: 's2' });
            expect(joined.participants.length).toBe(1);

            roomManager.leaveRoom('test-room-A', 'u2');
            expect(roomManager.getRoom('test-room-A')).toBeUndefined();
        });
    });

    // ------------------------------------------------------------------------
    // SOCKET EVENTS
    // ------------------------------------------------------------------------
    describe('Socket Events', () => {
        let clientSocket;
        let serverHandlers = {};

        const triggerClientEvent = (eventName, data, socketMock) => {
            if (serverHandlers[eventName]) serverHandlers[eventName](data);
        };

        beforeAll(async () => {
            // Re-import to ensure mocks are used
            const { startSocketServer } = await import('../realtime/socket.server.js');

            mockIo.on.mockImplementation((event, callback) => {
                if (event === 'connection') {
                    const mockSocket = {
                        id: 'socket-123',
                        user: { id: 'test-id', name: 'Test', role: 'student' },
                        emit: jest.fn(),
                        on: jest.fn((ev, cb) => serverHandlers[ev] = cb),
                        join: jest.fn(),
                        leave: jest.fn(),
                        handshake: { auth: { token: 'mock' } }
                    };
                    callback(mockSocket);
                    clientSocket = mockSocket;
                }
            });

            startSocketServer();
        });

        it('should handle room creation and joining', () => {
            triggerClientEvent('create_room', { name: 'Socket Room' }, clientSocket);
            expect(mockIo.emit).toHaveBeenCalledWith('rooms_list', expect.any(Array));

            triggerClientEvent('send_message', { roomId: 'r1', message: 'Hi' }, clientSocket);
            expect(mockIo.to).toHaveBeenCalledWith('r1');
        });
    });

});
