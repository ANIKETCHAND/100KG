/**
 * 100KG Performance OS — Centralized Reactive UI Store
 * Controls sidebar visibility, sound effects toggle, active tour states.
 */

import { useState, useEffect } from "react";
import { safeStorage } from "@/core/storage/safe-storage";
import { STORAGE_KEYS } from "@/config/constants";

class UiStore {
  private sidebarOpen = false;
  private soundEnabled = true;
  private listeners = new Set<() => void>();

  constructor() {
    this.soundEnabled = safeStorage.get(STORAGE_KEYS.SOUND_ENABLED, true, false);
  }

  public isSidebarOpen(): boolean {
    return this.sidebarOpen;
  }

  public setSidebarOpen(open: boolean): void {
    this.sidebarOpen = open;
    this.notify();
  }

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
    this.notify();
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    safeStorage.set(STORAGE_KEYS.SOUND_ENABLED, enabled, false);
    this.notify();
  }

  public toggleSound(): boolean {
    const next = !this.soundEnabled;
    this.setSoundEnabled(next);
    return next;
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

export const uiStore = new UiStore();

export function useUiStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return uiStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    sidebarOpen: uiStore.isSidebarOpen(),
    setSidebarOpen: (open: boolean) => uiStore.setSidebarOpen(open),
    toggleSidebar: () => uiStore.toggleSidebar(),
    soundEnabled: uiStore.isSoundEnabled(),
    setSoundEnabled: (enabled: boolean) => uiStore.setSoundEnabled(enabled),
    toggleSound: () => uiStore.toggleSound(),
  };
}
