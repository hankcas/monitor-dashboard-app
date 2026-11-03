import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./TrendChart.module.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function TrendChart({ sensor, history }) {
  const labels = history.map((r) =>
    new Date(r.time).toLocaleTimeString("es-CO", { minute: "2-digit", second: "2-digit" })
  );
  const [warnLow, warnHigh] = sensor.thresholds.warn;
  const limitLine = (value, label) => ({
    label,
    data: history.map(() => value),
    borderColor: css("--warn"),
    borderDash: [6, 6],
    borderWidth: 1,
    pointRadius: 0,
    fill: false,
  });

  const data = {
    labels,
    datasets: [
      {
        label: `${sensor.label} (${sensor.unit})`,
        data: history.map((r) => r[sensor.key]),
        borderColor: sensor.color,
        backgroundColor: `${sensor.color}26`,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0.35,
        fill: true,
      },
      limitLine(warnHigh, "Límite superior"),
      ...(warnLow > 0 ? [limitLine(warnLow, "Límite inferior")] : []),
    ],
  };

  const muted = css("--muted");
  const grid = css("--border");

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { labels: { color: muted, boxWidth: 12, usePointStyle: true } },
    },
    scales: {
      x: { ticks: { color: muted, maxTicksLimit: 8 }, grid: { color: grid } },
      y: { ticks: { color: muted }, grid: { color: grid } },
    },
  };

  return (
    <section className={styles.panel}>
      <div className={styles.head}>
        <h2 className={styles.title}>Tendencia · {sensor.label}</h2>
        <span className={styles.hint}>Últimos {history.length} registros · toca una tarjeta para cambiar</span>
      </div>
      <div className={styles.canvas}>
        <Line data={data} options={options} />
      </div>
    </section>
  );
}

export default TrendChart;
