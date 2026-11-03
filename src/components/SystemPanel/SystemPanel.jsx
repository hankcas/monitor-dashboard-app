import styles from "./SystemPanel.module.css";

function formatUptime(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function SystemPanel({ running, startedAt, now, levels, busy, onToggle }) {
  const values = Object.values(levels);
  const critical = values.filter((l) => l === "critical").length;
  const warning = values.filter((l) => l === "warning").length;

  return (
    <section className={`${styles.panel} ${running ? styles.on : styles.off}`}>
      <div className={styles.row}>
        <h2 className={styles.heading}>Sistema</h2>
        <span className={styles.state}>{running ? "En operación" : "Detenido"}</span>
      </div>

      <dl className={styles.stats}>
        <div>
          <dt>Tiempo en marcha</dt>
          <dd>{running ? formatUptime(now - startedAt) : "—"}</dd>
        </div>
        <div>
          <dt>Variables en alerta</dt>
          <dd>
            <span className={styles.crit}>{critical}</span> críticas ·{" "}
            <span className={styles.warn}>{warning}</span> advertencias
          </dd>
        </div>
      </dl>

      <button type="button" className={styles.button} onClick={onToggle} disabled={busy}>
        {running ? "Detener sistema" : "Encender sistema"}
      </button>
    </section>
  );
}

export default SystemPanel;
