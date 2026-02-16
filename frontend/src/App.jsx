import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';

// import ModuleDashboard from '@adhd/pages/adhd/ModuleDashboard';
// import Module1_Entry from '@adhd/pages/adhd/modules/Module1_Entry';
// import Module2_Content from '@adhd/pages/adhd/modules/Module2_Content';
// import Module3_Pacing from '@adhd/pages/adhd/modules/Module3_Pacing';
// import Module4_Progress from '@adhd/pages/adhd/modules/Module4_Progress';
// import Module5_Completion from '@adhd/pages/adhd/modules/Module5_Completion';


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

// Module 4
// Module 4
import Module4Dashboard from './intelligent-recommendation-collaboration/pages/Module4Dashboard';
import Module4Home from './intelligent-recommendation-collaboration/pages/Module4Home';
import PerformanceSubmit from './intelligent-recommendation-collaboration/pages/PerformanceSubmit';

import RecommendationDashboard from './intelligent-recommendation-collaboration/pages/RecommendationDashboard';
import LearningPathTimeline from './intelligent-recommendation-collaboration/pages/LearningPathTimeline';
import CollaborationLobby from './intelligent-recommendation-collaboration/pages/CollaborationLobby';
import CollaborationRoom from './intelligent-recommendation-collaboration/pages/CollaborationRoom';





function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/profile" element={<Profile />} />

      {/* ADHD Module Routes */}
      {/* ADHD Module Routes - Temporarily Disabled */}
      {/* <Route path="/adhd" element={<ModuleDashboard />} /> */}
      {/* <Route path="/adhd/module/entry" element={<Module1_Entry />} /> */}
      {/* <Route path="/adhd/module/content" element={<Module2_Content />} /> */}
      {/* <Route path="/adhd/module/pacing" element={<Module3_Pacing />} /> */}
      {/* <Route path="/adhd/module/progress" element={<Module4_Progress />} /> */}
      {/* <Route path="/adhd/module/completion" element={<Module5_Completion />} /> */}


      {/* Learning Platform - Teacher Routes */}
      <Route path="/teacher-hub" element={<TeacherHub />} />
      <Route path="/teacher/disability/:disabilityId" element={<DisabilityManagement />} />

      {/* Learning Platform - Student Routes */}
      <Route path="/student-tasks" element={<StudentDashboard />} />
      <Route path="/student/read/:assignmentId" element={<LineByLineReader />} />
      <Route path="/student/profile" element={<Profile />} />

      {/* Learning Platform - Parent Routes */}
      <Route path="/parent-dashboard" element={<ParentDashboardMain />} />

      {/* Module 4 Routes */}
      <Route path="/module4" element={<Module4Dashboard />}>
        <Route index element={<Module4Home />} />
        <Route path="performance" element={<PerformanceSubmit />} />

        <Route path="recommendations" element={<RecommendationDashboard />} />
        <Route path="learning-path" element={<LearningPathTimeline />} />
        <Route path="path" element={<LearningPathTimeline />} />
        <Route path="collaboration" element={<CollaborationLobby />} />
        <Route path="collaboration/:roomId" element={<CollaborationRoom />} />
      </Route>




    </Routes>
  );
}

export default App;
