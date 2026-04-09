import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(50);
  const [status, setStatus] = useState(true);

  const [tempHistory, setTempHistory] = useState([25, 25, 25, 25, 25, 25]);
  const [humHistory, setHumHistory] = useState([50, 50, 50, 50, 50, 50]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTemp = temperature + (Math.random() * 2 - 1);
      const newHum = humidity + (Math.random() * 2 - 1);

      setTemperature(newTemp);
      setHumidity(newHum);

      // historial temperatura
      setTempHistory((prev) => {
        const updated = [...prev, newTemp];
        if (updated.length > 10) updated.shift();
        return updated;
      });

      // historial humedad
      setHumHistory((prev) => {
        const updated = [...prev, newHum];
        if (updated.length > 10) updated.shift();
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [temperature, humidity]);

  const data = {
    labels: tempHistory.map((_, i) => i + 1),
    datasets: [
      {
        label: "Temperatura",
        data: tempHistory,
        borderColor: "#38bdf8",
        backgroundColor: "rgba(56,189,248,0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Humedad",
        data: humHistory,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    animation: { duration: 800 },
    plugins: {
      legend: {
        labels: { color: "#e2e8f0" },
      },
    },
    scales: {
      x: { ticks: { color: "#94a3b8" } },
      y: { ticks: { color: "#94a3b8" } },
    },
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#0f172a",
        minHeight: "100vh",
        paddingTop: "40px",
      }}
    >
      {/* NOMBRE */}
      <h1
        style={{
          color: "white",
          fontSize: "34px",
          marginBottom: "30px",
          fontWeight: "600",
        }}
      >
        Monitoring Dashboard
      </h1>

      {/* CONTENIDO */}
      <div
        style={{
          display: "flex",
          gap: "30px",
          alignItems: "center",
        }}
      >
        {/* PANEL */}
        <div
          style={{
            width: "260px",
            background: status
              ? "linear-gradient(135deg, #22c55e, #15803d)"
              : "linear-gradient(135deg, #ef4444, #7f1d1d)",
            borderRadius: "20px",
            padding: "20px",
            color: "white",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
            transition: "0.3s",
          }}
        >
          <h2>Sistema</h2>
          <p>{status ? "Encendido" : "Apagado"}</p>

          <h3>🌡 {temperature.toFixed(1)}°C</h3>
          <h3>💧 {humidity.toFixed(1)}%</h3>

          <button
            onClick={() => setStatus(!status)}
            style={{
              marginTop: "20px",
              padding: "10px",
              width: "100%",
              borderRadius: "10px",
              border: "none",
              background: "#111827",
              color: "white",
              cursor: "pointer",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {status ? "Apagar" : "Encender"}
          </button>
        </div>

        {/* GRÁFICA MÁS GRANDE */}
        <div
          style={{
            width: "600px",
            background: "#111827",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  );
}