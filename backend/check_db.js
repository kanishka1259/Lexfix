import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    role: String
}));

const Assignment = mongoose.model('Assignment', new mongoose.Schema({
    title: String,
    assignedStudents: [mongoose.Schema.Types.ObjectId],
    status: String
}));

const Task = mongoose.model('Task', new mongoose.Schema({
    title: String,
    assignedTo: [mongoose.Schema.Types.ObjectId],
    status: String
}));

async function debug() {
    try {
        await mongoose.connect('mongodb://localhost:27017/lexfix');

        const students = await User.find({ role: 'student' });
        console.log('--- Students ---');
        for (const s of students) {
            console.log(`NAME: ${s.name} | EMAIL: ${s.email} | ID: ${s._id.toString()}`);
        }

        const assignments = await Assignment.find({});
        console.log('\n--- Assignments ---');
        for (const a of assignments) {
            console.log(`TITLE: ${a.title} | STATUS: ${a.status} | ASSIGNED: ${a.assignedStudents.map(id => id.toString()).join(', ')}`);
        }

        const tasks = await Task.find({});
        console.log('\n--- Tasks ---');
        for (const t of tasks) {
            console.log(`TITLE: ${t.title} | STATUS: ${t.status} | ASSIGNED: ${t.assignedTo.map(id => id.toString()).join(', ')}`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
