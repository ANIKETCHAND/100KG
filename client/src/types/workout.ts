/**
 * 100KG Performance OS — Workout & Exercise Domain Types
 */

import type { MuscleId } from "./recovery";

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
  rpe?: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  muscleId: MuscleId;
  targetSets: number;
  targetReps: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutSessionLog {
  id?: string;
  title: string;
  focus: string;
  movementCount: number;
  volumeKg: number;
  completedAt: string;
  date?: string;
  exercises?: WorkoutExercise[];
  durationMinutes?: number;
}

export interface ExerciseTarget {
  sets: string;
  reps: string;
  completed: boolean;
  completedAt?: string;
}

export type ExerciseProgressMap = Record<string, ExerciseTarget>;

export interface ExercisePreference {
  favorite?: boolean;
  hidden?: boolean;
  viewedAt?: string;
}
