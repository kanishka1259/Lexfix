import DeploymentForm from "../components/deployment/DeploymentForm";
import DeploymentList from "../components/deployment/DeploymentList";
import MonitoringPanel from "../components/monitoring/MonitoringPanel";
import QAPanel from "../components/qa/QAPanel";
import PerformancePanel from "../components/performance/PerformancePanel";

export default function Dashboard(){
  return(
    <div>

      <h1>Accessibility Deployment Dashboard</h1>

      <DeploymentForm/>
      <DeploymentList/>

      <MonitoringPanel/>
      <QAPanel/>
      <PerformancePanel/>

    </div>
  );
}
