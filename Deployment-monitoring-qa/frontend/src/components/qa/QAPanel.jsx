import { useEffect, useState } from "react";
import { getQA, addQA } from "../../services/api";

function QAPage() {
  const [qa, setQA] = useState([]);
  const [testName, setTestName] = useState("");
  const [result, setResult] = useState("");

  const fetchQA = async () => {
    const data = await getQA();
    setQA(data);
  };

  useEffect(() => {
    fetchQA();
  }, []);

  const handleSubmit = async () => {
    await addQA({ testName, result });
    fetchQA();
  };

  return (
    <div>
      <h2>QA Results</h2>

      <input
        placeholder="Test Name"
        onChange={(e) => setTestName(e.target.value)}
      />

      <input
        placeholder="Result"
        onChange={(e) => setResult(e.target.value)}
      />

      <button onClick={handleSubmit}>Submit</button>

      <h3>QA List</h3>
      {qa.map((q) => (
        <p key={q._id}>
          {q.testName} - {q.result}
        </p>
      ))}
    </div>
  );
}

export default QAPage;
