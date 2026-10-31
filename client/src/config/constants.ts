/**
 * 100KG Performance OS — Global Application Constants
 */

export const STORAGE_PREFIX = "fittrack"; // Preserved for data continuity

export const STORAGE_KEYS = {
  // Authentication & Session
  AUTH_STATE: "fittrack_auth_state",
  USER_EMAIL: "fittrack_user_email",
  USER_NAME: "fittrack_user_name",
  USER_AVATAR: "fittrack_user_avatar",
  SESSION_COOKIE: "fittrack-session-cookie",
  RUNTIME_USER_INFO: "fittrack-runtime-user-info",

  // Theme & Sound
  THEME: "fittrack-theme",
  SOUND_ENABLED: "fittrack_sound_effects_enabled",

  // Athlete & Profile
  ATHLETE_PROFILE: "fittrack-athlete-profile",
  CALIBRATION_SETTINGS: "fittrack-calibration-settings",
  EXPERIENCE_TIER: "fittrack-experience-tier",
  EXPERIENCE_MODE: "fittrack-experience-mode",
  DAILY_STREAK: "fittrack-daily-streak",
  CONNECTED_DEVICES: "fittrack-connected-devices",

  // Training & Workouts
  WORKOUT_LOGS: "fittrack_workout_logs",
  WORKOUT_HISTORY: "fittrack_workout_history",
  STAGED_EXERCISE: "fittrack-staged-exercise",
  STAGED_MUSCLE: "fittrack-staged-muscle",
  EXERCISE_PREFERENCES: "fittrack-exercise-preferences",
  EXERCISE_PROGRESS: "fittrack-exercise-progress",
  MUSCLE_RECOVERY: "fittrack_muscle_recovery",

  // Nutrition
  LOGGED_NUTRITION_TODAY: "fittrack_logged_nutrition_today",
  NUTRITION_LOGS: "fittrack_nutrition_logs",
  NUTRITION_MEAL_SLOTS: "fittrack_nutrition_meal_slots",
  CUSTOM_INDIAN_FOODS: "fittrack_custom_indian_foods",

  // GPS & Telemetry
  GPS_SESSIONS: "fittrack_gps_sessions",
  GPS_ROUTES: "fittrack_gps_routes",
  METRICS: "fittrack_metrics",
  WEIGHT_LOGS: "fittrack_weight_logs",

  // Rexi Onboarding & Tour
  BEGINNER_TOUR_ACTIVE: "fittrack_beginner_tour_active",
  BEGINNER_TOUR_STEP: "fittrack_beginner_tour_step",
  REXI_WELCOMED: "fittrack_rexi_welcomed",
  TRIGGER_REXI_WELCOME: "fittrack_trigger_rexi_welcome",
} as const;

export const APP_EVENTS = {
  RECOVERY_UPDATE_LEGACY: "fittrack:recovery-update",
  RECOVERY_UPDATE_100KG: "100KG:recovery-update",
  SIGNIN: "fittrack:signin",
  START_BEGINNER_TOUR: "fittrack_start_beginner_tour",
  OPEN_REXI_ONBOARDING: "fittrack_open_rexi_onboarding",
  LOCATION_UPDATED: "fittrack_location_updated",
} as const;

export const DEFAULT_CALIBRATION = {
  age: 26,
  heightCm: 175,
  weightKg: 70,
  sex: "male" as const,
  activityLevel: "moderate" as const,
  goalKcal: 2400,
  goalProtein: 150,
  goalCarbs: 270,
  goalFat: 65,
};
