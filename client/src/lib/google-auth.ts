/**
 * 100KG Performance OS: Google OAuth 2.0 Integration Layer
 * Supports runtime environment variable (VITE_GOOGLE_CLIENT_ID) or user-configured client ID.
 */

export const getGoogleClientId = (): string => {
  if (typeof window === "undefined") return "";
  const envId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim();
  if (envId) return envId;
  const customId = localStorage.getItem("fittrack_google_client_id")?.trim();
  if (customId) return customId;
  return "";
};

export const saveGoogleClientId = (clientId: string): void => {
  if (typeof window === "undefined") return;
  const clean = clientId.trim();
  if (clean) {
    localStorage.setItem("fittrack_google_client_id", clean);
  } else {
    localStorage.removeItem("fittrack_google_client_id");
  }
};

export const isGoogleConfigured = (): boolean => {
  const id = getGoogleClientId();
  return !!id && id.includes(".apps.googleusercontent.com");
};
