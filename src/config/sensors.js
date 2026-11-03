import { SENSORS, THRESHOLDS } from "../../backend/simulator.js";

// Datos visuales de cada sensor; los rangos y unidades vienen del simulador compartido
const DISPLAY = {
  temperature: { icon: "🌡️", color: "#f97316" },
  humidity: { icon: "💧", color: "#38bdf8" },
  pressure: { icon: "⏲️", color: "#a78bfa" },
  power: { icon: "⚡", color: "#facc15" },
};

export const SENSOR_LIST = Object.entries(SENSORS).map(([key, s]) => ({
  key,
  ...s,
  ...DISPLAY[key],
  thresholds: THRESHOLDS[key],
}));

export const SENSOR_BY_KEY = Object.fromEntries(SENSOR_LIST.map((s) => [s.key, s]));

export const LEVEL_LABEL = {
  normal: "Normal",
  warning: "Advertencia",
  critical: "Crítico",
  off: "Detenido",
  info: "Info",
};
