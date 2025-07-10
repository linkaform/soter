import { MainLayout } from "@/components/Layout/MainLayout"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Rondines",
}

export default function RondinesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Favicon directamente */}
      <link rel="icon" href="/rondines.svg" type="image/svg+xml" />
      
      {/* Layout principal */}
      <MainLayout>{children}</MainLayout>
    </>
  );
}