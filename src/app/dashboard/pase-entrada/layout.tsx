import { MainLayout } from "@/components/Layout/MainLayout"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Pase de entrada",
}

export default function PaseEntradaLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>
}
