import express from "express";
import cors from "cors";
import { SENSORS, THRESHOLDS, SAMPLE_MS, createSimulator } from "./simulator.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const plant = createSimulator();

// Los sensores se leen en el servidor cada 2 s, haya o no clientes conectados
setInterval(plant.step, SAMPLE_MS);

app.get("/", (req, res) => {
  res.json({ name: "Monitor Dashboard API", status: "ok" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: Math.round(process.uptime()) });
});

// Configuración de sensores y umbrales
app.get("/api/sensors", (req, res) => {
  res.json({ sensors: SENSORS, thresholds: THRESHOLDS, sampleMs: SAMPLE_MS });
});

// Estado completo: última lectura, niveles, historial y alarmas
app.get("/api/status", (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 60);
  res.json(plant.snapshot(limit));
});

// Encender o apagar el sistema: { "running": true | false }
app.post("/api/system", (req, res) => {
  const { running } = req.body ?? {};
  if (typeof running !== "boolean") {
    return res.status(400).json({ error: "El campo 'running' debe ser true o false" });
  }
  plant.setRunning(running);
  res.json({ running });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
