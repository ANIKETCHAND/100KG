/**
 * 100KG Performance OS — Sidebar Store Adapter
 * Delegating to centralized reactive UI store.
 */

import { uiStore, useUiStore } from "@/state/ui.store";

export function useSidebar() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUiStore();
  return {
    open: sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
  };
}

export { uiStore };
