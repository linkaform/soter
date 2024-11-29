// components/Layout/MainLayout.tsx
import React from "react";
import {Header} from "@/components/header"

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
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