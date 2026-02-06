// routes/submissions.js
import express from 'express';
import {
    upsertSubmission,
    getStudentSubmission,
    getAllStudentSubmissions,
    getAssignmentSubmissions,
    startReadingSession,
    updateReadingSession
} from '../controllers/submissionController.js';
import { protect, authorize } from '../controllers/authController.js';

const router = express.Router();

// Student routes
router.post('/', protect, authorize('student'), upsertSubmission);
router.get('/assignment/:assignmentId', protect, authorize('student'), getStudentSubmission);
router.get('/my-submissions', protect, authorize('student'), getAllStudentSubmissions);

// Reading session routes
router.post('/session/start', protect, authorize('student'), startReadingSession);
router.put('/session/:sessionId', protect, authorize('student'), updateReadingSession);

// Teacher routes
router.get('/assignment/:assignmentId/all', protect, authorize('teacher'), getAssignmentSubmissions);

export default router;
