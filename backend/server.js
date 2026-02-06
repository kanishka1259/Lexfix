import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import adhdRoutes from "./routes/adhdRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import assignmentRoutes from "./routes/assignments.js";
import submissionRoutes from "./routes/submissions.js";
import parentRoutes from "./routes/parent.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // ADHD frontend & Lexfix
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/adhd", adhdRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/parent", parentRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "🧠 ADHD Learning API is running!",
        version: "2.1.0",
        note: "Full-featured learning platform for disabilities",
        endpoints: {
            auth: "/api/auth/*",
            adhd: "/api/adhd/*",
            tasks: "/api/tasks/*",
            sessions: "/api/sessions/*",
            progress: "/api/progress/*",
            assignments: "/api/assignments/*",
            submissions: "/api/submissions/*",
            parent: "/api/parent/*"
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 ADHD Learning Server running on port ${PORT}`);
    console.log(`🔐 Using Lexfix Auth at http://localhost:5000`);
});
