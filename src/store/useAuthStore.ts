import { create } from "zustand";

interface AuthState {
  token: string | null;
  userId: string | null;
  isAuth: boolean;
  setAuth: (token: string, userId: string) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Leer valores desde localStorage al inicializar el store
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const isAuth = !!token; // isAuth es true si hay un token

  return {
    token,
    userId,
    isAuth,

    setAuth: (token: string, userId: string) => {
      // Guarda los valores en localStorage
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_id", userId);

      // Actualiza el estado
      set({ token, userId, isAuth: true });
    },

    logout: () => {
      // Elimina los valores de localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");

      // Restablece el estado
      set({ token: null, userId: null, isAuth: false });
    },
  };
});

export default useAuthStore;
