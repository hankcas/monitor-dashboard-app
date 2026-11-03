import { useState } from "react";
import Header from "./components/Header/Header";
import SystemPanel from "./components/SystemPanel/SystemPanel";
import SensorCard from "./components/SensorCard/SensorCard";
import TrendChart from "./components/TrendChart/TrendChart";
import AlarmLog from "./components/AlarmLog/AlarmLog";
import { SENSOR_LIST, SENSOR_BY_KEY } from "./config/sensors";
import { useTelemetry } from "./hooks/useTelemetry";
import "./App.css";

function App() {
  const { data, source, busy, toggleSystem } = useTelemetry();
  const [selected, setSelected] = useState("temperature");

  if (!data) {
    return (
      <div className="app">
        <Header source={source} />
        <p className="loading">Leyendo sensores…</p>
      </div>
    );
  }

  const { reading, levels, running, startedAt, history, alarms } = data;

  return (
    <div className="app">
      <Header source={source} lastUpdate={reading.time} />

      <div className="sensors">
        {SENSOR_LIST.map((sensor) => (
          <SensorCard
            key={sensor.key}
            sensor={sensor}
            value={reading[sensor.key]}
            level={levels[sensor.key]}
            selected={selected === sensor.key}
            onSelect={() => setSelected(sensor.key)}
          />
        ))}
      </div>

      <div className="main">
        <TrendChart sensor={SENSOR_BY_KEY[selected]} history={history} />
        <SystemPanel
          running={running}
          startedAt={startedAt}
          now={reading.time}
          levels={levels}
          busy={busy}
          onToggle={toggleSystem}
        />
      </div>

      <AlarmLog alarms={alarms} />

      <footer className="footer">
        Hecho por <a href="https://github.com/hankcas" target="_blank" rel="noreferrer">Leonardo Castro</a>
        {" · "}React, Chart.js y Node.js/Express
      </footer>
    </div>
  );
}

export default App;
