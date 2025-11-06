"use client";

import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import RondinesTable from "@/components/table/rondines/table";
import PageTitle from "@/components/page-title";
import ChangeLocation from "@/components/changeLocation";
import { useShiftStore } from "@/store/useShiftStore";
import { arraysIguales } from "@/lib/utils";
import { Ban, BookCheck, CalendarClock, CheckCircle, Flag, Play, Search, Sun } from "lucide-react";
import { useGetStats } from "@/hooks/useGetStats";
import { useGetListRondines } from "@/hooks/Rondines/useGetListRondines";
import IncidenciasRondinesTable from "@/components/table/incidencias-rondines/table";
// import { Incidencia_record } from "@/components/table/incidencias/incidencias-columns";
import RondinesCalendar from "@/components/calendar";
import ChecksImagesSection from "@/components/ChecksImagesSection";
import { useIncidenciaRondin } from "@/hooks/Rondines/useRondinIncidencia";
import { RondinesBitacoraTable } from "@/components/table/rondines/bitacoras-table";


const RondinesPage = () => {
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const {location} = useShiftStore()
  const [ubicacionSeleccionada, setUbicacionSeleccionada]= useState<string>(location)
  const [areaSeleccionada, setAreaSeleccionada]= useState<string>("")
  const { tab, filter} = useShiftStore()
  const [dateFilter, setDateFilter] = useState<string>(filter)
  const [selectedTab, setSelectedTab] = useState<string>(tab ? tab: "Rondines"); 
  const { data: stats } = useGetStats(ubicacionSeleccionada&& areaSeleccionada?true:false,ubicacionSeleccionada, areaSeleccionada=="todas"?"":areaSeleccionada, 'Rondines')
  const { listRondines } = useGetListRondines(true ,"","", 100,0 )

  const [selectedRondin, setSelectedRondin]= useState<string[]|null>([]);

  const [date1, setDate1] = useState<Date|"">("")
  const [date2, setDate2] = useState<Date|"">("")
  const [activeTab, setActiveTab] = useState("Rondines");

  const [openModal, setOpenModal] = useState(false);

  const [selectedIncidencias, setSelectedIncidencias] = useState<string[]>([])


  const {listIncidenciasRondin} = useIncidenciaRondin("", "");

  const handleTabChange = (tab:string, option:string[], filter="") => {
		if(tab==selectedTab && arraysIguales(option, selectedOption) && filter == dateFilter){
				setSelectedOption([]);
				setSelectedTab(selectedTab)  
				setDateFilter("")
		}else{
			setDateFilter( filter=="today"? filter:"")
			setSelectedOption(option); 
			setSelectedTab(tab)
		}
	};
  

	const Filter = () => {
		// const f1= dateToString(new Date(date1)) 
		// const f2= dateToString(new Date(date2)) 
		// setDatePrimera(f1)
		// setDateSegunda(f2)
		// setDates([f1,f2])
	};

	const resetTableFilters = ()=>{
		// setDatePrimera("");
		// setDateSegunda("");
		setDate1("")
		setDate2("")
		setDateFilter(""); 
		setSelectedTab(selectedTab);
	}

  return (
    <div className="">
      <div className="flex flex-col">
        <div className="p-6  w-full mx-auto">
			{activeTab == "Vista" &&(
				<div className="flex justify-between ">
					<div>
						<PageTitle title="Registro y Seguimiento de Rondines" />	
					</div>
					<div className="flex w-1/2 items-center gap-10 justify-end">
						<div className="w-2/12">
							<ChangeLocation
								ubicacionSeleccionada={ubicacionSeleccionada}
								areaSeleccionada={areaSeleccionada}
								setUbicacionSeleccionada={setUbicacionSeleccionada}
								setAreaSeleccionada={setAreaSeleccionada}
							/>
						</div>

						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
							dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
							onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
							<div className="flex gap-6">
								<Play className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl">
								{stats?.visitas_en_dia} 0
								</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Ejecuciones</span>
						</div>

						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
							dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
							onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
							<div className="flex gap-6">
								<Flag className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl">
								{stats?.visitas_en_dia} 0
								</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Incidentes</span>
						</div>

						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
							dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
							onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
							<div className="flex gap-6">
								<BookCheck className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl">
								{stats?.visitas_en_dia} 0
								</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Tareas</span>
						</div>

					</div>
				</div>
			)}

			{activeTab == "Rondines" &&(
				<div className="flex justify-between ">
					<div>
						<PageTitle title="Registro y Seguimiento de Rondines" />	
					</div>
					<div className="flex w-1/2 items-center gap-10 justify-end">
						<div className="w-2/12">
							<ChangeLocation
								ubicacionSeleccionada={ubicacionSeleccionada}
								areaSeleccionada={areaSeleccionada}
								setUbicacionSeleccionada={setUbicacionSeleccionada}
								setAreaSeleccionada={setAreaSeleccionada}
							/>
						</div>

						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
							dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
							onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
							<div className="flex gap-6">
								<CalendarClock className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl">
								{stats?.visitas_en_dia} 0
								</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Rondines Programados</span>
						</div>

					</div>
				</div>
			)}
			{activeTab == "Bitacora" &&(
				<div className="flex justify-between ">
					<div>
						<PageTitle title="Registro y Seguimiento de Rondines" />	
					</div>
					<div className="flex w-1/2 items-center gap-10 justify-end">
						<div className="w-2/12">
							<ChangeLocation
								ubicacionSeleccionada={ubicacionSeleccionada}
								areaSeleccionada={areaSeleccionada}
								setUbicacionSeleccionada={setUbicacionSeleccionada}
								setAreaSeleccionada={setAreaSeleccionada}
							/>
						</div>

						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
							dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
							onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
							<div className="flex gap-6">
								<Sun className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl">
								{stats?.visitas_en_dia} 0
								</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Recorridos del Día</span>
						</div>
						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
							dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
							onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
							<div className="flex gap-6">
								<Search className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl">
								{stats?.visitas_en_dia} 0
								</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Áreas Inspeccionadas</span>
						</div>

					</div>
				</div>
			)}

			{activeTab == "Incidencias" &&(
				<div className="flex justify-between ">
					<div>
						<PageTitle title="Registro y Seguimiento de Rondines" />	
					</div>
					<div className="flex w-1/2 items-center gap-10 justify-end">
						<div className="w-2/12">
							<ChangeLocation
								ubicacionSeleccionada={ubicacionSeleccionada}
								areaSeleccionada={areaSeleccionada}
								setUbicacionSeleccionada={setUbicacionSeleccionada}
								setAreaSeleccionada={setAreaSeleccionada}
							/>
						</div>

						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
							dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
							onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
							<div className="flex gap-6">
								<CalendarClock className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl">
								{stats?.visitas_en_dia} 0
								</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Incidentes del Día</span>
						</div>
					</div>
				</div>
			)}

			{activeTab == "Fotos" &&(
				<div className="flex justify-between ">
					<div>
						<PageTitle title="Registro y Seguimiento de Rondines" />	
					</div>
					<div className="flex w-1/2 items-center gap-10 justify-end">
						<div className="w-2/12">
							<ChangeLocation
								ubicacionSeleccionada={ubicacionSeleccionada}
								areaSeleccionada={areaSeleccionada}
								setUbicacionSeleccionada={setUbicacionSeleccionada}
								setAreaSeleccionada={setAreaSeleccionada}
							/>
						</div>

						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
							dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
							onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
							<div className="flex gap-6">
								<Sun className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl">
								{stats?.visitas_en_dia} 0
								</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Fotografías del Día</span>
						</div>
					</div>
				</div>
			)}

			{activeTab == "Calendario" &&(
				<div className="flex justify-between ">
					<div>
						<PageTitle title="Registro y Seguimiento de Rondines" />	
					</div>
					<div className="flex w-1/2 items-center gap-10 justify-end">
						<div className="w-2/12">
							<ChangeLocation
								ubicacionSeleccionada={ubicacionSeleccionada}
								areaSeleccionada={areaSeleccionada}
								setUbicacionSeleccionada={setUbicacionSeleccionada}
								setAreaSeleccionada={setAreaSeleccionada}
							/>
						</div>

						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
							dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
							onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
							<div className="flex gap-6">
								<CalendarClock className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl">
								{stats?.visitas_en_dia} 0
								</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Rondines Programados</span>
						</div>
						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
							dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
							onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
							<div className="flex gap-6">
								<CheckCircle className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl">
								{stats?.visitas_en_dia} 0
								</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Rondines Realizados</span>
						</div>
						<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
							dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
							onClick={() => {handleTabChange("Personal",["entrada"], "today");}}>
							<div className="flex gap-6">
								<Ban className="text-primary w-10 h-10" />
								<span className="flex items-center font-bold text-4xl">
								{stats?.visitas_en_dia} 0
								</span>
							</div>
							<div className="flex items-center space-x-0">
								<div className="h-1 w-1/2 bg-cyan-100"></div>
								<div className="h-1 w-1/2 bg-blue-500"></div>
							</div>
							<span className="text-md">Rondines Cancelados</span>
						</div>
					</div>
				</div>
			)}

		{/* <ViewDetalleArea title={"Detalle del Área"} data={[]} isSuccess={isSuccess} setIsSuccess={setIsSuccess}>  </ViewDetalleArea> */}

			<div className="" >
				<Tabs defaultValue="Rondines" className="w-full" onValueChange={setActiveTab}>
					<TabsContent value="Bitacora">
						{/* <div >
						<RondinesTable data={listRondines} isLoading={false} setSelectedRondin={setSelectedRondin} selectedRondin={selectedRondin}
						setDate1={setDate1} setDate2={setDate2} date1={date1} date2={date2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} setActiveTab={setActiveTab} activeTab={activeTab}/>
						</div> */}
						<div className="p-2">
							<RondinesBitacoraTable/>
						</div>
						
					</TabsContent>

					<TabsContent value="Incidencias">
						<div>
						<IncidenciasRondinesTable data={listIncidenciasRondin} 
							isLoading={false}  setSelectedIncidencias={setSelectedIncidencias} selectedIncidencias={selectedIncidencias} 
							date1={date1} date2={date2} setDate1={setDate1} setDate2={setDate2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} openModal={openModal} setOpenModal={setOpenModal}
							/>
						
						</div>
					</TabsContent>

					<TabsContent value="Fotos">
						<div>
							<ChecksImagesSection
								location={ubicacionSeleccionada}
								area={areaSeleccionada}
							/>
						</div>
					</TabsContent>

					<TabsContent value="Rondines">
						<div >
							<RondinesTable data={listRondines} isLoading={false} setSelectedRondin={setSelectedRondin} selectedRondin={selectedRondin}
							setDate1={setDate1} setDate2={setDate2} date1={date1} date2={date2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} setActiveTab={setActiveTab} activeTab={activeTab}/>
						</div>
					</TabsContent>

					<TabsContent value="Calendario">
						<div >
							<div className="w-3/4">
								<RondinesCalendar />
							</div>
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
