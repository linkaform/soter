import { create } from "zustand";

export const useGuardSelectionStore = create<{
    selectedGuards: any[];
    toggleGuardSelection: (guard: any) => void;
    clearSelectedGuards: () => void;
  }>((set) => ({
    selectedGuards: [],
    toggleGuardSelection: (guard) =>
      set((state) => ({
        selectedGuards: state.selectedGuards.includes(guard)
          ? state.selectedGuards.filter((g) => g !== guard)
          : [...state.selectedGuards, guard],
      })),
    clearSelectedGuards: () => set({ selectedGuards: [] }), 
  }));