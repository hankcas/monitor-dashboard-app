import { createSimulator } from "../../backend/simulator.js";

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, "");
const TIMEOUT_MS = 1500;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, signal: controller.signal });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Fuente real: el backend Express */
export const apiSource = {
  name: "api",
  getStatus: (limit) => request(`/api/status?limit=${limit}`),
  setRunning: (running) =>
    request("/api/system", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ running }),
    }),
};

/** Fuente demo: el mismo simulador corriendo en el navegador */
export function createDemoSource() {
  const sim = createSimulator();
  return {
    name: "demo",
    getStatus: async (limit) => {
      sim.step();
      return sim.snapshot(limit);
    },
    setRunning: async (running) => {
      sim.setRunning(running);
      return { running };
    },
  };
}
