import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface MenuItem {
  id:string;
  label:string;
}

interface MenuStore {
  menuItems:MenuItem[];
  labels:string[]
  setLabels: (items:string[])=>void;
  setMenuItems: (items:MenuItem[]) =>void;
}

export const useMenuStore = create(
  persist<MenuStore>(
    (set) => ({
      menuItems: [],
      labels:[],
      setLabels: (items) => set({ labels: items }),
      setMenuItems: (items) => set({ menuItems: items }),
    }),
    {
      name: "menu-store",
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
