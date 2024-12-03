"use client";

import React from "react";

import { TriangleAlert, UndoDot } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncidenciasTable } from "@/components/table/incidencias/table";
import { FallasTable } from "@/components/table/incidencias/fallas/table";
import ReusableAccordion from "@/components/resuable-accordion";
import PageTitle from "@/components/page-title";

const IncidenciasPage = () => {
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
                label: "Incidentes X Día",
                value: 65,
                icon: <TriangleAlert />,
              },
              {
                label: "Fallas pendientes",
                value: 29,
                icon: <UndoDot />,
              },
            ]}
          />



       <PageTitle title="Registro de incidencias y fallas" />


      
          <Tabs defaultValue="Perdidos" className="w-full">
            <TabsList>
              <TabsTrigger value="Perdidos">Incidencias</TabsTrigger>
              <TabsTrigger value="Concecionados">Fallas</TabsTrigger>
            </TabsList>
            <TabsContent value="Perdidos">
              <div className="">
                <IncidenciasTable />
              </div>
            </TabsContent>
            <TabsContent value="Concecionados">
              <div className="">
                <FallasTable />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default IncidenciasPage;
