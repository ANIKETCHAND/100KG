/**
 * 100KG Performance OS — Centralized Reactive Athlete Store
 * Combines profile, calibration settings, experience mode, and daily streak.
 */

import { useState, useEffect } from "react";
import { safeStorage } from "@/core/storage/safe-storage";
import { STORAGE_KEYS, DEFAULT_CALIBRATION } from "@/config/constants";
import type {
  AthleteProfile,
  CalibrationSettings,
  DailyStreak,
  ExperienceTier,
  ExperienceMode,
} from "@/types";

function getDefaultProfile(): AthleteProfile {
  const email = safeStorage.get(STORAGE_KEYS.USER_EMAIL, "athlete@100kg.training", false);
  const cachedName = safeStorage.get(STORAGE_KEYS.USER_NAME, "Athlete", false);
  return {
    name: cachedName || "Athlete",
    email: email || "athlete@100kg.training",
    location: "Detecting location...",
    focus: "Hypertrophy & Strength",
  };
}

class AthleteStore {
  private listeners = new Set<() => void>();

  public getProfile(): AthleteProfile {
    return safeStorage.get(STORAGE_KEYS.ATHLETE_PROFILE, getDefaultProfile());
  }

  public setProfile(profile: AthleteProfile): void {
    if (profile.name && profile.name.trim()) {
      localStorage.setItem(STORAGE_KEYS.USER_NAME, profile.name.trim());
    }
    safeStorage.set(STORAGE_KEYS.ATHLETE_PROFILE, profile);
    this.notify();
  }

  public getCalibration(): CalibrationSettings {
    const profile = this.getProfile();
    return safeStorage.get(STORAGE_KEYS.CALIBRATION_SETTINGS, {
      ...DEFAULT_CALIBRATION,
      name: profile.name,
    });
  }

  public setCalibration(calibration: CalibrationSettings): void {
    safeStorage.set(STORAGE_KEYS.CALIBRATION_SETTINGS, calibration);
    this.notify();
  }

  public getStreak(): DailyStreak {
    return safeStorage.get(STORAGE_KEYS.DAILY_STREAK, { count: 0, lastCompletedDate: "" });
  }

  public setStreak(streak: DailyStreak): void {
    safeStorage.set(STORAGE_KEYS.DAILY_STREAK, streak);
    this.notify();
  }

  public getExperienceTier(): ExperienceTier {
    return safeStorage.get(STORAGE_KEYS.EXPERIENCE_TIER, "beginner");
  }

  public setExperienceTier(tier: ExperienceTier): void {
    safeStorage.set(STORAGE_KEYS.EXPERIENCE_TIER, tier);
    safeStorage.set(
      STORAGE_KEYS.EXPERIENCE_MODE,
      tier === "complete_beginner" || tier === "beginner" ? "beginner" : "advanced"
    );
    this.notify();
  }

  public getExperienceMode(): ExperienceMode {
    const tier = this.getExperienceTier();
    return tier === "complete_beginner" || tier === "beginner" ? "beginner" : "advanced";
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const athleteStore = new AthleteStore();

/**
 * React hook for consuming reactive athlete state.
 */
export function useAthleteStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return athleteStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    profile: athleteStore.getProfile(),
    setProfile: (p: AthleteProfile) => athleteStore.setProfile(p),
    calibration: athleteStore.getCalibration(),
    setCalibration: (c: CalibrationSettings) => athleteStore.setCalibration(c),
    streak: athleteStore.getStreak(),
    setStreak: (s: DailyStreak) => athleteStore.setStreak(s),
    experienceTier: athleteStore.getExperienceTier(),
    setExperienceTier: (t: ExperienceTier) => athleteStore.setExperienceTier(t),
    experienceMode: athleteStore.getExperienceMode(),
  };
}
