/**
 * 100KG Performance OS — Safe Storage Engine
 * Guarantees zero runtime crashes from corrupted localStorage JSON or quota issues.
 * Handles automatic email scoping and legacy fallback resolution.
 */

import { STORAGE_KEYS } from "@/config/constants";

/**
 * Safely parses JSON string with fallback value and zero throws.
 */
export function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (raw === null || raw === undefined) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[100KG Storage] Corrupted JSON detected. Returning fallback:`, error);
    }
    return fallback;
  }
}

/**
 * Retrieves active user email for storage key scoping.
 */
export function getActiveUserEmail(): string {
  try {
    if (typeof window === "undefined") return "default_athlete";
    const directEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL);
    if (directEmail && directEmail.trim()) return directEmail.toLowerCase().trim();

    const runtimeUser = localStorage.getItem(STORAGE_KEYS.RUNTIME_USER_INFO);
    if (runtimeUser) {
      const parsed = safeJsonParse<{ email?: string }>(runtimeUser, {});
      if (parsed?.email && typeof parsed.email === "string") {
        return parsed.email.toLowerCase().trim();
      }
    }
  } catch {}
  return "default_athlete";
}

/**
 * Generates an email-scoped localStorage key ensuring multi-athlete data isolation.
 */
export function getScopedKey(baseKey: string, customEmail?: string): string {
  const user = (customEmail && customEmail.trim()) || getActiveUserEmail();
  const cleanScope = user.replace(/[^a-z0-9]/gi, "_");
  return `${baseKey}__${cleanScope}`;
}

export const safeStorage = {
  /**
   * Get an item safely from localStorage with optional scoping.
   */
  get<T>(key: string, fallback: T, scoped = true, customEmail?: string): T {
    if (typeof window === "undefined") return fallback;
    try {
      const targetKey = scoped ? getScopedKey(key, customEmail) : key;
      const raw = localStorage.getItem(targetKey);
      if (raw === null && scoped) {
        // Fallback to legacy un-scoped key if scoped doesn't exist yet
        const legacyRaw = localStorage.getItem(key);
        return safeJsonParse<T>(legacyRaw, fallback);
      }
      return safeJsonParse<T>(raw, fallback);
    } catch {
      return fallback;
    }
  },

  /**
   * Set an item safely into localStorage with optional scoping.
   */
  set<T>(key: string, value: T, scoped = true, customEmail?: string): boolean {
    if (typeof window === "undefined") return false;
    try {
      const targetKey = scoped ? getScopedKey(key, customEmail) : key;
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(targetKey, serialized);
      return true;
    } catch (error) {
      console.error(`[100KG Storage] Failed to write key "${key}":`, error);
      return false;
    }
  },

  /**
   * Remove an item from localStorage.
   */
  remove(key: string, scoped = true, customEmail?: string): void {
    if (typeof window === "undefined") return;
    try {
      const targetKey = scoped ? getScopedKey(key, customEmail) : key;
      localStorage.removeItem(targetKey);
      if (scoped) {
        localStorage.removeItem(key);
      }
    } catch {}
  },

  /**
   * Reads array entries from both scoped and legacy keys, merges and deduplicates.
   * Eliminates the repetitive safeReadEntries loops throughout the app.
   */
  readList<T>(key: string, customEmail?: string): T[] {
    if (typeof window === "undefined") return [];
    try {
      const scopedKey = getScopedKey(key, customEmail);
      const scopedRaw = localStorage.getItem(scopedKey);
      const legacyRaw = localStorage.getItem(key);

      const scopedItems = safeJsonParse<T[]>(scopedRaw, []);
      const legacyItems = safeJsonParse<T[]>(legacyRaw, []);

      const combined = [...scopedItems, ...legacyItems];
      if (combined.length === 0) return [];

      // Deduplicate using JSON serialization
      const seen = new Set<string>();
      const deduplicated: T[] = [];
      for (const item of combined) {
        const str = JSON.stringify(item);
        if (!seen.has(str)) {
          seen.add(str);
          deduplicated.push(item);
        }
      }
      return deduplicated;
    } catch {
      return [];
    }
  },
};
