import { MainLayout } from "@/components/Layout/MainLayout"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Bitacoras",
}

export default function BitacorasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Favicon directamente */}
      <link rel="icon" href="/bitacoras.svg" type="image/svg+xml" />
      
      {/* Layout principal */}
      <MainLayout>{children}</MainLayout>
    </>
  );
}