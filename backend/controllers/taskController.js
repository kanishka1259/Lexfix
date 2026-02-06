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

        let { title, content, studentId } = req.body;
        const attachmentUrl = req.file ? `/uploads/${req.file.filename}` : null;

        if (!title || !content || !studentId) {
            return res.status(400).json({ message: "Please provide title, content and student ID" });
        }

        // Multer might parse 'content' as a single string if only one item is sent
        const contentArray = Array.isArray(content) ? content : [content];

        // Handle one-to-one assignment
        const newTask = await Task.create({
            title,
            description: "Teacher Assigned Task",
            content: contentArray,
            moduleType: 'Module2_ContentPresentation',
            assignedTo: [studentId],
            createdBy: user._id || user.id,
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
        const userId = (user._id || user.id).toString();

        // Student can only view their own tasks
        if (role === 'student' && userId !== studentId) {
            return res.status(403).json({ message: "Not authorized to view other students' tasks" });
        }

        // Parent can only view their children's tasks
        if (role === 'parent') {
            const isChild = user.children && user.children.some(child => {
                const childId = (child._id || child).toString();
                return childId === studentId;
            });

            if (!isChild && userId !== studentId) {
                return res.status(403).json({ message: "Not authorized to view this student's tasks" });
            }
        }

        // Find tasks where the student ID is in the assignedTo array
        const tasks = await Task.find({ assignedTo: studentId }).sort({ createdAt: -1 });

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

// @desc    Get tasks created by a teacher
// @route   GET /api/tasks/teacher/:teacherId
// @access  Private
export const getTasksByTeacher = async (req, res) => {
    try {
        // Fetch last 5 tasks created by this teacher
        const tasks = await Task.find({ createdBy: req.params.teacherId })
            .sort({ createdAt: -1 })
            .limit(5);

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
