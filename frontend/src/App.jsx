import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import DashboardPage from '@/pages/DashboardPage';

import ModuleDashboard from '@adhd/pages/adhd/ModuleDashboard';
import Module1_Entry from '@adhd/pages/adhd/modules/Module1_Entry';
import Module2_Content from '@adhd/pages/adhd/modules/Module2_Content';
import Module3_Pacing from '@adhd/pages/adhd/modules/Module3_Pacing';
import Module4_Progress from '@adhd/pages/adhd/modules/Module4_Progress';
import Module5_Completion from '@adhd/pages/adhd/modules/Module5_Completion';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* ADHD Module Routes */}
      <Route path="/adhd" element={<ModuleDashboard />} />
      <Route path="/adhd/module/entry" element={<Module1_Entry />} />
      <Route path="/adhd/module/content" element={<Module2_Content />} />
      <Route path="/adhd/module/pacing" element={<Module3_Pacing />} />
      <Route path="/adhd/module/progress" element={<Module4_Progress />} />
      <Route path="/adhd/module/completion" element={<Module5_Completion />} />
    </Routes>
  );
}

export default App;
