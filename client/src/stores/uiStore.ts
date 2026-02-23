/**
 * Zustand store for client-side UI state only.
 *
 * Rules:
 * - Never store API/server data here (use React Query for that).
 * - Only UI state: sidebar, modals, active tabs, toasts, preferences.
 */

import { create } from "zustand";

interface ToastState {
  message: string;
  variant: "success" | "warning" | "error";
  visible: boolean;
}

interface UIState {
  sidebarCollapsed: boolean;
  activeTab: string;
  toast: ToastState;

  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
  showToast: (message: string, variant: ToastState["variant"]) => void;
  dismissToast: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  activeTab: "dashboard",
  toast: { message: "", variant: "success", visible: false },

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  showToast: (message, variant) =>
    set({ toast: { message, variant, visible: true } }),

  dismissToast: () =>
    set((state) => ({ toast: { ...state.toast, visible: false } })),
}));
