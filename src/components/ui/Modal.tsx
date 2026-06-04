"use client";

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Wider modal for long forms (e.g. product editor). */
  size?: "md" | "lg";
  title?: string;
  footer?: React.ReactNode;
}

const sizeClass = {
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  title,
  footer,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        className={`relative flex flex-col w-full ${sizeClass[size]} max-h-[min(92vh,880px)] bg-background-surface border border-border-subtle shadow-2xl`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border-subtle px-5 py-4 sm:px-6">
            {title ? (
              <h2 className="font-display text-2xl tracking-widest text-text-primary pr-8">
                {title}
              </h2>
            ) : (
              <span className="flex-1" />
            )}
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-text-muted hover:text-text-primary transition-colors p-1"
              aria-label="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
        </div>

        <div className="modal-scroll flex-1 min-h-0 px-5 py-4 sm:px-6">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-border-subtle px-5 py-4 sm:px-6 bg-background-surface">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
