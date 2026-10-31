/**
 * 100KG Performance OS — Athlete & Calibration Domain Types
 */

export type BiologicalSex = "male" | "female";

export type ActivityLevel = "light" | "moderate" | "active" | "very_active";

export type ExperienceTier = "complete_beginner" | "beginner" | "intermediate" | "advanced";

export type ExperienceMode = "beginner" | "advanced";

export interface AthleteProfile {
  name: string;
  email: string;
  location: string;
  focus: string;
  photoDataUrl?: string;
}

export interface CalibrationSettings {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  sex: BiologicalSex;
  activityLevel: ActivityLevel;
  goalKcal: number;
  goalProtein: number;
  goalCarbs: number;
  goalFat: number;
}

export interface DailyStreak {
  count: number;
  lastCompletedDate: string;
}

export type StreakData = DailyStreak;

export interface ConnectedDevice {
  id: string;
  name: string;
  detail: string;
  kind: "band" | "watch" | "log";
}

export interface NotificationRecord {
  id: string;
  title: string;
  detail: string;
  kind: "milestone" | "reminder" | "system";
  createdAt: string;
  read: boolean;
}

export type WorkoutAlarmSound = "radar_pulse" | "digital_alarm" | "boxing_gong" | "kinetic_chime";

export interface ReminderSettings {
  enabled: boolean;
  time: string;
  days: string[];
  alarmSoundEnabled?: boolean;
  soundType?: WorkoutAlarmSound;
}

export interface HydrationReminderSettings {
  enabled: boolean;
  intervalMinutes: number;
  startTime: string;
  endTime: string;
  targetDailyLiters: number;
  alarmSoundEnabled: boolean;
  soundType: "water_droplet" | "gentle_bell" | "digital_beep";
}
