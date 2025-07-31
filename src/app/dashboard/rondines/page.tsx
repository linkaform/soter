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
import { useGetListRondines } from "@/hooks/Rondines/useGetListRondines";
import GuardiasRondinesTable from "@/components/table/rondines/guardias/table";
import { Gallery } from "@/components/modals/gallery";

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

  const [datePrimera, setDatePrimera] = useState<string>("")
  const [dateSegunda, setDateSegunda] = useState<string>("")
  const [isSuccessRondin] = useState(false);
  const [selectedRondin, setSelectedRondin]= useState<string[]|null>([]);

  const [date1, setDate1] = useState<Date|"">("")
  const [date2, setDate2] = useState<Date|"">("")

  console.log(listRondines ,datePrimera, dateSegunda, isSuccessRondin)

  
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

  const images = [
    {
      file_name: "image1.jpg",
      file_url: "https://via.placeholder.com/150?text=Image+1",
    },
    {
      file_name: "image2.jpg",
      file_url: "https://via.placeholder.com/150?text=Image+2",
    },
    {
      file_name: "image3.jpg",
      file_url: "https://via.placeholder.com/150?text=Image+3",
    },
    {
      file_name: "image4.jpg",
      file_url: "https://via.placeholder.com/150?text=Image+4",
    },
    {
      file_name: "image5.jpg",
      file_url: "https://via.placeholder.com/150?text=Image+5",
    },
    {
      file_name: "image6.jpg",
      file_url: "https://via.placeholder.com/150?text=Image+6",
    },
    {
      file_name: "image7.jpg",
      file_url: "https://via.placeholder.com/150?text=Image+7",
    },
    {
      file_name: "image8.jpg",
      file_url: "https://via.placeholder.com/150?text=Image+8",
    },
  ];

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
          <div className="">
            <Tabs defaultValue="Rondines" className="w-full">
              <TabsContent value="Bitacora">
                <div >
                  <RondinesTable data={listRondines} isLoading={false} setSelectedRondin={setSelectedRondin} selectedRondin={selectedRondin}
                  setDate1={setDate1} setDate2={setDate2} date1={date1} date2={date2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} />
                </div>
              </TabsContent>

              <TabsContent value="Incidencias">
                  <div>
                    <RondinesTable data={listRondines} isLoading={false} setSelectedRondin={setSelectedRondin} selectedRondin={selectedRondin}
                    setDate1={setDate1} setDate2={setDate2} date1={date1} date2={date2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} />
                  </div>
              </TabsContent>

              <TabsContent value="Fotos">
                <div >
                    <Gallery rondin={images}/>
                  	{/* <RondinesTable data={listRondines} isLoading={false} setSelectedRondin={setSelectedRondin} selectedRondin={selectedRondin}
						        setDate1={setDate1} setDate2={setDate2} date1={date1} date2={date2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} /> */}
                </div>
              </TabsContent>

              <TabsContent value="Rondines">
                <div >
                    <RondinesTable data={listRondines} isLoading={false} setSelectedRondin={setSelectedRondin} selectedRondin={selectedRondin}
                    setDate1={setDate1} setDate2={setDate2} date1={date1} date2={date2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} />
                </div>
              </TabsContent>

              <TabsContent value="Calendario">
                <div className="flex">
                  <div className="w-1/4 mr-5">
                    <div className="space-y-1">
                      <GuardiasRondinesTable setSelectedRondin={setSelectedRondin} rest={()=>{setSelectedRondin(null); setSelectedTab("Rondines");}}/>
                    </div>
                  </div>

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
