import { Equipo, Vehiculo } from "@/lib/update-pass-full";
import {create} from "zustand";

interface UseStoreState {

  tipoMovimiento:string;
  setTipoMovimiento:(tipo:string) => void;
  passCode: string; 
  setPassCode: (newPassCode: string) => void; 
  clearPassCode: () => void;

  newCommentsAccesos: any[];
  newCommentsPase: any[];
  allCommentsPase: any[]; 
  newVehicle: any[];
  newEquipment: any[];
  selectedEquipos: Equipo[]; 
  selectedVehiculos: Vehiculo[]

  setNewCommentsAccesos: (comments: any[]) => void;
  setNewCommentsPase: (comments: any[]) => void;
  setNewVehicle: (vehicles: any[]) => void;
  setNewEquipment: (equipment: any[]) => void;
  setAllComments: (comments: any[]) => void;
  setSelectedVehiculos: (vehiculos: Vehiculo[]) => void; 
  setSelectedEquipos: (equipos: Equipo[]) => void;
}

export const useAccessStore = create<UseStoreState>((set) => ({

  passCode: '', 
  setPassCode: (newPassCode) =>
    set({
      tipoMovimiento:"",
      passCode: newPassCode,
      newCommentsAccesos: [],
      newCommentsPase: [],
      newVehicle: [],
      newEquipment: [],
      selectedEquipos: [],
      allCommentsPase: [],
      selectedVehiculos: [], 

    }), // 🔥 Vacía los arrays cuando cambia passCode


  clearPassCode: () =>
    set({
      tipoMovimiento:"",
      passCode: '',
      newCommentsAccesos: [],
      newCommentsPase: [],
      newVehicle: [],
      newEquipment: [],
      selectedEquipos: [],
      allCommentsPase: [],
      selectedVehiculos: [], 

    }),
     // 🔥 También vacía los arrays al limpiar el passCode
  selectedVehiculos: [], 
  newCommentsAccesos: [],
  newCommentsPase: [],
  newVehicle: [],
  newEquipment: [],
  selectedEquipos: [],
  allCommentsPase: [],
  tipoMovimiento:"",
  
  setNewCommentsAccesos: (comments) => set({ newCommentsAccesos: comments }),
  setNewCommentsPase: (comments) => set({ newCommentsPase: comments }),
  setNewVehicle: (vehicles) => set({ newVehicle: vehicles }),
  setNewEquipment: (equipment) => set({ newEquipment: equipment }),
  setAllComments: (comments) => set({ allCommentsPase: comments }),
  setSelectedEquipos: (equipos) => set({ selectedEquipos: equipos }),
  setSelectedVehiculos: (vehiculos) => set({ selectedVehiculos: vehiculos }), 
  setTipoMovimiento: (tipo) => set({ tipoMovimiento:tipo }), 
}));