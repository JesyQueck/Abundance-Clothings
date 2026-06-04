import { useEffect, useState } from "react";

/** True after the component has mounted — use to defer client-only UI (e.g. localStorage counts). */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
