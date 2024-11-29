"use client";

import React from "react";
import { RondinesTable } from "@/components/table/rondines/table";
import ReusableAccordion from "@/components/resuable-accordion";

const RondinesPage = () => {
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
                label: "Recorridos Pendientes",
                value: 0,
                icon: null, // No hay ícono en este caso.
              },
              {
                label: "Guardias en Recorrido",
                value: 0,
                icon: null, // No hay ícono en este caso.
              },
              {
                label: "Guardias disponibles / En Turno",
                value: 6,
                icon: null, // No hay ícono en este caso.
              },
            ]}
          />

          <div className="">
            <RondinesTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RondinesPage;
