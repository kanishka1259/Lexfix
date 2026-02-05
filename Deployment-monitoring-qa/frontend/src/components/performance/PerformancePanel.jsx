import { useEffect, useState } from "react";
import { getPerformance, addPerformance } from "../../services/api";

function PerformancePage() {
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

  const handleSubmit = async () => {
    await addPerformance({ metric, value });
    fetchPerformance();
  };

  return (
    <div>
      <h2>Performance</h2>

      <input
        placeholder="Metric"
        onChange={(e) => setMetric(e.target.value)}
      />

      <input
        placeholder="Value"
        onChange={(e) => setValue(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>

      <h3>Performance List</h3>
      {performance.map((p) => (
        <p key={p._id}>
          {p.metric} - {p.value}
        </p>
      ))}
    </div>
  );
}

export default PerformancePage;
