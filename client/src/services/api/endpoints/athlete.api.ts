/**
 * 100KG Performance OS — Athlete API Endpoints
 */

import { apiClient } from "../client";
import { safeStorage } from "@/core/storage/safe-storage";
import { STORAGE_KEYS } from "@/config/constants";
import type { AthleteProfile, CalibrationSettings } from "@/types";

export const athleteApi = {
  /**
   * Fetches current athlete profile (with safe offline fallback).
   */
  async getProfile(): Promise<AthleteProfile> {
    try {
      const remote = await apiClient.get<AthleteProfile>("/api/athlete/profile");
      if (remote) {
        safeStorage.set(STORAGE_KEYS.ATHLETE_PROFILE, remote);
        return remote;
      }
    } catch {
      // Fallback to local offline cache
    }
    return safeStorage.get(STORAGE_KEYS.ATHLETE_PROFILE, {
      name: "Athlete",
      email: "athlete@100kg.training",
      location: "Detecting location...",
      focus: "Hypertrophy & Strength",
    });
  },

  /**
   * Updates athlete profile locally and syncs to remote when available.
   */
  async updateProfile(profile: AthleteProfile): Promise<boolean> {
    safeStorage.set(STORAGE_KEYS.ATHLETE_PROFILE, profile);
    try {
      await apiClient.post("/api/athlete/profile", profile);
      return true;
    } catch {
      return true; // Local write succeeded
    }
  },

  /**
   * Fetches calibration settings.
   */
  async getCalibration(): Promise<CalibrationSettings> {
    return safeStorage.get(STORAGE_KEYS.CALIBRATION_SETTINGS, {
      name: "Athlete",
      age: 26,
      heightCm: 175,
      weightKg: 70,
      sex: "male",
      activityLevel: "moderate",
      goalKcal: 2400,
      goalProtein: 150,
      goalCarbs: 270,
      goalFat: 65,
    });
  },
};
