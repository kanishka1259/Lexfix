import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Assignment from './models/Assignment.js';
import Task from './models/Task.js';

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lexfix');
        console.log('Connected to MongoDB');

        const students = await User.find({ role: /student/i });
        console.log('\n--- ALL STUDENTS ---');
        console.log(JSON.stringify(students.map(s => ({ id: s._id, name: s.name, email: s.email, disability: s.disability })), null, 2));

        const assignments = await Assignment.find({});
        console.log('\n--- ALL ASSIGNMENTS ---');
        console.log(JSON.stringify(assignments.map(a => ({ id: a._id, title: a.title, students: a.assignedStudents })), null, 2));

        const tasks = await Task.find({});
        console.log('\n--- ALL TASKS ---');
        console.log(JSON.stringify(tasks.map(t => ({ id: t._id, title: t.title, assignedTo: t.assignedTo })), null, 2));
        if (tasks.length > 0 && tasks[0].assignedTo.length > 0) {
            console.log('\n--- TASK-STUDENT ID TYPE CHECK ---');
            console.log('Task assignedTo[0] type:', typeof tasks[0].assignedTo[0], tasks[0].assignedTo[0].constructor.name);
        }

        process.exit();
    } catch (error) {
        console.error('DB Check error:', error);
        process.exit(1);
    }
};

checkDB();
