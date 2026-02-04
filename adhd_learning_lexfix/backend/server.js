import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import adhdRoutes from "./routes/adhdRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // ADHD frontend & Lexfix
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/adhd", adhdRoutes);
app.use("/api/tasks", taskRoutes); // Registering the task routes
app.use("/api/sessions", sessionRoutes);
app.use("/api/progress", progressRoutes);

// Health check
app.get("/", (req, res) => {
    res.json({
        message: "🧠 ADHD Learning API is running!",
        version: "2.1.0",
        note: "Authentication handled by Lexfix backend (port 5000)",
        endpoints: {
            adhd: "/api/adhd/*",
            tasks: "/api/tasks/*",
            sessions: "/api/sessions/*",
            progress: "/api/progress/*"
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 ADHD Learning Server running on port ${PORT}`);
    console.log(`🔐 Using Lexfix Auth at http://localhost:5000`);
});
