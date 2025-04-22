import { create } from "zustand";
import { useAccessStore } from "./useAccessStore";
import { useAreasLocationStore } from "./useGetAreaLocationByUser";
import { useMenuStore } from "./useGetMenuStore";
import { useGuardSelectionStore } from "./useGuardStore";
import { useShiftStore } from "./useShiftStore";

interface AuthState {
  token: string | null;
  userId: string | null;
  userNameSoter : string | null;
  userEmailSoter : string | null;
  userIdSoter: number | null;
  userPhoto:string| null;
  isAuth: boolean;
  setAuth: (token: string, userId: string, userNameSoter: string, userEmailSoter: string, userIdSoter: number, userPhoto:string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Leer valores desde localStorage al inicializar el store
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const userNameSoter = typeof window !== "undefined" ? localStorage.getItem("userName_soter") : null;
  const userEmailSoter = typeof window !== "undefined" ? localStorage.getItem("userEmail_soter") : null;
  const userPhoto = typeof window !== "undefined" ? localStorage.getItem("userPhoto_soter") : null;
  const userIdSoter = typeof window !== "undefined" 
  ? parseInt(localStorage.getItem("userId_soter") ?? "") // Si es null, pasará una cadena vacía
  : null;
  const isAuth = !!token; // isAuth es true si hay un token

  return {
    token,
    userId,
    userNameSoter,
    userEmailSoter,
    userIdSoter,
    userPhoto,
    isAuth,

    setAuth: (token: string, userId: string, userNameSoter: string, userEmailSoter: string, userIdSoter:number, userPhoto:string) => {
      // Guarda los valores en localStorage
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("userName_soter", userNameSoter);
      localStorage.setItem("userEmail_soter", userEmailSoter);
      localStorage.setItem("userId_soter", userIdSoter.toString() );
      localStorage.setItem("userPhoto_soter", userPhoto);
      // Actualiza el estado
      set({ token, userId, userNameSoter, userEmailSoter, userIdSoter,isAuth: true , userPhoto});
    },

    logout: () => {

      // Elimina los valores de localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");

      localStorage.removeItem("userName_soter");
      localStorage.removeItem("userEmail_soter");
      localStorage.removeItem("userId_soter" );
      localStorage.removeItem("userPhoto_soter");
      
      set({ token: null, userId: null,userNameSoter: null, userEmailSoter: null, userIdSoter: null ,isAuth: false , userPhoto:null});
      useAccessStore.getState().clearPassCode();
      useAreasLocationStore.getState().clearAreasLocation();
      useMenuStore.getState().clearMenu();
      useGuardSelectionStore.getState().clearSelectedGuards();
      useShiftStore.getState().clearShift();

      // Restablece el estado
      localStorage.clear();
      window.location.href = '/auth/login'; // O cualquier ruta de tu app
    },
  };
});

export default useAuthStore;
