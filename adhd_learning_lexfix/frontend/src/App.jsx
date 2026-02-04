import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import ModuleDashboard from './pages/ModuleDashboard';
import Module1_Entry from './pages/modules/Module1_Entry';
import Module2_Content from './pages/modules/Module2_Content';
import Module3_Pacing from './pages/modules/Module3_Pacing';
import Module4_Progress from './pages/modules/Module4_Progress';
import Module5_Completion from './pages/modules/Module5_Completion';
import './App.css';

import TokenHandler from './components/TokenHandler';

function App() {
    return (
        <Router>
            <TokenHandler>
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<ModuleDashboard />} />
                        <Route path="/module/entry" element={<Module1_Entry />} />
                        <Route path="/module/content" element={<Module2_Content />} />
                        <Route path="/module/pacing" element={<Module3_Pacing />} />
                        <Route path="/module/progress" element={<Module4_Progress />} />
                        <Route path="/module/completion" element={<Module5_Completion />} />
                    </Route>
                    {/* Catch all redirect to dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </TokenHandler>
        </Router>
    );
}

export default App;
