"use client";

import React, { useEffect, useState } from "react";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LockerTable } from "@/components/table/bitacoras/locker/table";
import PageTitle from "@/components/page-title";
import BitacorasTable from "@/components/table/bitacoras/table";
import { Home, Users, Car, DoorClosed, Computer } from "lucide-react";
// import { useGetStats } from "@/hooks/useGetStats";
import { useShiftStore } from "@/store/useShiftStore";
import VehiculosTable from "@/components/table/bitacoras/vehiculos/table";
import EquiposTable from "@/components/table/bitacoras/equipos/table";
import ChangeLocation from "@/components/changeLocation";
import { Comentarios_bitacoras, VisitaA } from "@/components/table/bitacoras/equipos/equipos-columns";
import { Bitacora_record } from "@/components/table/bitacoras/bitacoras-columns";
import { dateToString } from "@/lib/utils";
import { useBitacoras } from "@/hooks/useBitacoras";
import { toast } from "sonner";

const BitacorasPage = () => {
  	const [selectedOption, setSelectedOption] = useState<string[]>([]);
  	const {location} = useShiftStore()
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location);
	const [areaSeleccionada, setAreaSeleccionada] = useState("todas");
	const [equiposData, setEquiposData] = useState<Bitacora_record[]>([]);
	const [vehiculosData, setVehiculosData] = useState<Bitacora_record[]>([]);

	const [date1, setDate1] = useState<Date|"">("")
	const [date2, setDate2] = useState<Date|"">("")

	const [dates, setDates] = useState<string[]>([])
	const [dateFilter, setDateFilter] = useState<string>("")
	const { listBitacoras,isLoadingListBitacoras, stats} = useBitacoras(ubicacionSeleccionada, areaSeleccionada == "todas" ? "": areaSeleccionada, selectedOption, true , dates[0], dates[1], dateFilter)
	const [selectedTab, setSelectedTab] = useState<string>('Personal'); 

	const processBitacorasE = (bitacoras: any[]) => {
        return bitacoras?.flatMap(bitacora => {
            if (!bitacora.equipos || !Array.isArray(bitacora.equipos) || bitacora.equipos.length === 0) {
                return [];  
            }
            const hasValidVehicle = bitacora.equipos.some((eq: any) => {
                return eq.tipo_equipo && eq.tipo_equipo.trim() !== ''; 
            });
        
            if (!hasValidVehicle) {
                return [];
            }
			
            return bitacora.equipos.map((eq: any) => {
				return {
					...bitacora,         
					equipos: [eq],
					formated_visita: bitacora.visita_a.map((item: VisitaA) => item.nombre).join(', '),
					formated_comentarios: bitacora.comentarios.map((item: Comentarios_bitacoras) => item.comentario).join(', '),
				};
            });
        });
    };

	const processBitacorasV = (bitacoras: any[]) => {
        return bitacoras?.flatMap(bitacora => {
            if (!bitacora.vehiculos || !Array.isArray(bitacora.vehiculos) || bitacora.vehiculos.length === 0) {
                return [];  
            }
            const hasValidVehicle = bitacora.vehiculos.some((eq: any) => {
                return eq.tipo && eq.tipo.trim() !== ''; 
            });
        
            if (!hasValidVehicle) {
                return [];
            }
			
            return bitacora.vehiculos.map((eq: any) => {
				return {
					...bitacora,         
					vehiculos: [eq],
					formated_visita: bitacora.visita_a.map((item: VisitaA) => item.nombre).join(', '),
					formated_comentarios: bitacora.comentarios.map((item: Comentarios_bitacoras) => item.comentario).join(', '),
				};
            });
        });
    };


	useEffect(()=>{
		if(ubicacionSeleccionada=="todas"){
			setSelectedOption([])
		}
	},[ubicacionSeleccionada])
	
	useEffect(()=>{
		if(listBitacoras){
			setEquiposData(processBitacorasE(listBitacoras))
			setVehiculosData(processBitacorasV(listBitacoras))
		}
	}, [listBitacoras])

	const handleTabChange = (tab:string, option:string[], dateFilter="") => {
		if(tab == selectedTab){
			if(option[0] == selectedOption[0]){
				setSelectedOption([]);
				setSelectedTab("Personal")  
				setDateFilter( dateFilter=="today"? dateFilter:"")
			}else{
				setSelectedOption(option)
				setSelectedTab(tab)  
			}
		}else{
			setDateFilter( dateFilter=="today"? dateFilter:"")
			setSelectedOption(option); 
			setSelectedTab(tab)
		}
	};

	const handleTabChangeE = (newTab: any) => {
		setSelectedTab(newTab); 
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


return (
    <div className="">
		<div className="p-6 space-y-1 pt-3 w-full mx-auto ">

			<div className="flex justify-between">
				<div>
					<PageTitle title="Registro de Entradas y Salidas" />	
				</div>
				<div className="flex items-center gap-5">
					<div>
						<ChangeLocation
							ubicacionSeleccionada={ubicacionSeleccionada}
							areaSeleccionada={areaSeleccionada}
							setUbicacionSeleccionada={setUbicacionSeleccionada}
							setAreaSeleccionada={setAreaSeleccionada}
						/>
					</div>

					<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						dateFilter== "today" && selectedTab === 'Personal' &&  selectedOption.length==0 ? 'bg-blue-100' : 'hover:bg-gray-100'}`} 
						onClick={() => {handleTabChange("Personal",[], "today");}}>
						<div className="flex gap-6">
							<Home className="text-primary w-10 h-10" />
							<span className="flex items-center font-bold text-4xl">
							{stats?.visitas_en_dia}
							</span>
						</div>
						<div className="flex items-center space-x-0">
							<div className="h-1 w-1/2 bg-cyan-100"></div>
							<div className="h-1 w-1/2 bg-blue-500"></div>
						</div>
						<span className="text-md">Visitas en el día</span>
					</div>

					<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						selectedOption[0] === 'entrada'&& dateFilter !== "today" ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => {handleTabChange("Personal",["entrada"], "this_month");}}>
						<div className="flex gap-6">
							<Users className="text-primary w-10 h-10" />
							<span className="flex items-center font-bold text-4xl">
							{stats?.personal_dentro}
							</span>
						</div>
						<div className="flex items-center space-x-0">
							<div className="h-1 w-1/2 bg-cyan-100"></div>
							<div className="h-1 w-1/2 bg-blue-500"></div>
						</div>
						<span className="text-md">Personal dentro</span>
					</div>

					<div  className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						selectedTab === 'Vehiculos' ? 'bg-blue-100' : 'hover:bg-gray-100'
						}`} 
						onClick={() => handleTabChange("Vehiculos", [])}>
						<div className="flex gap-6">
							<Car className="text-primary w-10 h-10" />
							<span className="flex items-center font-bold text-4xl">
							{stats?.total_vehiculos_dentro}
							</span>
						</div>
						<div className="flex items-center space-x-0">
							<div className="h-1 w-1/2 bg-cyan-100"></div>
							<div className="h-1 w-1/2 bg-blue-500"></div>
						</div>
						<span className="text-md">Vehículos Dentro</span>
					</div>

					<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						selectedTab === 'Equipos' ? 'bg-blue-100' : 'hover:bg-gray-100'
						}`} 
						onClick={() => handleTabChange("Equipos",[])} >
						<div className="flex gap-6">
							<Computer className="text-primary w-10 h-10" />
							<span className="flex items-center font-bold text-4xl">
							{stats?.total_equipos_dentro}
							</span>
						</div>
						<div className="flex items-center space-x-0">
							<div className="h-1 w-1/2 bg-cyan-100"></div>
							<div className="h-1 w-1/2 bg-blue-500"></div>
						</div>
						<span className="text-md">Equipos Dentro</span>
					</div>

					<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
						selectedOption[0] === 'salida' ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => handleTabChange("Personal", ["salida"])}>
						<div className="flex gap-6">
							<DoorClosed className="text-primary w-10 h-10" />
							<span className="flex items-center font-bold text-4xl">
							{stats?.salidas_registradas}
							</span>
						</div>
						<div className="flex items-center space-x-0">
							<div className="h-1 w-1/2 bg-cyan-100"></div>
							<div className="h-1 w-1/2 bg-blue-500"></div>
						</div>
						<span className="text-md">Salidas registradas</span>
					</div>
				</div>
			</div> 

			<Tabs defaultValue="Personal" className="w-full"  value={selectedTab}  onValueChange={handleTabChangeE}>
				<TabsContent value="Personal">
				<div className="">
					<BitacorasTable data={listBitacoras} isLoading={isLoadingListBitacoras} 
					date1={date1} date2={date2} setDate1={setDate1} setDate2={setDate2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter}
					/>
				</div>
				</TabsContent>

				<TabsContent value="Vehiculos">
				<div className="">
					<VehiculosTable data={vehiculosData} isLoading={isLoadingListBitacoras}
					date1={date1} date2={date2} setDate1={setDate1} setDate2={setDate2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter}
					/>
				</div>
				</TabsContent>

				<TabsContent value="Equipos">
				<div className="">
					<EquiposTable data={equiposData}  isLoading={isLoadingListBitacoras}
					date1={date1} date2={date2} setDate1={setDate1} setDate2={setDate2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter}
					/>
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
  );
};

export default BitacorasPage;
