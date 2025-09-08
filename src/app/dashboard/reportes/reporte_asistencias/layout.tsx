import { BasicLayout } from "@/components/Layout/BasicLayout";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Reportes",
};

export default function ReportsPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Favicon directamente */}
      <link rel="icon" href="/accesos.svg" type="image/svg+xml" />

      {/* Layout principal */}
      <BasicLayout>{children}</BasicLayout>
    </>
  );
}