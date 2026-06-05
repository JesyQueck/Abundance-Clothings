import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  type?: string;
}

export function Input({ label, error, className = "", type = "text", ...props }: InputProps) {
  const isTextarea = type === "textarea";

  if (isTextarea) {
    return (
      <div className="mb-4">
        {label && (
          <label className="block mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">
            {label}
          </label>
        )}
        <textarea
          className={`w-full px-4 py-3 bg-background-raised border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-gold-primary focus:outline-none transition-colors resize-none ${className}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`w-full px-4 py-3 bg-background-raised border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-gold-primary focus:outline-none transition-colors ${className}`}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 text-xs font-mono uppercase tracking-wider text-text-muted">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 bg-background-raised border border-border-subtle text-text-primary placeholder:text-text-muted focus:border-gold-primary focus:outline-none transition-colors resize-none ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
