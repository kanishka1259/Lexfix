import { useEffect, useState } from "react";
import { getMonitoring, addMonitoring } from "../../services/api";

function MonitoringPage() {
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

  const handleSubmit = async () => {
    await addMonitoring({ service, uptime });
    fetchMonitoring();
  };

  return (
    <div>
      <h2>Monitoring</h2>

      <input
        placeholder="Service"
        onChange={(e) => setService(e.target.value)}
      />

      <input
        placeholder="Uptime"
        onChange={(e) => setUptime(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>

      <h3>Monitoring List</h3>
      {monitoring.map((m) => (
        <p key={m._id}>
          {m.service} - {m.uptime}
        </p>
      ))}
    </div>
  );
}

export default MonitoringPage;
