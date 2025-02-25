"use client";

import React from "react";
import { HeaderPase } from "../header-pase";

export const PaseLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <div className="">
      <HeaderPase />
      <main className="">
        {children}
      </main>
    </div>
  );
};
