import React from "react";

interface CardProps {
  children: React.ReactNode;
  accent?: boolean;
  className?: string;
}

export function Card({ children, accent = false, className = "" }: CardProps) {
  return (
    <div
      className={`p-5 mb-3 border-l-3 ${
        accent
          ? "bg-[rgba(200,168,75,0.07)] border-gold-primary"
          : "bg-background-surface border-border-subtle"
      } ${className}`}
    >
      {children}
    </div>
  );
}
