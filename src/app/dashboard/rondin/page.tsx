"use client";

import React, { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import RondinesTable from "@/components/table/rondines/table";
import RondinesCalendar from "@/components/pages/rondines/calendar";
import PageTitle from "@/components/page-title";
import ChangeLocation from "@/components/changeLocation";
import { useShiftStore } from "@/store/useShiftStore";
import { arraysIguales, dateToString } from "@/lib/utils";
import { CalendarClock } from "lucide-react";
import { useGetStats } from "@/hooks/useGetStats";
import GuardiasRondinesTable from "@/components/table/rondines/guardias/table";

const RondinesPage = () => {
	const [selectedOption, setSelectedOption] = useState<string[]>([]);
	const [ubicacionSeleccionada, setUbicacionSeleccionada]= useState<string>("")
	const [areaSeleccionada, setAreaSeleccionada]= useState<string>("")
	const { tab, filter} = useShiftStore()
	const [dateFilter, setDateFilter] = useState<string>(filter)
	const [selectedTab, setSelectedTab] = useState<string>(tab ? tab: "Rondines"); 
	const { data: stats } = useGetStats(ubicacionSeleccionada&& areaSeleccionada?true:false,ubicacionSeleccionada, areaSeleccionada=="todas"?"":areaSeleccionada, 'Rondines')

	const [datePrimera, setDatePrimera] = useState<string>("")
	const [dateSegunda, setDateSegunda] = useState<string>("")
	const [selectedRondin, setSelectedRondin]= useState<string[]|null>([]);

	const [date1, setDate1] = useState<Date|"">("")
	const [date2, setDate2] = useState<Date|"">("")

	const [ activeTab ,setActiveTab] = useState("")
	console.log("activeTab", activeTab)

	console.log(datePrimera, dateSegunda)
	const data: any[] = [
		{
		folio: 1,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Juan Pérez',
		dateHourStart: '14-05-2024 09:30',
		dateHourFin: '14-05-2024 09:30',
		nameRoute: 'Soy una ruta',
		pointsRoute: '36 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '25 min',
		recurrence:"diariamente"
	}, {
		folio: 2,
		status: false,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'María Rodríguez',
		dateHourStart: '10-05-2024 14:45',
		dateHourFin: '10-05-2024 14:45',
		nameRoute: 'Ruta inspeccion',
		pointsRoute: '26 áreas',
		observations: 'Soy una ruta',
		evidence: 'evidencias',
		durationRoute: '40 min',
		recurrence:"personalizado"
	}, {
		folio: 3,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Pedro Gómez',
		dateHourStart: '12-05-2024 11:20',
		dateHourFin: '12-05-2024 11:20',
		nameRoute: 'Salida 1',
		pointsRoute: '39 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '3 hrs',
		recurrence:"todos los dias de las semana"
	}, {
		folio: 4,
		status: false,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Ana López',
		dateHourStart: '08-06-2024 08:00',
		dateHourFin: '08-06-2024 08:00',
		nameRoute: 'Soy una ruta',
		pointsRoute: '20 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '1 hrs 20 min',
		recurrence:"personalizado"
	}, {
		folio: 5,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'David Martínez',
		dateHourStart: '13-06-2024 15:10',
		dateHourFin: '13-06-2024 15:10',
		nameRoute: 'Soy una ruta',
		pointsRoute: '33 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '2 hrs 20 min',
		recurrence:"diariamente"
	},
	{
		folio: 6,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Juan Pérez',
		dateHourStart: '14-05-2024 09:30',
		dateHourFin: '14-05-2024 09:30',
		nameRoute: 'Recorrido VBH',
		pointsRoute: '36 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '25 min',
		recurrence:"diariamente"
	}, {
		folio: 7,
		status: false,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'María Rodríguez',
		dateHourStart: '10-05-2024 14:45',
		dateHourFin: '10-05-2024 14:45',
		nameRoute: 'Recorrido WOI',
		pointsRoute: '26 áreas',
		observations: 'Soy una ruta',
		evidence: 'evidencias',
		durationRoute: '40 min',
		recurrence:"personalizado"
	}, {
		folio: 8,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Pedro Gómez',
		dateHourStart: '12-05-2024 11:20',
		dateHourFin: '12-05-2024 11:20',
		nameRoute: 'Ruta 1',
		pointsRoute: '39 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '3 hrs',
		recurrence:"todos los dias de las semana"
	}, {
		folio: 9,
		status: false,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Ana López',
		dateHourStart: '08-06-2024 08:00',
		dateHourFin: '08-06-2024 08:00',
		nameRoute: 'Ruta 2',
		pointsRoute: '20 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '1 hrs 20 min',
		recurrence:"personalizado"
	}, {
		folio: 10,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'David Martínez',
		dateHourStart: '13-06-2024 15:10',
		dateHourFin: '13-06-2024 15:10',
		nameRoute: 'Ruta 3',
		pointsRoute: '33 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '2 hrs 20 min',
		recurrence:"diariamente"
	},
	{
		folio: 11,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Juan Pérez',
		dateHourStart: '14-05-2024 09:30',
		dateHourFin: '14-05-2024 09:30',
		nameRoute: 'Soy una ruta',
		pointsRoute: '36 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '25 min',
		recurrence:"diariamente"
	}, {
		folio: 12,
		status: false,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'María Rodríguez',
		dateHourStart: '10-05-2024 14:45',
		dateHourFin: '10-05-2024 14:45',
		nameRoute: 'Soy una ruta',
		pointsRoute: '26 áreas',
		observations: 'Soy una ruta',
		evidence: 'evidencias',
		durationRoute: '40 min',
		recurrence:"personalizado"
	}, {
		folio: 13,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Pedro Gómez',
		dateHourStart: '12-05-2024 11:20',
		dateHourFin: '12-05-2024 11:20',
		nameRoute: 'Salidas 5',
		pointsRoute: '39 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '3 hrs',
		recurrence:"todos los dias de las semana"
	}, {
		folio: 14,
		status: false,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Ana López',
		dateHourStart: '08-06-2024 08:00',
		dateHourFin: '08-06-2024 08:00',
		nameRoute: 'Soy una ruta',
		pointsRoute: '20 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '1 hrs 20 min',
		recurrence:"personalizado"
	}, {
		folio: 15,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'David Martínez',
		dateHourStart: '13-06-2024 15:10',
		dateHourFin: '13-06-2024 15:10',
		nameRoute: 'Soy una ruta',
		pointsRoute: '33 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '2 hrs 20 min',
		recurrence:"diariamente"
	},	{
		folio: 16,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Juan Pérez',
		dateHourStart: '14-05-2024 09:30',
		dateHourFin: '14-05-2024 09:30',
		nameRoute: 'Estacion recorrido',
		pointsRoute: '36 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '25 min',
		recurrence:"diariamente"
	}, {
		folio: 17,
		status: false,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'María Rodríguez',
		dateHourStart: '10-05-2024 14:45',
		dateHourFin: '10-05-2024 14:45',
		nameRoute: 'Soy una ruta',
		pointsRoute: '26 áreas',
		observations: 'Soy una ruta',
		evidence: 'evidencias',
		durationRoute: '40 min',
		recurrence:"personalizado"
	}, {
		folio: 18,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Pedro Gómez',
		dateHourStart: '12-05-2024 11:20',
		dateHourFin: '12-05-2024 11:20',
		nameRoute: 'Soy una ruta',
		pointsRoute: '39 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '3 hrs',
		recurrence:"todos los dias de las semana"
	}, {
		folio:19,
		status: false,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'Ana López',
		dateHourStart: '08-06-2024 08:00',
		dateHourFin: '08-06-2024 08:00',
		nameRoute: 'Soy una ruta',
		pointsRoute: '20 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '1 hrs 20 min',
		recurrence:"personalizado"
	}, {
		folio: 20,
		status: true,
		ubi: 'Planta Monterrey',
		area: 'Caseta Vigilancia Norte 3',
		nameGuard: 'David Martínez',
		dateHourStart: '13-06-2024 15:10',
		dateHourFin: '13-06-2024 15:10',
		nameRoute: 'Soy una ruta',
		pointsRoute: '33 áreas',
		observations: 'observaciones de la ruta',
		evidence: 'evidencias',
		durationRoute: '2 hrs 20 min',
		recurrence:"diariamente"
	}
	];

  
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
		const f1= dateToString(new Date(date1)) 
		const f2= dateToString(new Date(date2)) 
		setDatePrimera(f1)
		setDateSegunda(f2)
		// setDates([f1,f2])
	};

	const resetTableFilters = ()=>{
		setDatePrimera("");
		setDateSegunda("");
		setDate1("")
		setDate2("")
		setDateFilter(""); 
		setSelectedTab(selectedTab);
	}


  return (
    <div className="">
      <div className="flex flex-col">
        <div className="p-6  w-full mx-auto">
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
						dateFilter== "today" && selectedTab === 'Ejecuciones' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
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
						<span className="text-md">Ejecuciones</span>
					</div>

                    <div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						dateFilter== "today" && selectedTab === 'Incidentes' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
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
						<span className="text-md">Incidentes</span>
					</div>


                    <div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						dateFilter== "today" && selectedTab === 'Tareas' &&  selectedOption[0]=="entrada" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
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
						<span className="text-md">Tareas</span>
					</div>


				</div>
			</div>
          <div className="">
            <Tabs defaultValue="Bitacora" className="w-full">
              <TabsContent value="Bitacora">
                <div className="flex">
                  <div className="w-1/4">
                    <div className="space-y-1">
                      <GuardiasRondinesTable setSelectedRondin={setSelectedRondin} rest={()=>{setSelectedRondin(null); setSelectedTab("Rondines");}}/>
                    </div>
                  </div>

                  <div className="w-3/4">
                    <RondinesCalendar />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="Incidencias">
                <div className="flex">
                  <div className="">
                    <div className="space-y-1">
                      <GuardiasRondinesTable setSelectedRondin={setSelectedRondin} rest={()=>{setSelectedRondin(null); setSelectedTab("Rondines");}}/>
                    </div>
                  </div>

                  <div className="w-3/4 px-4">
                    <RondinesCalendar />
                  </div>
                </div>
              </TabsContent>


              <TabsContent value="Fotos">
                <div >
                  	<RondinesTable data={data} isLoading={false} setSelectedRondin={setSelectedRondin} selectedRondin={selectedRondin}
						setDate1={setDate1} setDate2={setDate2} date1={date1} date2={date2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} setActiveTab={setActiveTab} activeTab={""}/>
                </div>
              </TabsContent>

              <TabsContent value="Rondines">
                <div >
					<RondinesTable data={data} isLoading={false} setSelectedRondin={setSelectedRondin} selectedRondin={selectedRondin}
						setDate1={setDate1} setDate2={setDate2} date1={date1} date2={date2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} setActiveTab={setActiveTab} activeTab={""}/>
                </div>
              </TabsContent>

              <TabsContent value="Calendario">
                <div >
					<RondinesTable data={data} isLoading={false} setSelectedRondin={setSelectedRondin} selectedRondin={selectedRondin}
						setDate1={setDate1} setDate2={setDate2} date1={date1} date2={date2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} setActiveTab={setActiveTab} activeTab={""}/>
                </div>
              </TabsContent>

              <TabsContent value="Incidencias">
                <div >
					<RondinesTable data={data} isLoading={false} setSelectedRondin={setSelectedRondin} selectedRondin={selectedRondin}
						setDate1={setDate1} setDate2={setDate2} date1={date1} date2={date2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} setActiveTab={setActiveTab} activeTab={""}/>
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
