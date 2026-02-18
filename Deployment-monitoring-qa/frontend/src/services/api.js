const BASE_URL = "http://localhost:5000";

/* ---------- DEPLOYMENT ---------- */
export const getDeployments = async () => {
  const res = await fetch(`${BASE_URL}/deployment`);
  return res.json();
};

export const addDeployment = async (data) => {
  const res = await fetch(`${BASE_URL}/deployment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

/* ---------- MONITORING ---------- */
export const getMonitoring = async () => {
  const res = await fetch(`${BASE_URL}/monitoring`);
  return res.json();
};

export const addMonitoring = async (data) => {
  const res = await fetch(`${BASE_URL}/monitoring`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

/* ---------- QA ---------- */
export const getQA = async () => {
  const res = await fetch(`${BASE_URL}/qa`);
  return res.json();
};

export const addQA = async (data) => {
  const res = await fetch(`${BASE_URL}/qa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

/* ---------- PERFORMANCE ---------- */
export const getPerformance = async () => {
  const res = await fetch(`${BASE_URL}/performance`);
  return res.json();
};

export const addPerformance = async (data) => {
  const res = await fetch(`${BASE_URL}/performance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
