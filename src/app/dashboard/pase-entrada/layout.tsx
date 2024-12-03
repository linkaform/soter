import { MainLayout } from "@/components/Layout/MainLayout"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Pase de entrada",
}

export default function PaseEntradaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Favicon directamente */}
      <link rel="icon" href="/pases.svg" type="image/svg+xml" />
      
      {/* Layout principal */}
      <MainLayout>{children}</MainLayout>
    </>
  );
}