import mongoose from 'mongoose';

async function debug() {
    try {
        await mongoose.connect('mongodb://localhost:27017/lexfix');
        const db = mongoose.connection.db;

        const users = await db.collection('users').find({ role: 'student' }).toArray();
        console.log('--- USERS ---');
        users.forEach(u => console.log(`${u._id} | ${u.email} | ${u.name}`));

        const assignments = await db.collection('assignments').find({}).toArray();
        console.log('\n--- ASSIGNMENTS ---');
        assignments.forEach(a => console.log(`${a._id} | ${a.title} | ${a.status} | Students: ${a.assignedStudents}`));

        const tasks = await db.collection('tasks').find({}).toArray();
        console.log('\n--- TASKS ---');
        tasks.forEach(t => console.log(`${t._id} | ${t.title} | ${t.status} | Assigned: ${t.assignedTo}`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
