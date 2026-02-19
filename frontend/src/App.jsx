import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

import ModuleDashboard from '@/pages/adhd/ModuleDashboard';
import Module1_Entry from '@/pages/adhd/modules/Module1_Entry';
import Module2_Content from '@/pages/adhd/modules/Module2_Content';
import Module3_Pacing from '@/pages/adhd/modules/Module3_Pacing';
import Module4_Progress from '@/pages/adhd/modules/Module4_Progress';
import Module5_Completion from '@/pages/adhd/modules/Module5_Completion';

// Learning Platform - Teacher
import TeacherHub from '@/pages/teacher/TeacherHub';
import DisabilityManagement from '@/pages/teacher/DisabilityManagement';

// Learning Platform - Student
import StudentDashboard from '@/pages/StudentDashboard';
import StudentTaskList from '@/pages/student/StudentTaskList';
import LineByLineReader from '@/pages/student/LineByLineReader';
import Profile from '@/pages/student/Profile';

// Learning Platform - Parent  
import ParentDashboardMain from '@/pages/parent/ParentDashboardMain';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<Profile />} />

      {/* ADHD Module Routes */}
      <Route path="/adhd" element={<ModuleDashboard />} />
      <Route path="/adhd/module/entry" element={<Module1_Entry />} />
      <Route path="/adhd/module/content" element={<Module2_Content />} />
      <Route path="/adhd/module/pacing" element={<Module3_Pacing />} />
      <Route path="/adhd/module/progress" element={<Module4_Progress />} />
      <Route path="/adhd/module/completion" element={<Module5_Completion />} />

      {/* Learning Platform - Teacher Routes */}
      <Route path="/teacher-hub" element={<TeacherHub />} />
      <Route path="/teacher/disability/:disabilityId" element={<DisabilityManagement />} />

      {/* Learning Platform - Student Routes */}
      <Route path="/student-tasks" element={<StudentDashboard />} />
      <Route path="/student/read/:assignmentId" element={<LineByLineReader />} />
      <Route path="/student/profile" element={<Profile />} />

      {/* Learning Platform - Parent Routes */}
      <Route path="/parent-dashboard" element={<ParentDashboardMain />} />
    </Routes>
  );
}

export default App;
