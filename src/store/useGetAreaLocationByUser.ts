import { getCatalogoPasesArea, getCatalogoPasesLocation } from "@/lib/get-catalogos-pase-area-location";
import { errorMsj } from "@/lib/utils";
import { toast } from "sonner";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface locationAreaStore {
  areas: string[];
  locations: string[];
  loading:boolean;
  setAreas: (items: string[]) => void;
  setLocations: (items: string[]) => void;
  clearAreasLocation: () => void;
  fetchAreas: (location: string) => Promise<void>;
  fetchLocations: () => Promise<void>;
  setLoading: (value: boolean) => void;
}

export const useAreasLocationStore = create(
  persist<locationAreaStore>(
    (set, get) => ({
      areas: [],
      locations: [],
      loading: false,
      setLoading: (value) => set({ loading: value }),
      setAreas: (items) => set({ areas: items }),
      setLocations: (items) => set({ locations: items }),
      clearAreasLocation: () => set({ areas: [], locations: [] }),

      fetchAreas: async (location: string) => {
        const { areas } = get();
        if (!areas.length) {
          set({ loading: true });
          try {
            const fetched = await getCatalogoPasesArea({ location });
            const error = errorMsj(fetched);
            if (error) throw new Error(error.text);
            set({ areas:fetched? fetched?.response?.data.areas_by_location : [] });
          } catch (err) {
            toast.error("Ocurrio un error al cargar las areas: " + err)
            // console.error("Error cargando áreas:", err);
          } finally {
            set({ loading: false });
          }
        }
      },

      fetchLocations: async () => {
        const { locations } = get();
        if (!locations.length) {
          set({ loading: true });
          try {
            const fetched = await getCatalogoPasesLocation();
            set({ locations: fetched? fetched?.response?.data.ubicaciones_user : [] });
          } catch (err) {
            toast.error("Ocurrio un error al cargar las ubicaciones: " + err)
            // console.error("Error cargando ubicaciones:", err);
          } finally {
            set({ loading: false });
          }
        }
      },
    }),
    {
      name: "areaLocation-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);