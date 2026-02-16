import { useEffect, useState } from "react";
import { getMonitoring, addMonitoring } from "../../services/api";
import "./monitoring.css";

function MonitoringPanel() {
  const [monitoring, setMonitoring] = useState([]);
  const [service, setService] = useState("");
  const [uptime, setUptime] = useState("");

  const fetchMonitoring = async () => {
    const data = await getMonitoring();
    setMonitoring(data);
  };

  useEffect(() => {
    fetchMonitoring();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service || !uptime) {
      alert("Please fill in all fields");
      return;
    }
    await addMonitoring({ service, uptime });
    setService("");
    setUptime("");
    fetchMonitoring();
  };

  const getUptimeColor = (uptime) => {
    const uptimeNum = parseFloat(uptime);
    if (uptimeNum >= 99.9) return "uptime-excellent";
    if (uptimeNum >= 99.0) return "uptime-good";
    if (uptimeNum >= 95.0) return "uptime-warning";
    return "uptime-critical";
  };

  return (
    <div className="monitoring-page">
      <div className="page-header">
        <h1>📊 System Monitoring</h1>
        <p className="page-subtitle">Track service health and uptime metrics</p>
      </div>

      <div className="monitoring-grid">
        <div className="monitoring-card">
          <h2>Add Service Monitor</h2>
          <form onSubmit={handleSubmit} className="monitoring-form">
            <div className="form-group">
              <label htmlFor="service-input">Service Name</label>
              <input
                id="service-input"
                type="text"
                placeholder="e.g., API Server"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="uptime-input">Uptime (%)</label>
              <input
                id="uptime-input"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="e.g., 99.95"
                value={uptime}
                onChange={(e) => setUptime(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-primary">
              Add Monitor
            </button>
          </form>
        </div>

        <div className="monitoring-card">
          <h2>Service Status</h2>
          {monitoring.length === 0 ? (
            <p className="empty-state">No services monitored yet. Add your first service!</p>
          ) : (
            <div className="service-grid">
              {monitoring.map((m) => {
                const uptimeNum = parseFloat(m.uptime);
                const uptimeColor = getUptimeColor(m.uptime);
                return (
                  <div key={m._id} className="service-card">
                    <div className="service-header">
                      <h3>{m.service}</h3>
                      <div className={`status-indicator ${uptimeColor}`}></div>
                    </div>
                    <div className="uptime-display">
                      <span className="uptime-percentage">{m.uptime}%</span>
                      <span className="uptime-label">Uptime</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${uptimeColor}`}
                        style={{ width: `${Math.min(uptimeNum, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonitoringPanel;
