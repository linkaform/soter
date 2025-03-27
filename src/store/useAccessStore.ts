import {create} from "zustand";

interface UseStoreState {

  passCode: string; 
  setPassCode: (newPassCode: string) => void; 
  clearPassCode: () => void;

  newCommentsAccesos: any[];
  newCommentsPase: any[];
  allCommentsPase: any[]; 
  newVehicle: any[];
  newEquipment: any[];
  allEquipments: any[]; 
  selectedVehicle: any


  setNewCommentsAccesos: (comments: any[]) => void;
  setNewCommentsPase: (comments: any[]) => void;
  setNewVehicle: (vehicles: any[]) => void;
  setNewEquipment: (equipment: any[]) => void;
  setAllEquipments: (equipments: any[]) => void;
  setAllComments: (comments: any[]) => void;
  setSelectedVehicle: (vehicle: any) => void; 


}

export const useAccessStore = create<UseStoreState>((set) => ({

  passCode: '', 
  setPassCode: (newPassCode) =>
    set({
      passCode: newPassCode,
      newCommentsAccesos: [],
      newCommentsPase: [],
      newVehicle: [],
      newEquipment: [],
      allEquipments: [],
      allCommentsPase: [],
      selectedVehicle: null, 

    }), // 🔥 Vacía los arrays cuando cambia passCode


  clearPassCode: () =>
    set({
      passCode: '',
      newCommentsAccesos: [],
      newCommentsPase: [],
      newVehicle: [],
      newEquipment: [],
      allEquipments: [],
      allCommentsPase: [],
      selectedVehicle: null, 

    }),
     // 🔥 También vacía los arrays al limpiar el passCode
  selectedVehicle: null, // 
  newCommentsAccesos: [],
  newCommentsPase: [],
  newVehicle: [],
  newEquipment: [],
  allEquipments: [],
  allCommentsPase: [],

  setNewCommentsAccesos: (comments) => set({ newCommentsAccesos: comments }),
  setNewCommentsPase: (comments) => set({ newCommentsPase: comments }),
  setNewVehicle: (vehicles) => set({ newVehicle: vehicles }),
  setNewEquipment: (equipment) => set({ newEquipment: equipment }),
  setAllEquipments: (equipments: any[]) => set({ allEquipments: equipments }),
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }), // 🔥 Función para actualizar el vehículo seleccionado
  setAllComments: (comments) => set({ allCommentsPase: comments }),

}));
