/**
 * 100KG Performance OS — Environment Configuration
 * Centralized, validated environment configuration without ad-hoc casting or conflicts.
 */

// Safe accessor that works in Vite browser environment
const getEnvString = (key: string, fallback = ""): string => {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    const val = import.meta.env[key];
    if (typeof val === "string" && val.trim().length > 0) {
      return val.trim();
    }
  }
  return fallback;
};

const getEnvBool = (key: string, fallback = false): boolean => {
  const val = getEnvString(key);
  if (!val) return fallback;
  return val === "true" || val === "1";
};

export const env = {
  // App Identity
  APP_NAME: "100KG",
  APP_TITLE: "100KG — Performance OS",
  APP_VERSION: "1.0.0",

  // Environment Mode
  IS_PROD: typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.PROD : false,
  IS_DEV: typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.DEV : true,
  MODE: typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.MODE : "development",

  // Primary Canonical Domain
  PRIMARY_DOMAIN: "https://100-kg.vercel.app",
  BACKUP_DOMAINS: [
    "https://100kg-app.vercel.app",
    "https://the100kg.vercel.app",
    "https://fit-repo.vercel.app",
    "http://localhost:3000",
  ],

  // Google OAuth Client ID
  GOOGLE_CLIENT_ID: getEnvString(
    "VITE_GOOGLE_CLIENT_ID",
    "1061989600000-samplegoogleclientid.apps.googleusercontent.com"
  ),

  // Supabase Configuration
  SUPABASE_URL: getEnvString("VITE_SUPABASE_URL", "https://xyzcompany.supabase.co"),
  SUPABASE_ANON_KEY: getEnvString("VITE_SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key"),

  // Google Maps API Key
  GOOGLE_MAPS_API_KEY: getEnvString("VITE_GOOGLE_MAPS_API_KEY", ""),

  // API Base URL
  API_BASE_URL: getEnvString("VITE_API_URL", ""),

  // Feature Toggles
  ENABLE_DEBUG_LOGGING: getEnvBool("VITE_ENABLE_DEBUG_LOGGING", false),
  ENABLE_ANALYTICS: getEnvBool("VITE_ENABLE_ANALYTICS", false),
} as const;

export type EnvConfig = typeof env;
