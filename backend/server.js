import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adhdRoutes from "./routes/adhdRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173'], // Only main frontend now
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/adhd", adhdRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "🔐 Lexfix Authentication API is running!",
        version: "1.0.0",
        endpoints: {
            register: "POST /api/auth/register",
            login: "POST /api/auth/login",
            me: "GET /api/auth/me"
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Lexfix Auth Server running on port ${PORT}`);
});
