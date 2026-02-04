import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Hub from "./pages/Hub";

// role-based pages (adjust paths if names differ)
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import ParentDashboard from "./pages/parent/ParentDashboard";

// ADHD Module Pages
import ModuleDashboard from "./pages/adhd/ModuleDashboard";
import Module1_Entry from "./pages/adhd/modules/Module1_Entry";
import Module2_Content from "./pages/adhd/modules/Module2_Content";
import Module3_Pacing from "./pages/adhd/modules/Module3_Pacing";
import Module4_Progress from "./pages/adhd/modules/Module4_Progress";
import Module5_Completion from "./pages/adhd/modules/Module5_Completion";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
    return (
        <Router>
            <div className="app">
                <Routes>
                    {/* PUBLIC ROUTES */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* OPTIONAL HUB (keep only if you really need it) */}
                    <Route
                        path="/hub"
                        element={
                            <ProtectedRoute>
                                <Hub />
                            </ProtectedRoute>
                        }
                    />

                    {/* ADHD MODULE ROUTES */}
                    <Route
                        path="/adhd"
                        element={
                            <ProtectedRoute>
                                <ModuleDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/adhd/module/entry"
                        element={
                            <ProtectedRoute>
                                <Module1_Entry />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/adhd/module/content"
                        element={
                            <ProtectedRoute>
                                <Module2_Content />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/adhd/module/pacing"
                        element={
                            <ProtectedRoute>
                                <Module3_Pacing />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/adhd/module/progress"
                        element={
                            <ProtectedRoute>
                                <Module4_Progress />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/adhd/module/completion"
                        element={
                            <ProtectedRoute>
                                <Module5_Completion />
                            </ProtectedRoute>
                        }
                    />

                    {/* TEACHER */}
                    <Route
                        path="/teacher"
                        element={
                            <ProtectedRoute role="teacher">
                                <TeacherDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* STUDENT (auto-redirect lands here) */}
                    <Route
                        path="/student/:disability"
                        element={
                            <ProtectedRoute role="student">
                                <StudentDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* PARENT */}
                    <Route
                        path="/parent"
                        element={
                            <ProtectedRoute role="parent">
                                <ParentDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
