/**
 * 100KG Performance OS — Centralized Reactive Recovery Store
 * Real-time 3D muscle recovery engine, asynchronous decay math, and readiness telemetry.
 */

import { useState, useEffect } from "react";
import { safeStorage } from "@/core/storage/safe-storage";
import { STORAGE_KEYS, APP_EVENTS } from "@/config/constants";
import {
  ALL_MUSCLE_IDS,
  calculateAsymptoticRecovery,
  calculateOverallReadiness,
  calculatePostWorkoutScore,
  focusToMuscleId,
} from "@/services/fitness/calculator.service";
import type {
  MuscleId,
  MuscleRecoveryMap,
  MuscleRecoveryRecord,
  OverallReadiness,
} from "@/types";

class RecoveryStore {
  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window !== "undefined") {
      const handleExternalUpdate = () => this.notify();
      window.addEventListener(APP_EVENTS.RECOVERY_UPDATE_100KG, handleExternalUpdate);
      window.addEventListener(APP_EVENTS.RECOVERY_UPDATE_LEGACY, handleExternalUpdate);
      window.addEventListener("storage", handleExternalUpdate);
    }
  }

  public getRecoveryMap(): MuscleRecoveryMap {
    return safeStorage.get<MuscleRecoveryMap>(STORAGE_KEYS.MUSCLE_RECOVERY, {});
  }

  public getMuscleScore(id: MuscleId): number {
    const map = this.getRecoveryMap();
    const record = map[id];
    if (!record || !record.lastTrainedTimestamp) {
      return 100; // Fresh baseline
    }

    const elapsedHours = Math.max(0, (Date.now() - record.lastTrainedTimestamp) / (1000 * 60 * 60));
    const s0 = record.fatigueBaseline || 45;
    return calculateAsymptoticRecovery(s0, elapsedHours);
  }

  public getAllScores(): Record<MuscleId, number> {
    const scores = {} as Record<MuscleId, number>;
    ALL_MUSCLE_IDS.forEach((id) => {
      scores[id] = this.getMuscleScore(id);
    });
    return scores;
  }

  public getOverallReadiness(): OverallReadiness {
    const scores = this.getAllScores();
    return calculateOverallReadiness(scores);
  }

  public recordFatigue(focusOrMuscleId: string, sets = 4, volumeKg = 2400): void {
    const id = focusToMuscleId(focusOrMuscleId);
    const map = this.getRecoveryMap();
    const postWorkoutScore = calculatePostWorkoutScore(sets, volumeKg);

    const record: MuscleRecoveryRecord = {
      lastTrainedTimestamp: Date.now(),
      setsCompleted: sets,
      volumeKg,
      fatigueBaseline: postWorkoutScore,
    };

    map[id] = record;
    safeStorage.set(STORAGE_KEYS.MUSCLE_RECOVERY, map);
    this.broadcast();
  }

  public resetAllToFresh(): void {
    safeStorage.remove(STORAGE_KEYS.MUSCLE_RECOVERY);
    this.broadcast();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private broadcast(): void {
    this.notify();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(APP_EVENTS.RECOVERY_UPDATE_100KG));
      window.dispatchEvent(new CustomEvent(APP_EVENTS.RECOVERY_UPDATE_LEGACY));
    }
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const recoveryStore = new RecoveryStore();

/**
 * React hook for consuming reactive 3D muscle recovery & readiness telemetry.
 */
export function useRecoveryStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return recoveryStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    readiness: recoveryStore.getOverallReadiness(),
    scores: recoveryStore.getAllScores(),
    getMuscleScore: (id: MuscleId) => recoveryStore.getMuscleScore(id),
    recordFatigue: (muscle: string, sets?: number, volumeKg?: number) =>
      recoveryStore.recordFatigue(muscle, sets, volumeKg),
    resetAllToFresh: () => recoveryStore.resetAllToFresh(),
  };
}
