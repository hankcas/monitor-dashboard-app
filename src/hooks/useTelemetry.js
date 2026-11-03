import { useCallback, useEffect, useRef, useState } from "react";
import { SAMPLE_MS } from "../../backend/simulator.js";
import { apiSource, createDemoSource } from "../services/telemetry.js";

const HISTORY_SIZE = 30;
const RETRY_API_EVERY = 8; // en modo demo, reintenta la API cada 8 lecturas

/**
 * Consulta el estado del sistema cada SAMPLE_MS.
 * Si la API no responde cambia a modo demo y sigue intentando reconectar.
 */
export function useTelemetry() {
  const [data, setData] = useState(null);
  const [source, setSource] = useState("connecting");
  const [busy, setBusy] = useState(false);

  const sourceRef = useRef(apiSource);
  const demoRef = useRef(null);
  const ticksRef = useRef(0);

  const switchToDemo = () => {
    demoRef.current ??= createDemoSource();
    sourceRef.current = demoRef.current;
  };

  const poll = useCallback(async () => {
    ticksRef.current += 1;

    // Reintento periódico de la API mientras se está en modo demo
    if (sourceRef.current.name === "demo" && ticksRef.current % RETRY_API_EVERY === 0) {
      try {
        const status = await apiSource.getStatus(HISTORY_SIZE);
        sourceRef.current = apiSource;
        setSource("api");
        setData(status);
        return;
      } catch {
        // sigue en demo
      }
    }

    try {
      const status = await sourceRef.current.getStatus(HISTORY_SIZE);
      setSource(sourceRef.current.name);
      setData(status);
    } catch {
      switchToDemo();
      setSource("demo");
      setData(await sourceRef.current.getStatus(HISTORY_SIZE));
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(poll, 0);
    const id = setInterval(poll, SAMPLE_MS);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [poll]);

  const toggleSystem = useCallback(async () => {
    if (!data) return;
    setBusy(true);
    try {
      await sourceRef.current.setRunning(!data.running);
    } catch {
      switchToDemo();
      setSource("demo");
      await sourceRef.current.setRunning(!data.running);
    }
    await poll();
    setBusy(false);
  }, [data, poll]);

  return { data, source, busy, toggleSystem };
}
