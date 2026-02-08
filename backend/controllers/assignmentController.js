// controllers/assignmentController.js
import Assignment from "../models/Assignment.js";
import User from "../models/User.js";
import Submission from "../models/Submission.js";

// Create new assignment (teacher only)
export const createAssignment = async (req, res) => {
    try {
        const { title, description, content, disability, assignedStudents, dueDate } = req.body;

        const assignment = await Assignment.create({
            title,
            description,
            content,
            disability,
            teacher: req.user._id,
            assignedStudents,
            dueDate
        });

        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all assignments by disability type (teacher view)
export const getAssignmentsByDisability = async (req, res) => {
    try {
        const { disability } = req.params;

        const assignments = await Assignment.find({
            disability,
            teacher: req.user._id,
            status: 'active'
        })
            .populate('assignedStudents', 'name email')
            .sort({ createdAt: -1 });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get assignments for a specific student
export const getStudentAssignments = async (req, res) => {
    try {
        const studentId = req.user.role === 'student' ? req.user._id : req.params.studentId;

        // Fetch all assignments assigned to this student
        const assignments = await Assignment.find({
            assignedStudents: studentId,
            status: 'active'
        })
            .populate('teacher', 'name email')
            .sort({ dueDate: 1 });

        // Fetch submissions for this student to determine status
        const submissions = await Submission.find({ student: studentId });

        // Map status to assignments
        const assignmentsWithStatus = assignments.map(assignment => {
            const submission = submissions.find(s => s.assignment.toString() === assignment._id.toString());
            return {
                ...assignment.toObject(),
                submissionStatus: submission ? submission.status : 'not-started',
                completedAt: submission ? submission.completedAt : null
            };
        });

        res.json(assignmentsWithStatus);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single assignment
export const getAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate('teacher', 'name email')
            .populate('assignedStudents', 'name email');

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update assignment
export const updateAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check if user is the teacher who created it
        if (assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updated = await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete assignment
export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }

        // Check if user is the teacher who created it
        if (assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Assignment.findByIdAndDelete(req.params.id);

        res.json({ message: "Assignment deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get students by disability (for teacher to assign tasks)
export const getStudentsByDisability = async (req, res) => {
    try {
        const { disability } = req.params;

        const students = await User.find({
            role: 'student',
            disability
        }).select('name email disability');

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
