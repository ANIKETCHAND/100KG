/**
 * 100KG Performance OS — Date & Time Utilities
 * Consolidates duplicated date formatting, day calculations, and timestamps.
 */

/**
 * Returns YYYY-MM-DD formatted date key.
 */
export function formatDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Calculates number of calendar days between two YYYY-MM-DD dates.
 */
export function daysBetween(fromDate: string, toDate: string): number {
  const d1 = Date.parse(`${fromDate}T00:00:00`);
  const d2 = Date.parse(`${toDate}T00:00:00`);
  if (isNaN(d1) || isNaN(d2)) return 99;
  return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a given timestamp or date string is from today.
 */
export function isToday(dateOrIso: string | number | Date): boolean {
  const d = new Date(dateOrIso);
  if (isNaN(d.getTime())) return false;
  return d.toDateString() === new Date().toDateString();
}

/**
 * Returns current greeting period based on user local time.
 */
export function getGreetingPeriod(hour: number = new Date().getHours()): "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT" {
  if (hour >= 5 && hour < 12) return "MORNING";
  if (hour >= 12 && hour < 17) return "AFTERNOON";
  if (hour >= 17 && hour < 21) return "EVENING";
  return "NIGHT";
}

/**
 * Formats a clean telemetry timestamp header, e.g. "SATURDAY • 11:45 AM"
 */
export function formatTelemetryTimestamp(date: Date = new Date()): string {
  const day = date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${day} • ${time}`;
}
