"use client";

import React from "react";


import Vehicles from "@/components/icon/vehicles";
import Exit from "@/components/icon/exit";
import { Home, Users } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LockerTable } from "@/components/table/bitacoras/locker/table";
import ReusableAccordion from "@/components/resuable-accordion";
import PageTitle from "@/components/page-title";
import { useGetListBitacora } from "@/hooks/useGetListBitacora";
import BitacorasTable from "@/components/table/bitacoras/table";

const BitacorasPage = () => {
  const { data, refetch} = useGetListBitacora("", "");

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
                label: "Visitas en el Día",
                value: 23,
                icon: <Home className="text-primary" />,
              },
              {
                label: "Personal Dentro",
                value: 23,
                icon: <Users className="text-primary" />,
              },
              {
                label: "Vehículos Dentro",
                value: 23,
                icon: <Vehicles />,
              },
              {
                label: "Salidas Registradas",
                value: 23,
                icon: <Exit />,
              },
            ]}
          />


        <PageTitle title="Registro y seguimiento de entradas y salidas" />


   
          <Tabs defaultValue="Personal" className="w-full">
            <TabsList>
              <TabsTrigger value="Personal">Personal</TabsTrigger>
              <TabsTrigger value="Locker">Locker</TabsTrigger>
            </TabsList>
            <TabsContent value="Personal">
              <div className="">
                <BitacorasTable data={data} refetch={refetch} />
              </div>
            </TabsContent>
            <TabsContent value="Locker">
              <div className="">
                <LockerTable />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BitacorasPage;
