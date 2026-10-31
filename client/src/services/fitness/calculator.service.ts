/**
 * 100KG Performance OS — Mathematical Fitness & Telemetry Engine
 * Pure business logic: Mifflin-St Jeor, Asymptotic Muscle Decay, Volume Aggregations.
 */

import type {
  ActivityLevel,
  BiologicalSex,
  CalibrationSettings,
  MuscleId,
  MuscleRecoveryMap,
  MuscleRecoveryRecord,
  OverallReadiness,
  RecoveryDetail,
} from "@/types";

/**
 * 1. Clinically Validated Mifflin-St Jeor BMR Equation
 * Men:   BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5
 * Women: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) - 161
 */
export function calculateBmr(params: {
  weightKg: number;
  heightCm: number;
  age: number;
  sex: BiologicalSex;
}): number {
  const { weightKg, heightCm, age, sex } = params;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return sex === "male" ? Math.round(base + 5) : Math.round(base - 161);
}

/**
 * 2. Activity Multiplier for Total Daily Energy Expenditure (TDEE)
 */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  light: 1.2,
  moderate: 1.375,
  active: 1.55,
  very_active: 1.725,
};

export function calculateTdee(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.375;
  return Math.round(bmr * multiplier);
}

/**
 * 3. Macronutrient Goal Splitter
 * Protein: 2.0g per kg of body mass (Hypertrophy baseline)
 * Fat: ~25% of total caloric intake (9 kcal / gram)
 * Carbs: Remainder of caloric allocation (4 kcal / gram)
 */
export function calculateMacroSplit(tdee: number, weightKg: number) {
  const targetProteinGrams = Math.round(weightKg * 2.0);
  const proteinKcal = targetProteinGrams * 4;

  const targetFatKcal = tdee * 0.25;
  const targetFatGrams = Math.round(targetFatKcal / 9);

  const remainingKcal = Math.max(0, tdee - proteinKcal - targetFatKcal);
  const targetCarbsGrams = Math.round(remainingKcal / 4);

  return {
    calories: tdee,
    protein: targetProteinGrams,
    fat: targetFatGrams,
    carbs: targetCarbsGrams,
  };
}

/**
 * 4. Asymptotic Muscle Recovery Curve
 * Formula: S(t) = S0 + (100 - S0) * (1 - e^(-t / tau))
 * S0: Residual score immediately post-training (based on volume & sets)
 * t: Elapsed hours since last session
 * tau: Time constant (~28.5 hours for full asymptotic reach)
 */
export function calculateAsymptoticRecovery(
  initialScoreS0: number,
  elapsedHours: number,
  tauHours = 28.5
): number {
  if (elapsedHours <= 0) return Math.round(initialScoreS0);
  const s0 = Math.max(10, Math.min(100, initialScoreS0));
  const recovered = s0 + (100 - s0) * (1 - Math.exp(-elapsedHours / tauHours));
  return Math.round(Math.min(100, Math.max(0, recovered)));
}

/**
 * 5. Muscle Fatigue Baseline from Training Volume
 */
export function calculatePostWorkoutScore(setsCompleted: number, volumeKg: number): number {
  // Heavy compound sessions reduce score into 35-50 range
  const setPenalty = setsCompleted * 8;
  const volumePenalty = Math.min(25, volumeKg / 400);
  const baseline = 100 - (setPenalty + volumePenalty);
  return Math.max(30, Math.min(65, Math.round(baseline)));
}

/**
 * 6. Recovery Status Classifier
 */
export function classifyRecovery(score: number): RecoveryDetail {
  if (score >= 80) {
    return {
      status: "recovered",
      label: "Fully Recovered",
      color: "#22c55e",
      emissive: "#15803d",
      action: "Fully recovered and primed for heavy compound progression and maximum load.",
    };
  }
  if (score >= 65) {
    return {
      status: "recovering",
      label: "Recovering",
      color: "#f59e0b",
      emissive: "#b45309",
      action: "Moderate recovery. Optimal for accessory work, higher volume, or mobility flow.",
    };
  }
  return {
    status: "rest",
    label: "Needs Rest",
    color: "#ef4444",
    emissive: "#991b1b",
    action: "High residual fatigue detected. Prioritize sleep and recovery before heavy loading.",
  };
}

/**
 * 7. Focus string to standard MuscleId mapper
 */
export function focusToMuscleId(focus: string): MuscleId {
  const f = focus.toLowerCase();
  if (f.includes("chest") || f.includes("pec") || f.includes("bench") || f.includes("push")) return "chest";
  if (f.includes("shoulder") || f.includes("delt") || f.includes("press")) return "shoulders";
  if (f.includes("bicep") || f.includes("curl") || f.includes("arm")) return "biceps";
  if (f.includes("tricep") || f.includes("pushdown") || f.includes("dips")) return "triceps";
  if (f.includes("core") || f.includes("ab") || f.includes("crunch") || f.includes("plank")) return "core";
  if (f.includes("back") || f.includes("lat") || f.includes("row") || f.includes("pull")) return "back";
  if (f.includes("glute") || f.includes("hip")) return "glutes";
  if (f.includes("quad") || f.includes("squat") || f.includes("leg press") || f.includes("leg ext")) return "quads";
  if (f.includes("hamstring") || f.includes("deadlift")) return "hamstrings";
  if (f.includes("calf") || f.includes("calves") || f.includes("raise")) return "calves";
  return "chest";
}

export const ALL_MUSCLE_IDS: MuscleId[] = [
  "chest",
  "shoulders",
  "biceps",
  "triceps",
  "core",
  "back",
  "glutes",
  "quads",
  "hamstrings",
  "calves",
];

/**
 * 8. Overall Body Readiness Aggregator
 * Computes arithmetic average of all 10 muscle groups and maps to clinical status.
 */
export function calculateOverallReadiness(scores: Record<MuscleId, number>): OverallReadiness {
  const values = Object.values(scores);
  if (values.length === 0) {
    return {
      score: 100,
      label: "Fully Recovered",
      color: "#22c55e",
      action: "Optimal readiness across all muscle groups.",
      muscleCount: 0,
      averageFatigue: 0,
    };
  }

  const sum = values.reduce((acc, s) => acc + s, 0);
  const avg = Math.round(sum / values.length);
  const detail = classifyRecovery(avg);

  return {
    score: avg,
    label: detail.label,
    color: detail.color,
    action: detail.action,
    muscleCount: values.length,
    averageFatigue: 100 - avg,
  };
}
