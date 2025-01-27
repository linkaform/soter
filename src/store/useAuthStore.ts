import { User } from "@/lib/get-login";
import { create } from "zustand";

interface AuthState {
  token: string | null;
  userId: string | null;
  user: User | null;
  isAuth: boolean;
  setAuth: (token: string, userId: string, user: User) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  // Leer valores desde localStorage al inicializar el store
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null;

  const isAuth = !!token; // isAuth es true si hay un token

  return {
    token,
    userId,
    user,
    isAuth,

    setAuth: (token: string, userId: string, user: User) => {
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_id", userId);
      localStorage.setItem("user", JSON.stringify(user));

      set({ token, userId, user, isAuth: true });
    },

    logout: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user");

      set({ token: null, userId: null, user: null, isAuth: false });
    },
  };
});

export default useAuthStore;