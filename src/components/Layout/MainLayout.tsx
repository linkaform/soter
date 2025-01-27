"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Usa el hook de navegación de Next.js
import { Header } from "@/components/header";
import useAuthStore from "@/store/useAuthStore";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuth, user } = useAuthStore(); // Obtén el estado de autenticación desde tu store
  const router = useRouter(); // Hook para redirigir

  useEffect(() => {
    if (!isAuth || !user) {
      // Redirige al usuario al login si no está autenticado
      router.push("/auth/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, router]);





  return (
    <div className="">
      {/* Header visible en todas las páginas logueadas */}
      <Header />

      {/* Contenido principal */}
      <main className="">
        {children}
      </main>
    </div>
  );
};
