"use client";

import React, { useState } from "react";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LockerTable } from "@/components/table/bitacoras/locker/table";
import PageTitle from "@/components/page-title";
import { useGetListBitacora } from "@/hooks/useGetListBitacora";
import BitacorasTable from "@/components/table/bitacoras/table";
import { Home, Users, Car, DoorClosed, Computer } from "lucide-react";
import { useGetStats } from "@/hooks/useGetStats";
import { useShiftStore } from "@/store/useShiftStore";
import VehiculosTable from "@/components/table/bitacoras/vehiculos/table";
import EquiposTable from "@/components/table/bitacoras/equipos/table";
import ChangeLocation from "@/components/changeLocation";

const BitacorasPage = () => {
  	const [selectedOption, setSelectedOption] = useState<string[]>([]);
  	const {location, area} = useShiftStore()
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location);
	const [areaSeleccionada, setAreaSeleccionada] = useState(area);

  	const { data: dataStats} = useGetStats(ubicacionSeleccionada, areaSeleccionada, "Bitacoras");
  	const { data,isLoading} = useGetListBitacora(ubicacionSeleccionada, areaSeleccionada, selectedOption, ubicacionSeleccionada&& areaSeleccionada? true:false );


	const [selectedTab, setSelectedTab] = useState<string>('Personal'); 



	const handleTabChange = (tab:string, option:string[]) => {
		console.log("TAB", tab, selectedTab)

		if(tab == selectedTab){
			if(option[0] == selectedOption[0]){
				setSelectedOption([]); 
			}else{
				setSelectedOption(option)
			}
			setSelectedTab("Personal")
		}else{
			setSelectedOption(option); 
			setSelectedTab(tab)
		}
		
	};

	const handleTabChangeE = (newTab: any) => {
		setSelectedTab(newTab); 
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
				
				<div className={`border px-12 py-1 rounded-md`}>
					<div className="flex gap-6">
						<Home className="text-primary w-10 h-10" />
						<span className="flex items-center font-bold text-4xl">
						{dataStats?.visitas_en_dia}
						</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Visitas en el día</span>
				</div>

				<div  className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
					selectedTab === 'Vehiculos' ? 'bg-blue-100' : 'hover:bg-gray-100'
					}`} 
					onClick={() => handleTabChange("Vehiculos", [])}>
					<div className="flex gap-6">
						<Car className="text-primary w-10 h-10" />
						<span className="flex items-center font-bold text-4xl">
						{dataStats?.total_vehiculos_dentro}
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
						{dataStats?.total_equipos_dentro}
						</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Equipos Dentro</span>
				</div>
				


				<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
					selectedOption[0] === 'entrada' ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => handleTabChange("Personal",["entrada"])}>
					<div className="flex gap-6">
						<Users className="text-primary w-10 h-10" />
						<span className="flex items-center font-bold text-4xl">
						{dataStats?.personal_dentro}
						</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Personal dentro</span>
				</div>

				<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100 ${
					selectedOption[0] === 'salida' ? 'bg-blue-100' : 'hover:bg-gray-100'}`} onClick={() => handleTabChange("Personal", ["salida"])}>
					<div className="flex gap-6">
						<DoorClosed className="text-primary w-10 h-10" />
						<span className="flex items-center font-bold text-4xl">
						{dataStats?.salidas_registradas}
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
					<BitacorasTable data={data} isLoading={isLoading}
					/>
				</div>
				</TabsContent>

				<TabsContent value="Vehiculos">
				<div className="">
					<VehiculosTable data={data} isLoading={isLoading}
					/>
				</div>
				</TabsContent>

				<TabsContent value="Equipos">
				<div className="">
					<EquiposTable data={data}  isLoading={isLoading}
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
