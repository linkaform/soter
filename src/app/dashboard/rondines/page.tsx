"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { RondinesTable } from "@/components/table/rondines/table";
import ReusableAccordion from "@/components/resuable-accordion";
import RondinesCalendar from "@/components/pages/rondines/calendar";
import PageTitle from "@/components/page-title";
import { GuardiasRondinesTable } from "@/components/table/rondines/guardias/table";

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
                icon: null,
              },
              {
                label: "Guardias en Recorrido",
                value: 0,
                icon: null,
              },
              {
                label: "Guardias disponibles / En Turno",
                value: 6,
                icon: null,
              },
            ]}
          />

          <PageTitle title="Registro y Seguimiento de Recorridos" />

          <div className="">
            <Tabs defaultValue="Pendientes" className="w-full">
              <TabsList>
                <TabsTrigger value="Pendientes">Pendientes</TabsTrigger>
                <TabsTrigger value="Realizados">Realizados</TabsTrigger>
                <TabsTrigger value="Cancelados">Cancelados</TabsTrigger>
                <TabsTrigger value="Todos">Todos</TabsTrigger>
              </TabsList>
              <TabsContent value="Pendientes">
                <div className="flex">
                  <div className="w-1/4 px-4">
                    <div className="space-y-4">
                      <GuardiasRondinesTable />
                    </div>
                  </div>

                  <div className="w-3/4">
                    <RondinesCalendar />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="Realizados">
                <div className="flex">
                  <div className="w-1/4">
                    <div className="space-y-4">
                      <GuardiasRondinesTable />
                    </div>
                  </div>

                  <div className="w-3/4 px-4">
                    <RondinesCalendar />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="Cancelados">
                <div className="">
                  <RondinesTable />
                </div>
              </TabsContent>

              <TabsContent value="Todos">
                <div className="">
                  <RondinesTable />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RondinesPage;
