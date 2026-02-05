import { useState } from "react";
import { addDeployment } from "../../services/api";

function DeploymentForm({ refreshList }) {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    await addDeployment({ name, version, status });
    alert("Deployment added");
    refreshList(); // 🔥 refresh list after adding
  };

  return (
    <div>
      <h2>Add Deployment</h2>

      <input
        placeholder="Platform Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Version"
        onChange={(e) => setVersion(e.target.value)}
      />

      <input
        placeholder="Status"
        onChange={(e) => setStatus(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default DeploymentForm;
