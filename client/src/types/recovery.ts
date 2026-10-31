/**
 * 100KG Performance OS — 3D Muscle Recovery & Anatomy Domain Types
 */

export type MuscleId =
  | "chest"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "core"
  | "back"
  | "glutes"
  | "quads"
  | "hamstrings"
  | "calves";

export type RecoveryStatus = "recovered" | "recovering" | "rest";

export interface RecoveryDetail {
  status: RecoveryStatus;
  label: string;
  color: string;
  emissive: string;
  action: string;
}

export interface MuscleRecoveryRecord {
  lastTrainedTimestamp: number;
  setsCompleted: number;
  volumeKg: number;
  fatigueBaseline: number;
}

export type MuscleRecoveryMap = Partial<Record<MuscleId, MuscleRecoveryRecord>>;

export interface MuscleInfo {
  id: MuscleId;
  label: string;
  anatomicalName: string;
  status: "Ready" | "Recovered" | "Building";
  lastTrained: string;
  weeklyVolume: string;
  score: number;
  intensity: string;
  exercises: { name: string; sets: number; reps: string; load: string; volume: string }[];
  accent: string;
}

export interface OverallReadiness {
  score: number;
  label: string;
  color: string;
  action: string;
  muscleCount: number;
  averageFatigue: number;
}
