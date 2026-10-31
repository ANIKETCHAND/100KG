/**
 * 100KG Performance OS — Nutrition & Diet Domain Types
 */

export type MealSlotType = "breakfast" | "lunch" | "snack" | "dinner";

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionLogItem {
  id: string;
  name: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  meal: MealSlotType;
  time: string;
  portionGrams?: number;
}

export interface FoodItemDefinition {
  id: string;
  name: string;
  category: string;
  hindiName?: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  isCustom?: boolean;
}

export interface DayNutritionSummary {
  date: string;
  totals: MacroTotals;
  targetKcal: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  items: NutritionLogItem[];
}
