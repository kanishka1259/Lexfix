function DeploymentList({ deployments }) {
  return (
    <div>
      <h2>Deployment List</h2>

      {deployments.map((d) => (
        <p key={d._id}>
          {d.name} - {d.version} - {d.status}
        </p>
      ))}
    </div>
  );
}

export default DeploymentList;
