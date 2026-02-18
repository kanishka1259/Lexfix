function DeploymentList({ deployments }) {
  const getStatusBadge = (status) => {
    const badges = {
      completed: { emoji: "✅", class: "status-completed", text: "Completed" },
      "in-progress": { emoji: "⏳", class: "status-in-progress", text: "In Progress" },
      failed: { emoji: "❌", class: "status-failed", text: "Failed" },
      pending: { emoji: "⏸️", class: "status-pending", text: "Pending" }
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="deployment-card">
      <h2>Deployment History</h2>
      {deployments.length === 0 ? (
        <p className="empty-state">No deployments yet. Add your first deployment to get started!</p>
      ) : (
        <div className="deployment-list">
          {deployments.map((d) => {
            const badge = getStatusBadge(d.status);
            return (
              <div key={d._id} className="deployment-item">
                <div className="deployment-header">
                  <h3>{d.name}</h3>
                  <span className={`status-badge ${badge.class}`}>
                    <span className="status-emoji">{badge.emoji}</span>
                    {badge.text}
                  </span>
                </div>
                <div className="deployment-details">
                  <span className="version-tag">Version: {d.version}</span>
                  {d.timestamp && (
                    <span className="timestamp">
                      {new Date(d.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DeploymentList;
