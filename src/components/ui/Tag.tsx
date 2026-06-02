import React from "react";

interface TagProps {
  children: React.ReactNode;
  color?: string;
}

export function Tag({ children, color = "#C8A84B" }: TagProps) {
  return (
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
}
