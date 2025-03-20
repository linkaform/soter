import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface locationAreaStore {
  areas:string[];
  locations:string[]
  setAreas: (items:string[])=>void;
  setLocations: (items:string[]) =>void;
}

export const useAreasLocationStore = create(
  persist<locationAreaStore>(
    (set) => ({
      areas:[],
      locations:[],
      setAreas: (items) => set({ areas: items }),
      setLocations: (items) => set({ locations: items })
    }),
    {
      name: "areaLocation-store",
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
