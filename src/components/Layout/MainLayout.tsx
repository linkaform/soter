"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Usa el hook de navegación de Next.js
import { Header } from "@/components/header";
import useAuthStore from "@/store/useAuthStore";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuth } = useAuthStore(); // Obtén el estado de autenticación desde tu store
  const router = useRouter(); // Hook para redirigir

  useEffect(() => {
    if (!isAuth) {
      router.push("/auth/login");
    }
  }, [isAuth, router]);

  return (
    <div>
      <Header />
      <main >
        {children}
      </main>
    </div>
  );
};
