import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || "lexfix-secret-key-2024",
        { expiresIn: "30d" }
    );
};

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
    try {
        const { name, email, password, role, disability, parentEmail, childEmail } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // normalize role
        const normalizedRole = role.toLowerCase();

        if (!["student", "teacher", "parent"].includes(normalizedRole)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        // student MUST have disability
        if (normalizedRole === "student" && (!disability || disability.length === 0)) {
            return res.status(400).json({ message: "At least one disability is required for students" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        let parentId = null;

        // Student registering: Link to parent by email
        if (normalizedRole === "student" && parentEmail) {
            const parent = await User.findOne({
                email: parentEmail,
                role: "parent"
            });

            if (parent) {
                parentId = parent._id;
            }
        }

        // Ensure disability is stored as an array
        let disabilityArray = undefined;
        if (normalizedRole === "student") {
            disabilityArray = Array.isArray(disability) ? disability : [disability];
            // lowercase all
            disabilityArray = disabilityArray.map(d => d.toLowerCase());
        }

        const user = await User.create({
            name,
            email,
            password,
            role: normalizedRole,
            disability: disabilityArray,
            parentId
        });

        // Parent registering: Link existing students by email
        if (normalizedRole === "parent" && childEmail) {
            await User.updateMany(
                { email: childEmail.toLowerCase(), role: "student" },
                { parentId: user._id }
            );
        }

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                disability: user.disability,
                token
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id, user.role);

        res.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                disability: user.disability, // frontend auto-redirect uses this
                token
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   GET CURRENT USER
========================= */
export const getMe = async (req, res) => {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ success: true, data: user });
};

/* =========================
   GET ALL STUDENTS (Teacher)
========================= */
export const getAllStudents = async (req, res) => {
    const students = await User.find({ role: "student" }).select("-password");
    res.json({
        success: true,
        count: students.length,
        data: students
    });
};

/* =========================
   GET CHILDREN (Parent)
========================= */
export const getChildren = async (req, res) => {
    try {
        if (req.user.role !== 'parent') {
            return res.status(403).json({ message: "Only parents can view students" });
        }

        const children = await User.find({ parentId: req.user.id }).select("-password");
        res.json({ success: true, data: children });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* =========================
   AUTH MIDDLEWARE
========================= */
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || "lexfix-secret-key-2024"
            );

            req.user = decoded;
            return next();
        } catch (err) {
            return res.status(401).json({ message: "Token invalid" });
        }
    }

    return res.status(401).json({ message: "No token provided" });
};

/* =========================
   ROLE AUTHORIZATION
========================= */
export const authorize = (...roles) => {
    return (req, res, next) => {
        // normalize roles array to lowercase
        const lowerRoles = roles.map(r => r.toLowerCase());
        const userRole = req.user?.role?.toLowerCase();

        if (!req.user || !lowerRoles.includes(userRole)) {
            return res.status(403).json({
                message: `Role ${req.user?.role || 'unknown'} is not authorized to access this resource`
            });
        }
        next();
    };
};
