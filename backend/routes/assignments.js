// routes/assignments.js
import express from 'express';
import {
    createAssignment,
    getAssignmentsByDisability,
    getStudentAssignments,
    getAssignment,
    updateAssignment,
    deleteAssignment,
    getStudentsByDisability
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../controllers/authController.js';

const router = express.Router();

// Teacher routes
router.post('/', protect, authorize('teacher'), createAssignment);
router.get('/disability/:disability', protect, authorize('teacher'), getAssignmentsByDisability);
router.get('/students/:disability', protect, authorize('teacher'), getStudentsByDisability);
router.put('/:id', protect, authorize('teacher'), updateAssignment);
router.delete('/:id', protect, authorize('teacher'), deleteAssignment);

// Student routes
router.get('/my-assignments', protect, authorize('student'), getStudentAssignments);
router.get('/:id', protect, getAssignment);

export default router;
