import { useState } from "react";
import { addDeployment } from "../../services/api";

function DeploymentForm({ refreshList }) {
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [status, setStatus] = useState("pending");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !version) {
      alert("Please fill in all fields");
      return;
    }
    await addDeployment({ name, version, status });
    alert("Deployment added successfully!");
    setName("");
    setVersion("");
    setStatus("pending");
    refreshList();
  };

  return (
    <div className="deployment-card">
      <h2>Add New Deployment</h2>
      <form onSubmit={handleSubmit} className="deployment-form">
        <div className="form-group">
          <label>Platform Name</label>
          <input
            type="text"
            placeholder="e.g., Production API"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Version</label>
          <input
            type="text"
            placeholder="e.g., v1.2.3"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="status-select">Status</label>
          <select
            id="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">
          Add Deployment
        </button>
      </form>
    </div>
  );
}

export default DeploymentForm;
