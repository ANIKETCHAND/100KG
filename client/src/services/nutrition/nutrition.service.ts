/**
 * 100KG Performance OS — Nutrition Calculation & Aggregation Service
 */

import type { FoodItemDefinition, MacroTotals, MealSlotType, NutritionLogItem } from "@/types";

/**
 * Calculates sum of calories and macronutrients for a collection of food logs.
 */
export function calculateMacroTotals(items: NutritionLogItem[]): MacroTotals {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + (Number(item.kcal) || 0),
      protein: acc.protein + (Number(item.p) || 0),
      carbs: acc.carbs + (Number(item.c) || 0),
      fat: acc.fat + (Number(item.f) || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

/**
 * Filters items belonging to a specific meal slot.
 */
export function filterItemsByMeal(items: NutritionLogItem[], meal: MealSlotType): NutritionLogItem[] {
  return items.filter((item) => item.meal === meal);
}

/**
 * Searches food library with case-insensitive matching on English and Hindi names.
 */
export function searchFoodLibrary(
  query: string,
  foods: FoodItemDefinition[],
  categoryFilter?: string
): FoodItemDefinition[] {
  const clean = query.trim().toLowerCase();
  return foods.filter((item) => {
    if (categoryFilter && categoryFilter !== "All" && item.category !== categoryFilter) {
      return false;
    }
    if (!clean) return true;
    const nameMatch = item.name.toLowerCase().includes(clean);
    const hindiMatch = item.hindiName ? item.hindiName.toLowerCase().includes(clean) : false;
    const catMatch = item.category.toLowerCase().includes(clean);
    return nameMatch || hindiMatch || catMatch;
  });
}

/**
 * Calculates percentage adherence towards target macros.
 */
export function calculateMacroAdherence(current: MacroTotals, target: MacroTotals) {
  return {
    caloriesPercent: target.calories > 0 ? Math.min(100, Math.round((current.calories / target.calories) * 100)) : 0,
    proteinPercent: target.protein > 0 ? Math.min(100, Math.round((current.protein / target.protein) * 100)) : 0,
    carbsPercent: target.carbs > 0 ? Math.min(100, Math.round((current.carbs / target.carbs) * 100)) : 0,
    fatPercent: target.fat > 0 ? Math.min(100, Math.round((current.fat / target.fat) * 100)) : 0,
  };
}
