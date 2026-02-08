import express from 'express';
import { createTask, getTasksByStudent, getTasksByTeacher, getTaskById } from '../controllers/taskController.js';
import { protect } from '../controllers/authController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/create', protect, upload.single('attachment'), createTask);
router.get('/student/:studentId', protect, getTasksByStudent);
router.get('/teacher/:teacherId', protect, getTasksByTeacher);
router.get('/detail/:id', protect, getTaskById);

export default router;
