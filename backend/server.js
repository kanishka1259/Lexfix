import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adhdRoutes from "./routes/adhdRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// Learning Platform Routes
import assignmentRoutes from "./routes_learning/assignments.js";
import submissionRoutes from "./routes_learning/submissions.js";
import parentRoutes from "./routes_learning/parent.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.use(cors({
    origin: true, // Allow any origin in dev
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/adhd", adhdRoutes);
app.use("/api/tasks", taskRoutes);

// Learning Platform Routes
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/parent", parentRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "🔐 Lexfix Authentication API is running!",
        version: "2.0.0",
        endpoints: {
            auth: "POST /api/auth/register | POST /api/auth/login | GET /api/auth/me",
            assignments: "GET/POST /api/assignments",
            submissions: "POST /api/submissions",
            parent: "POST /api/parent/link-child | GET /api/parent/children"
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Lexfix Auth Server running on port ${PORT}`);
});
