import { createTask, getTasksByStudent, getTasksByTeacher } from '../controllers/taskController.js';
import { protect } from './authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/create', protect, upload.single('file'), createTask);
router.get('/student/:studentId', protect, getTasksByStudent);
router.get('/teacher/:teacherId', protect, getTasksByTeacher);

export default router;
