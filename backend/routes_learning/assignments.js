// routes/assignments.js
import express from 'express';
import {
    createAssignment,
    getAssignmentsByDisability,
    getStudentsByDisability,
    getStudentAssignments,
    getAssignment
} from '../controllers_learning/assignmentController.js';
import { protect, authorize } from '../controllers/authController.js';

const router = express.Router();

// Teacher routes
router.post('/', protect, authorize('teacher'), createAssignment);
router.get('/disability/:disability', protect, authorize('teacher'), getAssignmentsByDisability);
router.get('/students/:disability', protect, authorize('teacher'), getStudentsByDisability);

// Student routes
router.get('/my-assignments', protect, authorize('student'), getStudentAssignments);
router.get('/:id', protect, getAssignment);

export default router;
