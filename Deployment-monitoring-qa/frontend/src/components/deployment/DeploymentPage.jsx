import { useEffect, useState } from "react";
import DeploymentForm from "./DeploymentForm";
import DeploymentList from "./DeploymentList";
import { getDeployments } from "../../services/api";
import "./deployment.css";

function DeploymentPage() {
  const [deployments, setDeployments] = useState([]);

  const fetchDeployments = async () => {
    const data = await getDeployments();
    setDeployments(data);
  };

  useEffect(() => {
    fetchDeployments();
  }, []);

  return (
    <div className="deployment-page">
      <div className="page-header">
        <h1>🚀 Deployment Management</h1>
        <p className="page-subtitle">Manage and track your deployment pipeline</p>
      </div>
      <div className="deployment-grid">
        <DeploymentForm refreshList={fetchDeployments} />
        <DeploymentList deployments={deployments} />
      </div>
    </div>
  );
}

export default DeploymentPage;
