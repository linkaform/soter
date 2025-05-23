import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ShiftStore {
  area: string;
  location: string;
  checkin_id: string | undefined;
  isLoading: boolean;
  turno: boolean;
  tab:string;
  filter:string;

  setTab: (tab: string) => void;
  setFilter:(filter:string)=>void
  setArea: (area: string) => void;
  setLocation: (location: string) => void;
  setCheckin_id: (id: string | undefined) => void;
  setLoading: (loading: boolean) => void;
  setTurno:(turno:boolean)=>void;
  clearShift: () => void;
//   fetchShift: () => Promise<void>;
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
		tab:"",
		filter:"",

		// Funciones
		setTab:(tab) => set({tab}),
		setFilter:(filter) => set({filter}),
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
			turno:false,
			tab:""
		}),
		// fetchShift: async (location: string) => {
		// 	const { area, location } = get();
		// 		if(!area || !location){
		// 			const data = await getShift({ area, location });
		// 			const textMsj = errorMsj(data) 
		// 			if (textMsj){
		// 			toast.error(`Error al obtener informacion, Error: ${textMsj.text}`);
		// 			return []
		// 			}else {
		// 				const filteredGuards = data.response?.data?.support_guards?.filter((guard: any) => {
		// 				return guard.name !== userNameSoter; 
		// 			});
		// 			setArea(data.response?.data?.location?.area ?? "")
		// 			setLocation(data.response?.data?.location?.name ?? "")
		// 			setTurno(data?.response.data?.guard?.status_turn=="Turno Abierto" ? true:false)
		// 			return {...data.response?.data,
		// 				support_guards: filteredGuards,}
		// 			}
		// 		}
		// 	},
	  }),
    {
      name: "shift-store", // Nombre para el almacenamiento persistente
      storage: createJSONStorage(() => localStorage), // Uso explícito de localStorage
    }
  )
);




