import { MainLayout } from "@/components/Layout/MainLayout"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Historial pases de entrada",
}

export default function MisPasesEntradaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="icon" href="/history.svg" type="image/svg+xml" />
      <MainLayout>{children}</MainLayout>
    </>
  );
}