"use client";

import React from "react";
import { PasesEntradaTable } from "@/components/table/pases-entrada/table";
import PageTitle from "@/components/page-title";

const RondinesPage = () => {
  return (
    <div className="">
      <div className="flex flex-col">
        <div className="p-6 space-y-6 w-full mx-auto">
          <PageTitle title="Historial de Pases" />
            <PasesEntradaTable />
        </div>
      </div>
    </div>
  );
};

export default RondinesPage;
