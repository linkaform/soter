"use client";

import React, { useState } from "react";


import { Archive, CircleHelp } from "lucide-react";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticulosPendientesTable } from "@/components/table/articulos/pendientes/table";
import { ConcecionadosTable } from "@/components/table/articulos/concecionados/table";
import { ArticulosDonadosTable } from "@/components/table/articulos/donados/table";
import { ArticulosEntregadosTable } from "@/components/table/articulos/entregados/table";
import ReusableAccordion from "@/components/resuable-accordion";
import PageTitle from "@/components/page-title";

const ArticulosPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stateArticle, setStateArticle] = useState("Pendientes");

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
                label: "Artículos concesionados pendientes",
                value: 23,
                icon: <Archive />,
              },
              { label: "Artículos perdidos", value: 15, icon: <CircleHelp /> },
            ]}
          />


       <PageTitle title="Registro y seguimiento de artículos" />


   
          <Tabs defaultValue="Perdidos" className="w-full">
            <TabsList>
              <TabsTrigger value="Perdidos">Artículos perdidos</TabsTrigger>
              <TabsTrigger value="Concecionados">
                Artículos concecionados
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Perdidos">
              {stateArticle === "Pendientes" && (
                <div className="">
                  <ArticulosPendientesTable />
                </div>
              )}

              {stateArticle === "Entregados" && (
                <div className="">
                  <ArticulosEntregadosTable />
                </div>
              )}

              {stateArticle === "Donados" && (
                <div className="">
                  <ArticulosDonadosTable />
                </div>
              )}
            </TabsContent>
            <TabsContent value="Concecionados">
              <div className="">
                <ConcecionadosTable />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ArticulosPage;
