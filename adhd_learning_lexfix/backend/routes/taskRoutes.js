import express from 'express';
import { createTask, getTasksByStudent, getTasksByTeacher } from '../controllers/taskController.js';
import { protect } from './authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createTask);
router.get('/student/:studentId', protect, getTasksByStudent);
router.get('/teacher/:teacherId', protect, getTasksByTeacher);

export default router;
