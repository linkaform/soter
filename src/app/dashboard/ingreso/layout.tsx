import { BasicLayout } from "@/components/Layout/BasicLayout"
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Ingreso",
}

export default function IngresoLayout({ children }: { children: React.ReactNode }) {
  return <BasicLayout>{children}</BasicLayout>
}
