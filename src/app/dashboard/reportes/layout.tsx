import { MainLayout } from "@/components/Layout/MainLayout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Reportes",
};

export default function ReportsListPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Favicon directamente */}
      <link rel="icon" href="/accesos.svg" type="image/svg+xml" />

      {/* Layout principal */}
      <MainLayout>{children}</MainLayout>
    </>
  );
}