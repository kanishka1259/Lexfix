import { useEffect, useState } from "react";
import { getQA, addQA } from "../../services/api";
import "./qa.css";

function QAPanel() {
  const [qa, setQA] = useState([]);
  const [testName, setTestName] = useState("");
  const [result, setResult] = useState("passed");

  const fetchQA = async () => {
    const data = await getQA();
    setQA(data);
  };

  useEffect(() => {
    fetchQA();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testName) {
      alert("Please enter a test name");
      return;
    }
    await addQA({ testName, result });
    setTestName("");
    setResult("passed");
    fetchQA();
  };

  const getStats = () => {
    const total = qa.length;
    const passed = qa.filter(q => q.result === "passed").length;
    const failed = qa.filter(q => q.result === "failed").length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
    return { total, passed, failed, passRate };
  };

  const stats = getStats();

  const getResultBadge = (result) => {
    const badges = {
      passed: { emoji: "✅", class: "result-passed", text: "Passed" },
      failed: { emoji: "❌", class: "result-failed", text: "Failed" },
      warning: { emoji: "⚠️", class: "result-warning", text: "Warning" },
      skipped: { emoji: "⏭️", class: "result-skipped", text: "Skipped" }
    };
    return badges[result] || badges.passed;
  };

  return (
    <div className="qa-page">
      <div className="page-header">
        <h1>🧪 QA Testing Dashboard</h1>
        <p className="page-subtitle">Track test results and quality metrics</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Tests</div>
          </div>
        </div>
        <div className="stat-card stat-passed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.passed}</div>
            <div className="stat-label">Passed</div>
          </div>
        </div>
        <div className="stat-card stat-failed">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <div className="stat-value">{stats.failed}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>
        <div className="stat-card stat-rate">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.passRate}%</div>
            <div className="stat-label">Pass Rate</div>
          </div>
        </div>
      </div>

      <div className="qa-grid">
        <div className="qa-card">
          <h2>Add Test Result</h2>
          <form onSubmit={handleSubmit} className="qa-form">
            <div className="form-group">
              <label>Test Name</label>
              <input
                type="text"
                placeholder="e.g., User Authentication Test"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>Result</label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className="form-select"
              >
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
                <option value="skipped">Skipped</option>
              </select>
            </div>

            <button type="submit" className="btn-primary">
              Add Test Result
            </button>
          </form>
        </div>

        <div className="qa-card">
          <h2>Test Results</h2>
          {qa.length === 0 ? (
            <p className="empty-state">No test results yet. Add your first test!</p>
          ) : (
            <div className="test-list">
              {qa.map((q) => {
                const badge = getResultBadge(q.result);
                return (
                  <div key={q._id} className="test-item">
                    <div className="test-header">
                      <h3>{q.testName}</h3>
                      <span className={`result-badge ${badge.class}`}>
                        <span className="result-emoji">{badge.emoji}</span>
                        {badge.text}
                      </span>
                    </div>
                    {q.timestamp && (
                      <div className="test-timestamp">
                        {new Date(q.timestamp).toLocaleString()}
                      </div>
                    )}
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

export default QAPanel;
