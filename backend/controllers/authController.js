// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

// Register user
export const register = async (req, res) => {
    try {
        const { name, email, password, role, parentEmail, childEmail, disability } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        let parentId = null;
        const normalizedRole = role.toLowerCase();

        // Handle Parent-Child linking during Student registration
        if (normalizedRole === 'student' && parentEmail) {
            const parent = await User.findOne({ email: parentEmail.toLowerCase(), role: 'parent' });
            if (parent) {
                parentId = parent._id;
            }
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: normalizedRole,
            disability: normalizedRole === 'student' ? disability : undefined,
            parentId,
            childEmail: normalizedRole === 'parent' ? childEmail : undefined
        });

        // If student, add to parent's children array
        if (normalizedRole === 'student' && parentId) {
            await User.findByIdAndUpdate(parentId, {
                $push: { children: user._id }
            });
        }

        // If parent, check if child already exists and link them
        if (normalizedRole === 'parent' && childEmail) {
            const child = await User.findOne({ email: childEmail.toLowerCase(), role: 'student' });
            if (child) {
                await User.findByIdAndUpdate(user._id, {
                    $push: { children: child._id }
                });
                await User.findByIdAndUpdate(child._id, {
                    parentId: user._id
                });
            }
        }

        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            disability: user.disability,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            disability: user.disability,
            parentId: user.parentId,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get current user
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Middleware to protect routes
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

// Middleware to check role
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role ${req.user.role} is not authorized` });
        }
        next();
    };
};
