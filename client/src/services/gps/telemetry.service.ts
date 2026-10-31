/**
 * 100KG Performance OS — GPS Telemetry & Geospatial Calculations
 * Haversine formula, velocity gating, pace calculation, and route metrics.
 */

import type { GpsCoordinate } from "@/types";

/**
 * 1. Haversine Great-Circle Distance between two coordinates in kilometers.
 * Earth mean radius: 6,371 km
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 6371 * c;
}

/**
 * 2. Cumulative route distance with multi-path noise suppression
 * Drops jitter (< 3 meters) and physical impossibilities (> 70 km/h for running/walking)
 */
export function calculateCumulativeDistanceKm(points: GpsCoordinate[]): number {
  if (points.length < 2) return 0;

  let totalKm = 0;
  for (let i = 1; i < points.length; i++) {
    const p1 = points[i - 1];
    const p2 = points[i];

    const distKm = haversineDistanceKm(p1.latitude, p1.longitude, p2.latitude, p2.longitude);
    const distMeters = distKm * 1000;

    // Suppress multi-path sensor jitter
    if (distMeters < 3.0) continue;

    const timeDiffSeconds = Math.max(1, (p2.timestampMs - p1.timestampMs) / 1000);
    const speedKmh = (distKm / timeDiffSeconds) * 3600;

    // Gate unrealistic velocity jumps
    if (speedKmh > 65) continue;

    totalKm += distKm;
  }

  return Number(totalKm.toFixed(2));
}

/**
 * 3. Formats pace in standard running minutes:seconds per km
 */
export function formatPace(durationSeconds: number, distanceKm: number): string {
  if (distanceKm <= 0.05 || durationSeconds <= 0) return "--:-- /km";
  const paceSecondsPerKm = durationSeconds / distanceKm;
  const minutes = Math.floor(paceSecondsPerKm / 60);
  const seconds = Math.floor(paceSecondsPerKm % 60);

  if (minutes > 59) return "> 59:59 /km";
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} /km`;
}

/**
 * 4. Estimates caloric expenditure using MET (Metabolic Equivalent of Task)
 * Baseline running MET ~ 8.0 to 11.5 depending on pace
 */
export function estimateRunCalories(distanceKm: number, weightKg: number): number {
  // Rough baseline: ~1.036 kcal per kg of body weight per kilometer
  return Math.round(distanceKm * weightKg * 1.036);
}
