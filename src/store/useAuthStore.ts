import { create } from "zustand";

interface AuthState {
  token: string | null;
  userId: string | null;
  userNameSoter : string | null;
  userEmailSoter : string | null;
  userIdSoter: number | null;
  isAuth: boolean;
  setAuth: (token: string, userId: string, userNameSoter: string, userEmailSoter: string, userIdSoter: number) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Leer valores desde localStorage al inicializar el store
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const userNameSoter = typeof window !== "undefined" ? localStorage.getItem("userName_soter") : null;
  const userEmailSoter = typeof window !== "undefined" ? localStorage.getItem("userEmail_soter") : null;
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
    isAuth,

    setAuth: (token: string, userId: string, userNameSoter: string, userEmailSoter: string, userIdSoter:number) => {
      // Guarda los valores en localStorage
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("userName_soter", userNameSoter);
      localStorage.setItem("userEmail_soter", userEmailSoter);
      localStorage.setItem("userId_soter", userIdSoter.toString() );
      // Actualiza el estado
      set({ token, userId, userNameSoter, userEmailSoter, userIdSoter,isAuth: true });
    },

    logout: () => {
      // Elimina los valores de localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");

      // Restablece el estado
      set({ token: null, userId: null,userNameSoter: null, userEmailSoter: null, userIdSoter: null ,isAuth: false });
    },
  };
});

export default useAuthStore;
