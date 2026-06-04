export const ADMIN_AUTH_KEY = "abundance_admin_auth";
export const ADMIN_AUTH_COOKIE = "abundance_admin_auth";

const COOKIE_MAX_AGE_DAYS = 7;

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

export function setAdminAuthenticated(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_AUTH_KEY, "true");
  document.cookie = `${ADMIN_AUTH_COOKIE}=true; path=/; max-age=${60 * 60 * 24 * COOKIE_MAX_AGE_DAYS}; SameSite=Lax`;
}

export function clearAdminAuthenticated(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_AUTH_KEY);
  document.cookie = `${ADMIN_AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}
