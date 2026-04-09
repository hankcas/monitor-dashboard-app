import "./Card.css";
export default function Card({ title, value, unit, color }) {
  return (
    <div
  className="card"
  style={{
    background: "#111827",
    borderRadius: "16px",
    padding: "20px",
    color: "white",
    width: "200px",
    boxShadow: `0 0 20px ${color}40`
  }}
>
      <h3 style={{ margin: 0, opacity: 0.7 }}>{title}</h3>

      <div style={{ display: "flex", alignItems: "flex-end", gap: "5px" }}>
        <h1 style={{ margin: "10px 0", color: color }}>
          {value}
        </h1>

        <span style={{
          fontSize: "20px",
          opacity: 0.7,
          marginBottom: "10px"
        }}>
          {unit}
        </span>
      </div>
    </div>
  );
}
