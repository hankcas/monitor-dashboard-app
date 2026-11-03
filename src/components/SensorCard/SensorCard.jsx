import { LEVEL_LABEL } from "../../config/sensors";
import styles from "./SensorCard.module.css";

const toPercent = (v, min, max) => ((v - min) / (max - min)) * 100;

function SensorCard({ sensor, value, level, selected, onSelect }) {
  const { label, unit, icon, color, min, max, thresholds } = sensor;
  const [warnLow, warnHigh] = thresholds.warn;

  return (
    <button
      type="button"
      className={`${styles.card} ${styles[level] ?? ""} ${selected ? styles.selected : ""}`}
      style={{ "--sensor": color }}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <div className={styles.top}>
        <span className={styles.label}>
          <span aria-hidden="true">{icon}</span> {label}
        </span>
        <span className={styles.level}>{LEVEL_LABEL[level]}</span>
      </div>

      <p className={styles.value}>
        {value.toFixed(1)}
        <span className={styles.unit}>{unit}</span>
      </p>

      {/* Barra de rango: la zona clara es el rango normal */}
      <div className={styles.gauge} aria-hidden="true">
        <span
          className={styles.safeZone}
          style={{
            left: `${toPercent(warnLow, min, max)}%`,
            width: `${toPercent(warnHigh, min, max) - toPercent(warnLow, min, max)}%`,
          }}
        />
        <span
          className={styles.marker}
          style={{ left: `${Math.min(100, Math.max(0, toPercent(value, min, max)))}%` }}
        />
      </div>
      <p className={styles.range}>
        Normal: {warnLow}–{warnHigh} {unit}
      </p>
    </button>
  );
}

export default SensorCard;
