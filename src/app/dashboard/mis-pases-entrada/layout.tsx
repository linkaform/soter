import { MainLayout } from "@/components/Layout/MainLayout"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Mis pases de entrada",
}

export default function MisPasesEntradaLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>
}
