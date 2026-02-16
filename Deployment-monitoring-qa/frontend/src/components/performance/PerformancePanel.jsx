import { useEffect, useState } from "react";
import { getPerformance, addPerformance } from "../../services/api";
import "./performance.css";

function PerformancePanel() {
  const [performance, setPerformance] = useState([]);
  const [metric, setMetric] = useState("");
  const [value, setValue] = useState("");

  const fetchPerformance = async () => {
    const data = await getPerformance();
    setPerformance(data);
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metric || !value) {
      alert("Please fill in all fields");
      return;
    }
    await addPerformance({ metric, value });
    setMetric("");
    setValue("");
    fetchPerformance();
  };

  const getMetricIcon = (metricName) => {
    const lower = metricName.toLowerCase();
    if (lower.includes("cpu") || lower.includes("processor")) return "⚡";
    if (lower.includes("memory") || lower.includes("ram")) return "💾";
    if (lower.includes("disk") || lower.includes("storage")) return "🖥️";
    if (lower.includes("network") || lower.includes("bandwidth")) return "📡";
    if (lower.includes("response") || lower.includes("latency")) return "⏱️";
    if (lower.includes("throughput") || lower.includes("requests")) return "📊";
    if (lower.includes("error") || lower.includes("failure")) return "⚠️";
    return "📈";
  };

  const getMetricColor = (metricName, value) => {
    const numValue = parseFloat(value);
    const lower = metricName.toLowerCase();

    // CPU/Memory usage - lower is better
    if (lower.includes("cpu") || lower.includes("memory")) {
      if (numValue < 50) return "metric-excellent";
      if (numValue < 70) return "metric-good";
      if (numValue < 85) return "metric-warning";
      return "metric-critical";
    }

    // Response time - lower is better
    if (lower.includes("response") || lower.includes("latency")) {
      if (numValue < 100) return "metric-excellent";
      if (numValue < 300) return "metric-good";
      if (numValue < 500) return "metric-warning";
      return "metric-critical";
    }

    // Default - higher is better
    if (numValue > 90) return "metric-excellent";
    if (numValue > 70) return "metric-good";
    if (numValue > 50) return "metric-warning";
    return "metric-critical";
  };

  return (
    <div className="performance-page">
      <div className="page-header">
        <h1>⚡ Performance Metrics</h1>
        <p className="page-subtitle">Monitor system performance and resource usage</p>
      </div>

      <div className="performance-grid">
        <div className="performance-card">
          <h2>Add Performance Metric</h2>
          <form onSubmit={handleSubmit} className="performance-form">
            <div className="form-group">
              <label htmlFor="metric-input">Metric Name</label>
              <input
                id="metric-input"
                type="text"
                placeholder="e.g., CPU Usage, Response Time"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="value-input">Value</label>
              <input
                id="value-input"
                type="number"
                step="0.01"
                placeholder="e.g., 45.5"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-primary">
              Add Metric
            </button>
          </form>
        </div>

        <div className="performance-card">
          <h2>Performance Overview</h2>
          {performance.length === 0 ? (
            <p className="empty-state">No performance metrics yet. Add your first metric!</p>
          ) : (
            <div className="metrics-grid">
              {performance.map((p) => {
                const icon = getMetricIcon(p.metric);
                const colorClass = getMetricColor(p.metric, p.value);
                return (
                  <div key={p._id} className={`metric-card ${colorClass}`}>
                    <div className="metric-icon">{icon}</div>
                    <div className="metric-content">
                      <div className="metric-name">{p.metric}</div>
                      <div className="metric-value">{p.value}</div>
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

export default PerformancePanel;
