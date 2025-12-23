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
          set({ loading: true });
          try {
            const fetched = await getCatalogoPasesArea({ location });
            const error = errorMsj(fetched);
            if (error) throw new Error(error.text);
            
            const orderedAreas = (
              fetched?.response?.data?.areas_by_location ?? []
            ).slice().sort((a: string, b: any) =>
              a.localeCompare(b, 'es', { sensitivity: 'base' })
            );

            
            set({ areas:fetched? orderedAreas : [] });
          } catch (err) {
            toast.error("Ocurrio un error al cargar las areas: " + err)
          } finally {
            set({ loading: false });
          }
      },

      fetchLocations: async () => {
        const { locations } = get();
        if (!locations.length) {
          set({ loading: true });
          try {
            const fetched = await getCatalogoPasesLocation();

               
            const orderedLocation = (
              fetched?.response?.data?.ubicaciones_user ?? []
            ).slice().sort((a: string, b: any) =>
              a.localeCompare(b, 'es', { sensitivity: 'base' })
            );


            set({ locations: fetched? orderedLocation : [] });
          } catch (err) {
            toast.error("Ocurrio un error al cargar las ubicaciones: " + err)
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