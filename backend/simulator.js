/**
 * Simulador de una línea de producción con cuatro sensores.
 * Cada lectura parte de la anterior (paseo aleatorio) para que las señales
 * cambien de forma suave y realista, no con saltos al azar.
 *
 * Lo usa el backend y también el frontend como modo demo cuando la API no está disponible.
 */

export const SENSORS = {
  temperature: { label: "Temperatura", unit: "°C", target: 26, idle: 20, noise: 0.6, min: 0, max: 60 },
  humidity: { label: "Humedad", unit: "%", target: 55, idle: 50, noise: 1.2, min: 0, max: 100 },
  pressure: { label: "Presión", unit: "bar", target: 6, idle: 0, noise: 0.15, min: 0, max: 10 },
  power: { label: "Consumo", unit: "kW", target: 12, idle: 0, noise: 0.8, min: 0, max: 30 },
};

// Límites de advertencia y críticos de cada variable: [mínimo, máximo]
export const THRESHOLDS = {
  temperature: { warn: [15, 32], crit: [10, 38] },
  humidity: { warn: [30, 70], crit: [20, 85] },
  pressure: { warn: [5, 7], crit: [4, 8] },
  power: { warn: [0, 20], crit: [0, 25] },
};

export const SAMPLE_MS = 2000;
const HISTORY_LIMIT = 60;
const ALARM_LIMIT = 30;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const round = (v) => Math.round(v * 10) / 10;

export function levelOf(key, value) {
  const { warn, crit } = THRESHOLDS[key];
  if (value < crit[0] || value > crit[1]) return "critical";
  if (value < warn[0] || value > warn[1]) return "warning";
  return "normal";
}

export function createSimulator() {
  const state = {
    running: true,
    startedAt: Date.now(),
    values: Object.fromEntries(Object.entries(SENSORS).map(([k, s]) => [k, s.target])),
    history: [],
    alarms: [],
    levels: {},
  };

  function addAlarm(alarm) {
    state.alarms.unshift(alarm);
    if (state.alarms.length > ALARM_LIMIT) state.alarms.pop();
  }

  function registerAlarms(reading) {
    for (const key of Object.keys(SENSORS)) {
      const level = levelOf(key, reading[key]);
      const previous = state.levels[key] ?? "normal";
      // Solo se registra cuando la variable pasa a un nivel peor o distinto
      if (level !== previous && level !== "normal") {
        addAlarm({
          id: `${reading.time}-${key}`,
          time: reading.time,
          sensor: key,
          level,
          message: `${SENSORS[key].label} fuera de rango: ${reading[key]} ${SENSORS[key].unit}`,
        });
      }
      state.levels[key] = level;
    }
  }

  function step() {
    const time = Date.now();

    for (const [key, s] of Object.entries(SENSORS)) {
      const goal = state.running ? s.target : s.idle;
      const current = state.values[key];
      // Tiende al valor objetivo, suma ruido y de vez en cuando un pico
      const spike = state.running && Math.random() < 0.03 ? s.noise * 8 : 0;
      const next = current + (goal - current) * 0.15 + (Math.random() * 2 - 1) * s.noise + spike;
      state.values[key] = clamp(next, s.min, s.max);
    }

    const reading = { time, running: state.running };
    for (const [key, v] of Object.entries(state.values)) reading[key] = round(v);

    state.history.push(reading);
    if (state.history.length > HISTORY_LIMIT) state.history.shift();

    if (state.running) registerAlarms(reading);
    return reading;
  }

  function setRunning(running) {
    if (running === state.running) return;
    if (running) state.startedAt = Date.now();
    state.running = running;
    state.levels = {};
    addAlarm({
      id: `${Date.now()}-system`,
      time: Date.now(),
      sensor: "system",
      level: "info",
      message: running ? "Sistema encendido" : "Sistema apagado",
    });
  }

  function snapshot(limit = 30) {
    const reading = state.history.at(-1);
    const levels = Object.fromEntries(
      Object.keys(SENSORS).map((key) => [key, state.running ? levelOf(key, reading[key]) : "off"])
    );
    return {
      reading,
      levels,
      running: state.running,
      startedAt: state.startedAt,
      history: state.history.slice(-limit),
      alarms: state.alarms,
    };
  }

  step();
  return { step, setRunning, snapshot };
}
