import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ShiftStore {
  area: string;
  location: string;
  checkin_id: string | undefined;
  isLoading: boolean;
  turno: boolean;

  setArea: (area: string) => void;
  setLocation: (location: string) => void;
  setCheckin_id: (id: string | undefined) => void;
  setLoading: (loading: boolean) => void;
  setTurno:(turno:boolean)=>void;
  clearShift: () => void;
}

export const useShiftStore = create(
  persist<ShiftStore>(
    (set) => ({
      // Propiedades iniciales
      area: "",
      location: "",
      checkin_id: undefined,
      isLoading: false,
      turno:false,

      // Funciones
      setArea: (area) => set({ area }),
      setLocation: (location) => set({ location }),
      setCheckin_id: (id) => set({ checkin_id: id }),
      setLoading: (loading) => set({ isLoading: loading }),
      setTurno:(turno) => set({ turno }),
      clearShift: () => set({
        area: "",
        location: "",
        checkin_id: undefined,
        isLoading: false,
        turno:false
      }),
  
    }),
    {
      name: "shift-store", // Nombre para el almacenamiento persistente
      storage: createJSONStorage(() => localStorage), // Uso explícito de localStorage
    }
  )
);




