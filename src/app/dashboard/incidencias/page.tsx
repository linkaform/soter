"use client";

import React, { useEffect, useState } from "react";

import { TriangleAlert, UndoDot } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReusableAccordion from "@/components/resuable-accordion";
import PageTitle from "@/components/page-title";
import IncidenciasTable from "@/components/table/incidencias/table";
import FallasTable from "@/components/table/incidencias/fallas/table";
import { useGetFallas } from "@/hooks/useGetFallas";
import { AddFallaModal } from "@/components/modals/add-falla";
import { useGetStats } from "@/hooks/useGetStats";
import { AddIncidenciaModal } from "@/components/modals/add-incidencia";
import { useInciencias } from "@/hooks/useIncidencias";

const IncidenciasPage = () => {

  const [prioridades, setPrioridades] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessIncidencia, setIsSuccessIncidencia] = useState(false);
	const [modalData] = useState<any>(null);
  const [selectedFallas, setSelectedFallas]= useState<string[]>([]);
  const [selectedIncidencias, setSelectedIncidencias]= useState<string[]>([]);
  // const { data,isLoading, refetch} = useGetIncidencias("", "",[]);
  const { data:dataFallas,isLoading:isLoadingFallas, refetch:refetchFallas} = useGetFallas("", "","abierto");
  // const { data: dataStats} = useGetStats("", "", "incidencias");
  const { listIncidencias, refetchTableIncidencias, isLoadingListIncidencias , stats, statsError} = useInciencias([], true);

  useEffect(()=>{
    if(prioridades){
      refetchTableIncidencias()
    }
  },[prioridades, refetchTableIncidencias])
  
  const closeModal = () => {
		setIsSuccess(false);  
	};
  const openModal = () => {
		setIsSuccess(true);  
	};
  const openModalIncidencia = () => {
		setIsSuccessIncidencia(true);  
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
      <AddIncidenciaModal
				title={"Crear Incidencia"}
				data={modalData}
				isSuccess={isSuccessIncidencia}
				setIsSuccess={setIsSuccessIncidencia}
				onClose={closeModal}
			/>
      <div className="flex flex-col">
        <div className="p-6 w-full pt-0 mb-2">
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
                value: stats?.incidentes_x_dia,
                icon: <TriangleAlert />,
              },
              {
                label: "Fallas pendientes",
                value: stats?.fallas_pendientes,
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
                <IncidenciasTable data={listIncidencias} refetch={refetchTableIncidencias} setPrioridades={setPrioridades} 
                isLoading={isLoadingListIncidencias} openModal={openModalIncidencia} setSelectedIncidencias={setSelectedIncidencias} selectedIncidencias={selectedIncidencias}/>
              </div>
            </TabsContent>
            <TabsContent value="Concecionados">
              <div className="">
                <FallasTable  data={dataFallas} refetch={refetchFallas} setPrioridades={setPrioridades} isLoading={isLoadingFallas} 
                openModal={openModal} setSelectedFallas={setSelectedFallas} selectedFallas={selectedFallas} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default IncidenciasPage;
