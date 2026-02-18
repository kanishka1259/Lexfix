// routes/parent.js
import express from 'express';
import {
    linkChild,
    getChildren,
    getChildProgress,
    getChildAssignments
} from '../controllers_learning/parentController.js';
import { protect, authorize } from '../controllers/authController.js';

const router = express.Router();

// All routes are for parents only
router.post('/link-child', protect, authorize('parent'), linkChild);
router.get('/children', protect, authorize('parent'), getChildren);
router.get('/child/:childId/progress', protect, authorize('parent'), getChildProgress);
router.get('/child/:childId/assignments', protect, authorize('parent'), getChildAssignments);

export default router;
