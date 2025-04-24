import { getCatalogoPasesArea, getCatalogoPasesLocation } from "@/lib/get-catalogos-pase-area-location";
import { errorMsj } from "@/lib/utils";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface locationAreaStore {
  areas:string[];
  locations:string[]
  setAreas: (items:string[])=>void;
  setLocations: (items:string[]) =>void;
  clearAreasLocation: () => void;
}

export const useAreasLocationStore = create(
  persist<locationAreaStore>(
    (set) => ({
      areas:[],
      locations:[],
      clearAreasLocation: () => set({ areas: [], locations: [] }),
      setAreas: (items) => set({ areas: items }),
      setLocations: (items) => set({ locations: items }),
      fetchAreas: async (parametros: string ) => {
        const areasFromStorage = JSON.parse(localStorage.getItem('areaLocation-store') || '{}').areas || [];
        if (areasFromStorage.length === 0) {
          const fetchedAreas = await getCatalogoPasesArea({location:parametros});
          const textMsj = errorMsj(fetchedAreas);
          if (textMsj) {
            throw new Error(`Error al obtener catalogo de areas, Error: ${fetchedAreas.error}`);
          } else {
            set({ areas: fetchedAreas.response?.data.ubicaciones_user });
          }
        }
      },
      fetchLocations: async () => {
        const locationsFromStorage = JSON.parse(localStorage.getItem('areaLocation-store') || '{}').locations || [];
        if (locationsFromStorage.length === 0) {
          const fetchedLocations = await getCatalogoPasesLocation();
          set({ locations: fetchedLocations });
        }
      },
    }),
    {
      name: "areaLocation-store",
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
