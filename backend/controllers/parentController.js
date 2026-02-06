// controllers/parentController.js
import User from "../models/User.js";
import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";

// Link child by email
export const linkChild = async (req, res) => {
    try {
        const { childEmail } = req.body;

        // Find child by email
        const child = await User.findOne({ email: childEmail, role: 'student' });

        if (!child) {
            return res.status(404).json({ message: "Student not found with that email" });
        }

        // Update parent's children array
        const parent = await User.findById(req.user._id);

        if (!parent.children.includes(child._id)) {
            parent.children.push(child._id);
            await parent.save();
        }

        // Update child's parent reference
        child.parentId = req.user._id;
        await child.save();

        res.json({
            message: "Child linked successfully",
            child: {
                _id: child._id,
                name: child.name,
                email: child.email,
                disability: child.disability
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get parent's children
export const getChildren = async (req, res) => {
    try {
        const parent = await User.findById(req.user._id)
            .populate('children', 'name email disability');

        res.json(parent.children || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get child's progress
export const getChildProgress = async (req, res) => {
    try {
        const { childId } = req.params;

        // Verify this child belongs to the parent
        const parent = await User.findById(req.user._id);
        if (!parent.children.includes(childId)) {
            return res.status(403).json({ message: "Not authorized to view this child's progress" });
        }

        // Get all submissions for the child
        const submissions = await Submission.find({ student: childId })
            .populate('assignment')
            .sort({ updatedAt: -1 });

        // Calculate overall statistics
        const totalAssignments = submissions.length;
        const completedAssignments = submissions.filter(s => s.status === 'completed').length;
        const totalTimeSpent = submissions.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
        const totalDistractions = submissions.reduce((sum, s) => sum + (s.distractionCount || 0), 0);
        const totalBreaks = submissions.reduce((sum, s) => sum + (s.breaksTaken || 0), 0);

        res.json({
            child: await User.findById(childId).select('name email disability'),
            statistics: {
                totalAssignments,
                completedAssignments,
                inProgressAssignments: totalAssignments - completedAssignments,
                totalTimeSpent,
                totalDistractions,
                totalBreaks,
                averageTimePerAssignment: totalAssignments > 0 ? totalTimeSpent / totalAssignments : 0
            },
            submissions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get child's assignments
export const getChildAssignments = async (req, res) => {
    try {
        const { childId } = req.params;

        // Verify this child belongs to the parent
        const parent = await User.findById(req.user._id);
        if (!parent.children.includes(childId)) {
            return res.status(403).json({ message: "Not authorized to view this child's assignments" });
        }

        const assignments = await Assignment.find({
            assignedStudents: childId,
            status: 'active'
        })
            .populate('teacher', 'name email')
            .sort({ dueDate: 1 });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
