import { useEffect, useState } from "react";

const colorMap = { Blue: "#3b82f6", Yellow: "#facc15", Red: "#ef4444" };

export default function StatusPanel({ label, confidence, lastAction, volume }) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      background: flash ? "#2a2a3e" : "#1e1e2e",
      color: "#fff",
      padding: "16px 24px",
      borderRadius: 12,
      minWidth: 220,
      transition: "background 0.3s",
      border: flash ? "1px solid #6366f1" : "1px solid transparent",
    }}>
      <h3 style={{ marginTop: 0 }}>
        Detection Status{" "}
        {flash && <span style={{ fontSize: 12, color: "#6366f1" }}>● scanning</span>}
      </h3>
      <p><strong>Color: </strong><span style={{ color: colorMap[label] ?? "#ccc" }}>{label}</span></p>
      <p><strong>Confidence: </strong>{(confidence * 100).toFixed(1)}%</p>
      <p><strong>Last Action: </strong>{lastAction || "—"}</p>
      <p><strong>Volume: </strong>{volume}%</p>
    </div>
  );
}