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
import { dateToString } from "@/lib/utils";
import { toast } from "sonner";
import ChangeLocation from "@/components/changeLocation";
import { useShiftStore } from "@/store/useShiftStore";

const IncidenciasPage = () => {

  const [prioridades, setPrioridades] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {location, area} = useShiftStore()
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location);
  const [areaSeleccionada, setAreaSeleccionada] = useState(area);

  const [isSuccessIncidencia, setIsSuccessIncidencia] = useState(false);
  const [modalData] = useState<any>(null);
  const [selectedFallas, setSelectedFallas]= useState<string[]>([]);
  const [selectedIncidencias, setSelectedIncidencias]= useState<string[]>([]);

  const [date1, setDate1] = useState<Date|"">("")
  const [date2, setDate2] = useState<Date|"">("")

  const [dates, setDates] = useState<string[]>([])
  const [dateFilter, setDateFilter] = useState<string>("this_month")

  const [fallasStatus, setFallasStatus] = useState<string>("")
  const { data:dataFallas,isLoading:isLoadingFallas, refetch:refetchFallas} = useGetFallas(ubicacionSeleccionada, areaSeleccionada == "todas" ? "" : areaSeleccionada ,fallasStatus,  dates[0], dates[1], dateFilter);
  const { listIncidencias, refetchTableIncidencias, isLoadingListIncidencias , stats} = useInciencias(ubicacionSeleccionada, areaSeleccionada == "todas" ? "" : areaSeleccionada, [],  true, false, dates[0], dates[1], dateFilter);
  const [selectedTab, setSelectedTab] = useState<string>('Incidencias'); 

//   const {location, area} = useShiftStore()
//   const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location);
//   const [areaSeleccionada, setAreaSeleccionada] = useState(area)

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

	const Filter = () => {
		if(date1 && date2){
			const f1= dateToString(new Date(date1)) 
			const f2= dateToString(new Date(date2)) 
			setDates([f1,f2])
		}else{
			toast.error("Escoge un rango de fechas.")
		}
	};

	const handleTabChangeTab = (newTab: any) => {
		setSelectedTab(newTab); 
	  };

	const handleTabChange = (tab:string, option:string) => {
		if(tab == "Fallas"){
			if(tab == selectedTab && fallasStatus=="abierto"){
				setFallasStatus(""); 
				setSelectedTab(tab);
			}else{
				setFallasStatus(option); 
				setSelectedTab(tab)
			}
		}else if (tab == "Incidencias"){
			setDateFilter(option); 
			setSelectedTab(tab)
		}
	};

  return (
    <div className="">
		
      <div className="p-6 space-y-1 pt-3 mt-0 pb-0 mb-0 w-full mx-auto">
		<div className="flex justify-between">
			<div>
				<PageTitle title="Registro de Incidencias y Fallas" />	
			</div>
			<div className="flex gap-5">
				<div>
					<ChangeLocation
						ubicacionSeleccionada={ubicacionSeleccionada}
						areaSeleccionada={areaSeleccionada}
						setUbicacionSeleccionada={setUbicacionSeleccionada}
						setAreaSeleccionada={setAreaSeleccionada}
					/>
				</div>
				<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						dateFilter== "today"&& selectedTab!=="Fallas" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() =>  handleTabChange("Incidencias","today")}>
					<div className="flex gap-6"><TriangleAlert className="text-primary w-10 h-10" />
						<span className="flex items-center font-bold text-4xl"> {stats?.incidentes_x_dia}</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Incidencias del Día</span>
				</div>
				<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						dateFilter== "this_week" && selectedTab!=="Fallas"? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => handleTabChange("Incidencias","this_week")}>
					<div className="flex gap-6"><TriangleAlert className="text-primary w-8 h-10" />
						<span className="flex items-center font-bold text-4xl"> {stats?.incidentes_x_dia}</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Incidencias de la Semana</span>
				</div>
				<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						dateFilter== "this_month" && selectedTab!=="Fallas"? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => handleTabChange("Incidencias","this_month")}>
					<div className="flex gap-6"><TriangleAlert className="text-primary w-10 h-10" />
						<span className="flex items-center font-bold text-4xl"> {stats?.incidentes_x_dia}</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Incidentes del Mes</span>
				</div>

				<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						fallasStatus== "abierto" && selectedTab!=="Incidencias" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => handleTabChange("Fallas","abierto")}>
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
		
          	<Tabs defaultValue="Incidencias" className="w-full" value={selectedTab}  onValueChange={handleTabChangeTab}>
			
            <TabsContent value="Incidencias">
              <div className="">
                <IncidenciasTable data={listIncidencias} refetch={refetchTableIncidencias} setPrioridades={setPrioridades} 
                isLoading={isLoadingListIncidencias} openModal={openModalIncidencia} setSelectedIncidencias={setSelectedIncidencias} selectedIncidencias={selectedIncidencias} 
				date1={date1} date2={date2} setDate1={setDate1} setDate2={setDate2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter}
				// ubicacionSeleccionada={ubicacionSeleccionada} areaSeleccionada={areaSeleccionada} setUbicacionSeleccionada={setUbicacionSeleccionada} 
				// setAreaSeleccionada={setAreaSeleccionada} 
				/>
              </div>
            </TabsContent>
            <TabsContent value="Fallas">
              <div className="">
                <FallasTable  data={dataFallas} refetch={refetchFallas} setPrioridades={setPrioridades} isLoading={isLoadingFallas} 
                openModal={openModal} setSelectedFallas={setSelectedFallas} selectedFallas={selectedFallas} 
				date1={date1} date2={date2} setDate1={setDate1} setDate2={setDate2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter}
				// ubicacionSeleccionada={ubicacionSeleccionada} areaSeleccionada={areaSeleccionada} setUbicacionSeleccionada={setUbicacionSeleccionada} 
				// 	setAreaSeleccionada={setAreaSeleccionada}
					/>
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
