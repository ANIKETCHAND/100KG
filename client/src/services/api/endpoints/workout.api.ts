/**
 * 100KG Performance OS — Workout & Session API Endpoints
 */

import { apiClient } from "../client";
import { safeStorage } from "@/core/storage/safe-storage";
import { STORAGE_KEYS } from "@/config/constants";
import type { WorkoutSessionLog } from "@/types";

export const workoutApi = {
  /**
   * Retrieves list of completed workout sessions (with offline fallback).
   */
  async listWorkouts(): Promise<WorkoutSessionLog[]> {
    try {
      const remote = await apiClient.get<WorkoutSessionLog[]>("/api/workouts");
      if (Array.isArray(remote) && remote.length > 0) {
        return remote;
      }
    } catch {}
    return safeStorage.readList<WorkoutSessionLog>(STORAGE_KEYS.WORKOUT_LOGS);
  },

  /**
   * Commits a completed workout session.
   */
  async logWorkout(session: WorkoutSessionLog): Promise<boolean> {
    const existing = safeStorage.readList<WorkoutSessionLog>(STORAGE_KEYS.WORKOUT_LOGS);
    const updated = [session, ...existing].slice(0, 50);
    safeStorage.set(STORAGE_KEYS.WORKOUT_LOGS, updated);

    // Also update history
    const history = safeStorage.readList<WorkoutSessionLog>(STORAGE_KEYS.WORKOUT_HISTORY);
    safeStorage.set(STORAGE_KEYS.WORKOUT_HISTORY, [session, ...history]);

    try {
      await apiClient.post("/api/workouts", session);
    } catch {
      // Offline-first: local commit succeeded
    }
    return true;
  },
};
