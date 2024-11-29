// components/Layout/MainLayout.tsx
import React from "react";

export const BasicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="">
      <main className="">
        {children}
      </main>
    </div>
  );
};