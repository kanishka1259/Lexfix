import DeploymentPage from "./components/deployment/DeploymentPage";
import MonitoringPage from "./components/monitoring/MonitoringPanel";
import QAPage from "./components/qa/QAPanel";
import PerformancePage from "./components/performance/PerformancePanel";

function App() {
  return (
    <div>
      <h1>Accessibility Deployment Dashboard</h1>

      <DeploymentPage />
      <MonitoringPage />
      <QAPage />
      <PerformancePage />
    </div>
  );
}

export default App;
