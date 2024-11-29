import { MainLayout } from "@/components/Layout/MainLayout"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Articulos",
}

export default function ArticulosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      

      <MainLayout>{children}</MainLayout>
    </>
  )
}
