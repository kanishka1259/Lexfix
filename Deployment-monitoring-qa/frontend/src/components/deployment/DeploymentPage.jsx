import { useEffect, useState } from "react";
import DeploymentForm from "./DeploymentForm";
import DeploymentList from "./DeploymentList";
import { getDeployments } from "../../services/api";

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
    <div>
      <DeploymentForm refreshList={fetchDeployments} />
      <DeploymentList deployments={deployments} />
    </div>
  );
}

export default DeploymentPage;
