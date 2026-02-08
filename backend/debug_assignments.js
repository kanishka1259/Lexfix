import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Assignment from './models/Assignment.js';
import User from './models/User.js';

dotenv.config();

const debug = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/lexfix");
        console.log("Connected to MongoDB");

        const users = await User.find({ role: 'student' });
        console.log(`\nFound ${users.length} students:`);
        users.forEach(u => console.log(`- ${u.name} (${u.email}) ID: ${u._id} Disability: ${u.disability}`));

        const assignments = await Assignment.find();
        console.log(`\nFound ${assignments.length} assignments:`);
        assignments.forEach(a => {
            console.log(`- Title: ${a.title}`);
            console.log(`  Assigned Students: ${a.assignedStudents}`);
            console.log(`  Status: ${a.status}`);
            console.log(`  Sentences Count: ${a.sentences?.length || 0}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

debug();
