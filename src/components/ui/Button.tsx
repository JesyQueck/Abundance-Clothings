import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "font-display uppercase tracking-wider transition-all duration-200";
  
  const variants = {
    primary: "bg-background-deep border border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-background-deep",
    secondary: "bg-gold-primary text-background-deep hover:bg-gold-muted",
    outline: "bg-transparent border border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-background-deep",
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
