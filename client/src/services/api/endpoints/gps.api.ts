/**
 * 100KG Performance OS — GPS Telemetry API Endpoints
 */

import { safeStorage } from "@/core/storage/safe-storage";
import { STORAGE_KEYS } from "@/config/constants";
import type { GpsRouteSession } from "@/types";

export const gpsApi = {
  /**
   * Retrieves saved GPS outdoor routes.
   */
  async listRoutes(): Promise<GpsRouteSession[]> {
    return safeStorage.readList<GpsRouteSession>(STORAGE_KEYS.GPS_SESSIONS);
  },

  /**
   * Persists a recorded GPS route.
   */
  async saveRoute(route: GpsRouteSession): Promise<boolean> {
    const existing = safeStorage.readList<GpsRouteSession>(STORAGE_KEYS.GPS_SESSIONS);
    const updated = [route, ...existing.filter((r) => r.id !== route.id)].slice(0, 50);
    safeStorage.set(STORAGE_KEYS.GPS_SESSIONS, updated);
    return true;
  },

  /**
   * Deletes a GPS route by ID.
   */
  async deleteRoute(routeId: string): Promise<boolean> {
    const existing = safeStorage.readList<GpsRouteSession>(STORAGE_KEYS.GPS_SESSIONS);
    safeStorage.set(
      STORAGE_KEYS.GPS_SESSIONS,
      existing.filter((r) => r.id !== routeId)
    );
    return true;
  },
};
