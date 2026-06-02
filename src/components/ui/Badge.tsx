import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  type?: "default" | "gold" | "green" | "red" | "blue";
}

export function Badge({ children, type = "default" }: BadgeProps) {
  const colors = {
    default: { bg: "bg-background-surface", border: "border-border-subtle", text: "text-text-muted" },
    gold: { bg: "bg-[rgba(200,168,75,0.12)]", border: "border-gold-primary", text: "text-gold-primary" },
    green: { bg: "bg-[rgba(80,180,100,0.1)]", border: "border-green-500", text: "text-green-500" },
    red: { bg: "bg-[rgba(220,80,60,0.1)]", border: "border-red-500", text: "text-red-500" },
    blue: { bg: "bg-[rgba(80,140,220,0.1)]", border: "border-blue-500", text: "text-blue-500" },
  };

  const c = colors[type];

  return (
    <span
      className={`inline-block px-2.5 py-1 text-xs font-mono tracking-wider uppercase border ${c.bg} ${c.border} ${c.text}`}
    >
      {children}
    </span>
  );
}
