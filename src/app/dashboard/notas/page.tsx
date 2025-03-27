"use client";

import React from "react";

import { FolderOpen, Package, Sun } from "lucide-react";

import { ListaNotasTable } from "@/components/table/notas/lista-notas/table";
import ReusableAccordion from "@/components/resuable-accordion";
import PageTitle from "@/components/page-title";
import { useShiftStore } from "@/store/useShiftStore";

const NotasPage = () => {

    const { isLoading } = useShiftStore();
  



   
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }



  return (
    <div className="">
      <div className="flex flex-col">
        <div className="p-6 space-y-6 w-full mx-auto">
          <ReusableAccordion
            ubicaciones={[
              { value: "planta-monterrey", label: "Planta Monterrey" },
              { value: "planta-saltillo", label: "Planta Saltillo" },
            ]}
            casetas={[
              { value: "caseta-6", label: "Caseta 6 Poniente" },
              { value: "caseta-5", label: "Caseta 5 Norte" },
            ]}
            jefe="Emiliano Zapata"
            estadisticas={[
              {
                label: "Notas del Día",
                value: 0,
                icon: <Sun />,
              },
              {
                label: "Notas abiertas",
                value: 0,
                icon: <FolderOpen />,
              },
              {
                label: "Notas Estancadas",
                value: 6,
                icon: <Package />,
              },
            ]}
          />

          <PageTitle title="Listado de Notas" />
          <div className="">
            <ListaNotasTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotasPage;
