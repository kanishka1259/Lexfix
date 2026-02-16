import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect routes using Lexfix auth
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token with same secret as Lexfix backend
            console.log("Verifying token:", token); // DEBUG LOG
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lexfix-secret-key-2024');
            console.log("Decoded token:", decoded); // DEBUG LOG

            // Get user from Lexfix backend directly via DB
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log("User not found for ID:", decoded.id); // DEBUG LOG
                return res.status(401).json({ message: "Not authorized, user not found" });
            }

            next();
        } catch (error) {
            console.error('Auth verify error:', error.message); // DEBUG LOG
            console.error('Token received:', token); // DEBUG LOG
            return res.status(401).json({ message: "Not authorized, token failed: " + error.message });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};
