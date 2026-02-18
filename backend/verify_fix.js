import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Assignment from './models/Assignment.js';
import User from './models/User.js';

dotenv.config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/lexfix");
        console.log("Connected to MongoDB");

        const student = await User.findOne({ email: 'student1@gmail.com' });
        if (!student) {
            console.error("Student not found");
            process.exit(1);
        }

        const assignments = await Assignment.find({
            assignedStudents: student._id,
            status: 'active'
        });

        console.log(`\nVerifying for student: ${student.name} (${student._id})`);
        console.log(`Found ${assignments.length} active assignments:`);

        assignments.forEach(a => {
            console.log(`- Title: ${a.title}`);
            console.log(`  Sentences: ${a.sentences?.length || 0}`);
        });

        if (assignments.length > 0) {
            console.log("\n✅ Verification SUCCESS: Student has assignments.");
        } else {
            console.log("\n❌ Verification FAILED: Student still has no assignments.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error verifying data:", error);
        process.exit(1);
    }
};

verify();
