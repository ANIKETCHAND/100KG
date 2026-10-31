/**
 * 100KG Performance OS — Nutrition API Endpoints
 */

import { apiClient } from "../client";
import { safeStorage } from "@/core/storage/safe-storage";
import { STORAGE_KEYS } from "@/config/constants";
import type { NutritionLogItem } from "@/types";

export const nutritionApi = {
  /**
   * Retrieves today's logged nutrition entries.
   */
  async getTodayLogs(): Promise<NutritionLogItem[]> {
    return safeStorage.readList<NutritionLogItem>(STORAGE_KEYS.LOGGED_NUTRITION_TODAY);
  },

  /**
   * Saves updated daily food items.
   */
  async saveTodayLogs(items: NutritionLogItem[]): Promise<boolean> {
    safeStorage.set(STORAGE_KEYS.LOGGED_NUTRITION_TODAY, items);
    try {
      await apiClient.post("/api/nutrition/today", { items });
    } catch {}
    return true;
  },
};
