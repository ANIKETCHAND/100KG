/**
 * 100KG Performance OS — GPS Telemetry & Route Domain Types
 */

export interface GpsCoordinate {
  latitude: number;
  longitude: number;
  timestampMs: number;
  accuracyMeters?: number;
  speedMetersPerSecond?: number | null;
  altitudeMeters?: number | null;
}

export interface GpsRouteSession {
  id: string;
  label: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  distanceKm: number;
  distanceMeters?: number;
  averageSpeedKph: number;
  paceMinPerKm: string;
  caloriesBurned?: number;
  points: GpsCoordinate[];
  routePoints?: [number, number][];
}
