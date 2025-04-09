"use client";

import React, { useEffect, useState } from "react";

import { TriangleAlert, UndoDot } from "lucide-react";

import { Tabs, TabsContent} from "@/components/ui/tabs";
import PageTitle from "@/components/page-title";
import IncidenciasTable from "@/components/table/incidencias/table";
import FallasTable from "@/components/table/incidencias/fallas/table";
import { useGetFallas } from "@/hooks/useGetFallas";
import { AddFallaModal } from "@/components/modals/add-falla";
import { AddIncidenciaModal } from "@/components/modals/add-incidencia";
import { useInciencias } from "@/hooks/useIncidencias";
import { useShiftStore } from "@/store/useShiftStore";

const IncidenciasPage = () => {

  const [prioridades, setPrioridades] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessIncidencia, setIsSuccessIncidencia] = useState(false);
  const [modalData] = useState<any>(null);
  const [selectedFallas, setSelectedFallas]= useState<string[]>([]);
  const [selectedIncidencias, setSelectedIncidencias]= useState<string[]>([]);
  const { data:dataFallas,isLoading:isLoadingFallas, refetch:refetchFallas} = useGetFallas("", "","abierto");
  const { listIncidencias, refetchTableIncidencias, isLoadingListIncidencias , stats} = useInciencias([],  true, false);


  const {location, area} = useShiftStore()
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location);
  const [areaSeleccionada, setAreaSeleccionada] = useState(area)

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
		
      <div className="p-6 space-y-1 pt-3 mt-0 pb-0 mb-0 w-full mx-auto">
		<div className="flex justify-between">
			<div>
				<PageTitle title="Registro de Incidencias y Fallas" />	
			</div>
			<div className="flex gap-5">
				<div className="border px-12 py-1 rounded-md">
					<div className="flex gap-6"><TriangleAlert className="text-primary w-10 h-10" />
						<span className="flex items-center font-bold text-4xl"> {stats?.incidentes_x_dia}</span>
						
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Incidentes x Día</span>
				</div>
				<div className="border p-4 px-12 py-1 rounded-md">
					<div className="flex gap-6"><UndoDot className="text-primary w-10 h-10"/>
						<span className="flex items-center font-bold text-4xl"> {stats?.fallas_pendientes}</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Fallas pendientes</span>
				</div>
			</div>
		</div>
		
          	<Tabs defaultValue="Incidencias" className="w-full">
			
            <TabsContent value="Incidencias">
              <div className="">
                <IncidenciasTable data={listIncidencias} refetch={refetchTableIncidencias} setPrioridades={setPrioridades} 
                isLoading={isLoadingListIncidencias} openModal={openModalIncidencia} setSelectedIncidencias={setSelectedIncidencias} selectedIncidencias={selectedIncidencias} 
				ubicacionSeleccionada={ubicacionSeleccionada} areaSeleccionada={areaSeleccionada} setUbicacionSeleccionada={setUbicacionSeleccionada} 
				setAreaSeleccionada={setAreaSeleccionada} />
              </div>
            </TabsContent>
            <TabsContent value="Fallas">
              <div className="">
                <FallasTable  data={dataFallas} refetch={refetchFallas} setPrioridades={setPrioridades} isLoading={isLoadingFallas} 
                openModal={openModal} setSelectedFallas={setSelectedFallas} selectedFallas={selectedFallas} 
				ubicacionSeleccionada={ubicacionSeleccionada} areaSeleccionada={areaSeleccionada} setUbicacionSeleccionada={setUbicacionSeleccionada} 
					setAreaSeleccionada={setAreaSeleccionada}/>
              </div>
            </TabsContent>
          </Tabs>

		  <AddFallaModal
			title={"Crear falla"}
			data={modalData}
			isSuccess={isSuccess}
			setIsSuccess={setIsSuccess}
			onClose={closeModal}
		/>
      	<AddIncidenciaModal
			title={"Crear Incidencia"}
			isSuccess={isSuccessIncidencia}
			setIsSuccess={setIsSuccessIncidencia}
			onClose={closeModal}
		/>
      </div>
    </div>
  );
};

export default IncidenciasPage;
