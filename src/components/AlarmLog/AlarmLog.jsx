import { LEVEL_LABEL } from "../../config/sensors";
import styles from "./AlarmLog.module.css";

function AlarmLog({ alarms }) {
  return (
    <section className={styles.panel}>
      <h2 className={styles.title}>Registro de eventos</h2>

      {alarms.length === 0 ? (
        <p className={styles.empty}>Sin eventos. Todas las variables están en rango normal.</p>
      ) : (
        <ul className={styles.list}>
          {alarms.map((a) => (
            <li key={a.id} className={`${styles.item} ${styles[a.level]}`}>
              <span className={styles.badge}>{LEVEL_LABEL[a.level]}</span>
              <span className={styles.message}>{a.message}</span>
              <time className={styles.time}>{new Date(a.time).toLocaleTimeString("es-CO")}</time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default AlarmLog;
