// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Teacher pages
import TeacherHub from './pages/teacher/TeacherHub';
import DisabilityManagement from './pages/teacher/DisabilityManagement';

// Student pages
import StudentTaskList from './pages/student/StudentTaskList';
import LineByLineReader from './pages/student/LineByLineReader';

// Parent pages  
import ParentDashboardMain from './pages/parent/ParentDashboardMain';

// Components
import PrivateRoute from './components/PrivateRoute';

import './App.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Teacher routes */}
                    <Route path="/teacher-hub" element={<PrivateRoute><TeacherHub /></PrivateRoute>} />
                    <Route path="/teacher/disability/:disabilityId" element={<PrivateRoute><DisabilityManagement /></PrivateRoute>} />

                    {/* Student routes */}
                    <Route path="/student-dashboard" element={<PrivateRoute><StudentTaskList /></PrivateRoute>} />
                    <Route path="/student/read/:assignmentId" element={<PrivateRoute><LineByLineReader /></PrivateRoute>} />

                    {/* Parent routes */}
                    <Route path="/parent-dashboard" element={<PrivateRoute><ParentDashboardMain /></PrivateRoute>} />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
