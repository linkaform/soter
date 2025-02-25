import { PaseLayout } from "@/components/Layout/PaseLayout";
import { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
  title: "Pase de entrada",
}

export default function PaseUpdateLayout({ children}: { children: React.ReactNode }) {
  return (
    <>
      <link rel="icon" href="/pases.svg" type="image/svg+xml" />
      <PaseLayout>{children}</PaseLayout>
    </>
  );
}