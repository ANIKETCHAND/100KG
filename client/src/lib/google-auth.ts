/**
 * 100KG Performance OS: Google OAuth 2.0 Integration Layer
 * Uses centralized typed environment configuration with custom client ID fallback.
 */

import { env } from "@/config/env";

export const getGoogleClientId = (): string => {
  if (typeof window === "undefined") return "";
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_ID.includes(".apps.googleusercontent.com")) {
    return env.GOOGLE_CLIENT_ID;
  }
  const customId = localStorage.getItem("fittrack_google_client_id")?.trim();
  if (customId) return customId;
  return env.GOOGLE_CLIENT_ID || "";
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
