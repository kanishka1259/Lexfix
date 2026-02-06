import Task from '../models/Task.js';

// @desc    Create a new learning task
// @route   POST /api/tasks/create
// @access  Private (Teacher)
export const createTask = async (req, res) => {
    try {
        const user = req.user;
        const role = user.role.toLowerCase();

        if (role !== 'teacher') {
            return res.status(403).json({ message: "Only teachers can create tasks" });
        }

        const { title, content, studentId } = req.body;
        const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !content || !studentId) {
            return res.status(400).json({ message: "Please provide title, content and student ID" });
        }

        // Multer might parse 'content' as a single string if only one item is sent
        const contentArray = Array.isArray(content) ? content : [content];

        const newTask = await Task.create({
            title,
            description: "Teacher Assigned Task",
            content: contentArray,
            moduleType: 'Module2_ContentPresentation',
            assignedTo: [studentId],
            createdBy: user.id || user._id,
            attachmentUrl: attachmentUrl,
            status: 'Published',
            difficulty: 'Medium',
            estimatedTime: 15
        });

        res.status(201).json({
            success: true,
            data: newTask
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error creating task: ' + error.message });
    }
};

export const getTasksByStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const user = req.user;
        const role = user.role.toLowerCase();
        const userId = (user.id || user._id).toString();

        if (role === 'student' && userId !== studentId) {
            return res.status(403).json({ message: "Not authorized to view other students' tasks" });
        }

        if (role === 'parent') {
            // Relation check can be added here if children array is populated in req.user
        }

        const tasks = await Task.find({ assignedTo: studentId }).sort({ createdAt: -1 });

        console.log(`[TaskController] Query studentId: ${studentId} (Type: ${typeof studentId})`);
        console.log(`[TaskController] Found ${tasks.length} tasks in total for this ID`);
        if (tasks.length > 0) {
            console.log(`[TaskController] Example Task AssignedTo:`, tasks[0].assignedTo);
        }

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ message: 'Server error fetching tasks' });
    }
};

export const getTasksByTeacher = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.params.teacherId })
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        console.error('Get teacher tasks error:', error);
        res.status(500).json({ message: 'Server error fetching teacher tasks' });
    }
};
