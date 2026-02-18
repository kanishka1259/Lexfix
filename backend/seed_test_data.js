import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Assignment from './models/Assignment.js';
import User from './models/User.js';

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lexfix");
        console.log("Connected to MongoDB");

        // 1. Find a student
        const student = await User.findOne({ email: 'student1@gmail.com' });
        if (!student) {
            console.log("No student1 found. Skipping...");
            process.exit(0);
        }

        // 2. Find a teacher (or create one)
        let teacher = await User.findOne({ role: 'teacher' });
        if (!teacher) {
            teacher = await User.create({
                name: 'Test Teacher',
                email: 'teacher@test.com',
                password: 'password123',
                role: 'teacher'
            });
            console.log("Created test teacher");
        }

        // 3. Create an assignment
        const title = "Welcome to Line-by-Line Reading";
        const content = "This is a test assignment. It has multiple sentences. We are testing the reader. Good luck with your learning!";

        // Remove existing test assignments with same title to avoid clutter
        await Assignment.deleteMany({ title, assignedStudents: student._id });

        const assignment = await Assignment.create({
            title,
            description: "A simple introduction to reading practice.",
            content,
            disability: student.disability[0] || 'adhd',
            teacher: teacher._id,
            assignedStudents: [student._id],
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            status: 'active'
        });

        console.log(`\n✅ Assignment created: ${assignment.title}`);
        console.log(`- ID: ${assignment._id}`);
        console.log(`- Assigned to: ${student.name} (${student._id})`);
        console.log(`- Sentences: ${assignment.sentences.length}`);

        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seed();
