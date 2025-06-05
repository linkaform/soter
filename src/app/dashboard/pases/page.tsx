"use client";

import React from "react";
import PageTitle from "@/components/page-title";
import { useGetMyPases } from "@/hooks/useGetMyPases";
import PasesEntradaTable from "@/components/table/pases-entrada/table";

const ListaPasesPage = () => {
  const { data, isLoading} = useGetMyPases();
  const records = data?.records
  
  return (
    <div className="">
      <div className="flex flex-col">
        <div className="p-6 space-y-6 w-full mx-auto">
          <PageTitle title="Historial de Pases" />
            <PasesEntradaTable isLoading={isLoading} pases={records}/>
        </div>
      </div>
    </div>
  );
};

export default ListaPasesPage;
