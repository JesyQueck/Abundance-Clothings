import React from "react";

export const Tag = ({ children, color = "#C8A84B" }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 10px",
      border: `1px solid ${color}`,
      color,
      fontSize: "10px",
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      fontFamily: "monospace",
      marginRight: "6px",
      marginBottom: "4px",
    }}
  >
    {children}
  </span>
);

export const SectionTitle = ({ children }) => (
  <h2
    style={{
      fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
      fontSize: "32px",
      letterSpacing: "0.08em",
      color: "#F5F0E8",
      margin: "0 0 6px 0",
      textTransform: "uppercase",
    }}
  >
    {children}
  </h2>
);

export const SubTitle = ({ children }) => (
  <h3
    style={{
      fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
      fontSize: "18px",
      letterSpacing: "0.1em",
      color: "#C8A84B",
      margin: "28px 0 10px 0",
      textTransform: "uppercase",
      borderBottom: "1px solid #2a2520",
      paddingBottom: "6px",
    }}
  >
    {children}
  </h3>
);

export const Divider = () => (
  <div
    style={{
      height: "1px",
      background: "linear-gradient(90deg, #C8A84B 0%, #2a2520 60%, transparent 100%)",
      margin: "16px 0 24px 0",
    }}
  />
);

export const Card = ({ children, accent = false }) => (
  <div
    style={{
      background: accent ? "rgba(200,168,75,0.07)" : "#1a1714",
      border: `1px solid ${accent ? "#C8A84B" : "#2a2520"}`,
      padding: "16px 20px",
      marginBottom: "12px",
      borderLeft: accent ? "3px solid #C8A84B" : "3px solid #2a2520",
    }}
  >
    {children}
  </div>
);

export const Row = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: "8px 0",
      borderBottom: "1px solid #1e1b17",
      gap: "20px",
    }}
  >
    <span style={{ color: "#888", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0, fontFamily: "monospace" }}>
      {label}
    </span>
    <span style={{ color: "#F5F0E8", fontSize: "13px", textAlign: "right" }}>{value}</span>
  </div>
);

export const Bullet = ({ children }) => (
  <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
    <span style={{ color: "#C8A84B", flexShrink: 0, fontFamily: "monospace" }}>▸</span>
    <span style={{ color: "#b0a898", fontSize: "13px", lineHeight: "1.6" }}>{children}</span>
  </div>
);

export const Badge = ({ children, type = "default" }) => {
  const colors = {
    default: { bg: "#1a1714", border: "#2a2520", text: "#888" },
    gold: { bg: "rgba(200,168,75,0.12)", border: "#C8A84B", text: "#C8A84B" },
    green: { bg: "rgba(80,180,100,0.1)", border: "#4CAF50", text: "#4CAF50" },
    red: { bg: "rgba(220,80,60,0.1)", border: "#e05c48", text: "#e05c48" },
    blue: { bg: "rgba(80,140,220,0.1)", border: "#5a8cdc", text: "#5a8cdc" },
  };
  const c = colors[type];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        fontSize: "11px",
        letterSpacing: "0.06em",
        marginRight: "6px",
        marginBottom: "4px",
        fontFamily: "monospace",
      }}
    >
      {children}
    </span>
  );
};
