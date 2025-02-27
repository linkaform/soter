"use client";

import React, { useEffect, useState } from "react";

import { TriangleAlert, UndoDot } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReusableAccordion from "@/components/resuable-accordion";
import PageTitle from "@/components/page-title";
import { useGetIncidencias } from "@/hooks/useGetIncidencias";
import IncidenciasTable from "@/components/table/incidencias/table";
import FallasTable from "@/components/table/incidencias/fallas/table";
import { useGetFallas } from "@/hooks/useGetFallas";
import { AddFallaModal } from "@/components/modals/add-falla";
import { useGetStats } from "@/hooks/useGetStats";


const IncidenciasPage = () => {

  const [prioridades, setPrioridades] = useState<string[]>([]);

  const [isSuccess, setIsSuccess] = useState(false);
	const [modalData] = useState<any>(null);


  const { data,isLoading, refetch} = useGetIncidencias("", "",[]);
  const { data:dataFallas,isLoading:isLoadingFallas, refetch:refetchFallas} = useGetFallas("", "","abierto");
  const { data: dataStats} = useGetStats("", "", "Incidencias");

  useEffect(()=>{
    if(dataStats){
      console.log("errorAE",dataStats)
    }
  },[dataStats])

  useEffect(()=>{
    if(prioridades){
      refetch()
    }
  },[prioridades, refetch])
  
  const closeModal = () => {
		setIsSuccess(false);  // Reinicia el estado para que el modal no se quede abierto.
	};
  const openModal = () => {
		setIsSuccess(true);  // Reinicia el estado para que el modal no se quede abierto.
	};


  return (
    <div className="">
			<AddFallaModal
				title={"Crear falla"}
				data={modalData}
				isSuccess={isSuccess}
				setIsSuccess={setIsSuccess}
				onClose={closeModal}
        refetchTableFallas={refetchFallas}
			/>
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
                value: dataStats?.incidentes_x_dia,
                icon: <TriangleAlert />,
              },
              {
                label: "Fallas pendientes",
                value: dataStats?.fallas_pendientes,
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
                <IncidenciasTable data={data} refetch={refetch} setPrioridades={setPrioridades} isLoading={isLoading} openModal={openModal}/>
              </div>
            </TabsContent>
            <TabsContent value="Concecionados">
              <div className="">
                <FallasTable  data={dataFallas} refetch={refetchFallas} setPrioridades={setPrioridades} isLoading={isLoadingFallas} openModal={openModal}/>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default IncidenciasPage;
