import styles from "./Header.module.css";

const SOURCE_LABEL = {
  connecting: "Conectando…",
  api: "Conectado a la API",
  demo: "Modo demo (datos simulados)",
};

function Header({ source, lastUpdate }) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Línea de producción · Planta 1</p>
        <h1 className={styles.title}>Monitor Dashboard</h1>
      </div>

      <div className={styles.meta}>
        <span className={`${styles.source} ${styles[source]}`}>
          <span className={styles.dot} />
          {SOURCE_LABEL[source]}
        </span>
        {lastUpdate && (
          <span className={styles.time}>
            Última lectura: {new Date(lastUpdate).toLocaleTimeString("es-CO")}
          </span>
        )}
      </div>
    </header>
  );
}

export default Header;
