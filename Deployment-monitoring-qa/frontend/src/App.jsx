import { useState } from 'react';
import DeploymentPage from './components/deployment/DeploymentPage';
import MonitoringPanel from './components/monitoring/MonitoringPanel';
import QAPanel from './components/qa/QAPanel';
import PerformancePanel from './components/performance/PerformancePanel';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('deployment');

  const renderContent = () => {
    switch(activeTab) {
      case 'deployment':
        return <DeploymentPage />;
      case 'monitoring':
        return <MonitoringPanel />;
      case 'qa':
        return <QAPanel />;
      case 'performance':
        return <PerformancePanel />;
      default:
        return <DeploymentPage />;
    }
  };

  return (
    <div className="App">
      <nav className="nav-header">
        <div className="nav-container">
          <a href="/" className="logo">Lexfix</a>
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'deployment' ? 'active' : ''}`}
              onClick={() => setActiveTab('deployment')}
            >
              Deployment
            </button>
            <button 
              className={`nav-tab ${activeTab === 'monitoring' ? 'active' : ''}`}
              onClick={() => setActiveTab('monitoring')}
            >
              Monitoring
            </button>
            <button 
              className={`nav-tab ${activeTab === 'qa' ? 'active' : ''}`}
              onClick={() => setActiveTab('qa')}
            >
              QA Testing
            </button>
            <button 
              className={`nav-tab ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </button>
          </div>
        </div>
      </nav>
      
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
