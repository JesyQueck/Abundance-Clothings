"use client";

import { useEffect } from "react";
import { isAdminAuthenticated, setAdminAuthenticated } from "@/lib/adminAuth";

/** Keeps localStorage in sync with the auth cookie set at login (middleware uses the cookie). */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (isAdminAuthenticated()) {
      setAdminAuthenticated();
    }
  }, []);

  return <>{children}</>;
}
