/**
 * 100KG Performance OS — Numeric Formatting Utilities
 */

/**
 * Formats a number with comma grouping, e.g. 12,450
 */
export function formatNumber(val: number): string {
  return (val || 0).toLocaleString("en-US");
}

/**
 * Formats weight in kilograms, e.g. "82.5 kg"
 */
export function formatKg(val: number, decimals = 1): string {
  return `${Number(val || 0).toFixed(decimals)} kg`;
}

/**
 * Formats energy in kilocalories, e.g. "2,400 kcal"
 */
export function formatKcal(val: number): string {
  return `${formatNumber(Math.round(val || 0))} kcal`;
}

/**
 * Clamps a number between a minimum and maximum bound.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}
