import jwt from "jsonwebtoken";
import axios from "axios";

// Middleware to protect routes using Lexfix auth
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token with same secret as Lexfix backend
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lexfix-secret-key-2024');

            // Get user from Lexfix backend
            const response = await axios.get('http://localhost:5000/api/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            req.user = response.data.data;
            next();
        } catch (error) {
            console.error('Auth error:', error.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};
