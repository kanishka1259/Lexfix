// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'parent'],
        required: true
    },
    // For students - disability type
    disability: {
        type: String,
        enum: ['adhd', 'autism', 'dyslexia', 'dyscalculia', 'dysgraphia'],
        required: function () {
            return this.role === 'student';
        }
    },
    // For students - link to parent (optional)
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // For parents - list of children
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // For parents - child email for linking
    childEmail: {
        type: String
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
