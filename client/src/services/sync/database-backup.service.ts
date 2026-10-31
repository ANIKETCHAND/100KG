/**
 * 100KG Performance OS — Database Sync & Backup Service
 * Exports and imports full athlete databases, handles CSV downloads.
 */

import { safeStorage } from "@/core/storage/safe-storage";
import { STORAGE_KEYS } from "@/config/constants";
import type { WorkoutSessionLog, AthleteProfile, CalibrationSettings } from "@/types";

export interface DatabaseBackupPayload {
  version: string;
  exportedAt: string;
  source: string;
  athleteEmail: string;
  profile: any;
  calibration: any;
  nutritionToday: any[];
  nutritionHistory: any[];
  workoutLogs: any[];
  workoutHistory: any[];
  gpsSessions: any[];
  streakData: any;
}

/**
 * 1. Exports full athlete profile, workouts, and nutrition logs into a portable JSON file.
 */
export function exportAthleteDatabase(): void {
  try {
    const profile = safeStorage.get<Partial<AthleteProfile>>(STORAGE_KEYS.ATHLETE_PROFILE, {});
    const calibration = safeStorage.get<Partial<CalibrationSettings>>(STORAGE_KEYS.CALIBRATION_SETTINGS, {});
    const nutritionToday = safeStorage.readList(STORAGE_KEYS.LOGGED_NUTRITION_TODAY);
    const nutritionHistory = safeStorage.readList(STORAGE_KEYS.NUTRITION_LOGS);
    const workoutLogs = safeStorage.readList(STORAGE_KEYS.WORKOUT_LOGS);
    const workoutHistory = safeStorage.readList(STORAGE_KEYS.WORKOUT_HISTORY);
    const gpsSessions = safeStorage.readList(STORAGE_KEYS.GPS_SESSIONS);
    const streakData = safeStorage.get(STORAGE_KEYS.DAILY_STREAK, { count: 0, lastCompletedDate: "" });

    const payload: DatabaseBackupPayload = {
      version: "100KG-2.0.0",
      exportedAt: new Date().toISOString(),
      source: "100KG Performance OS",
      athleteEmail: profile.email || "athlete@100kg.training",
      profile,
      calibration,
      nutritionToday,
      nutritionHistory,
      workoutLogs,
      workoutHistory,
      gpsSessions,
      streakData,
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    const dateStr = new Date().toISOString().split("T")[0];
    downloadAnchor.setAttribute("download", `100KG_Backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (error) {
    console.error("[100KG Backup] Failed to export athlete database:", error);
  }
}

/**
 * 2. Exports workout history to clean CSV formatted for spreadsheet analysis.
 */
export function exportWorkoutCsv(): void {
  try {
    const workoutLogs = safeStorage.readList<WorkoutSessionLog>(STORAGE_KEYS.WORKOUT_HISTORY);

    let csv = "Date,Workout Title,Focus Muscle,Total Volume (kg),Movement Count\n";
    workoutLogs.forEach((item) => {
      const date = item.date || item.completedAt || new Date().toISOString();
      const title = (item.title || "Workout").replace(/,/g, " ");
      const focus = (item.focus || "Full Body").replace(/,/g, " ");
      const volume = item.volumeKg || 0;
      const count = item.movementCount || (item.exercises ? item.exercises.length : 1);
      csv += `"${date}","${title}","${focus}",${volume},${count}\n`;
    });

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    const dateStr = new Date().toISOString().split("T")[0];
    downloadAnchor.setAttribute("download", `100KG_Workouts_${dateStr}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (error) {
    console.error("[100KG Backup] Failed to export CSV:", error);
  }
}

/**
 * 3. Imports a previously exported backup JSON file back into local state.
 */
export async function importAthleteDatabase(file: File): Promise<boolean> {
  try {
    const text = await file.text();
    const data = JSON.parse(text) as Partial<DatabaseBackupPayload>;

    if (!data.version || !data.source) {
      throw new Error("Invalid 100KG backup archive format.");
    }

    if (data.profile) safeStorage.set(STORAGE_KEYS.ATHLETE_PROFILE, data.profile);
    if (data.calibration) safeStorage.set(STORAGE_KEYS.CALIBRATION_SETTINGS, data.calibration);
    if (data.nutritionToday) safeStorage.set(STORAGE_KEYS.LOGGED_NUTRITION_TODAY, data.nutritionToday);
    if (data.nutritionHistory) safeStorage.set(STORAGE_KEYS.NUTRITION_LOGS, data.nutritionHistory);
    if (data.workoutLogs) safeStorage.set(STORAGE_KEYS.WORKOUT_LOGS, data.workoutLogs);
    if (data.workoutHistory) safeStorage.set(STORAGE_KEYS.WORKOUT_HISTORY, data.workoutHistory);
    if (data.gpsSessions) safeStorage.set(STORAGE_KEYS.GPS_SESSIONS, data.gpsSessions);
    if (data.streakData) safeStorage.set(STORAGE_KEYS.DAILY_STREAK, data.streakData);

    return true;
  } catch (error) {
    console.error("[100KG Backup] Failed to import athlete database:", error);
    return false;
  }
}
