"use client";

import React, { useEffect, useState } from "react";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { LockerTable } from "@/components/table/bitacoras/locker/table";
import PageTitle from "@/components/page-title";
import { useGetListBitacora } from "@/hooks/useGetListBitacora";
import BitacorasTable from "@/components/table/bitacoras/table";
import { Home, Users, Car, DoorClosed } from "lucide-react";
import { useGetStats } from "@/hooks/useGetStats";
import { useShiftStore } from "@/store/useShiftStore";

const BitacorasPage = () => {
  	const [selectedOption, setSelectedOption] = useState<string[]>([]);
  	const { data: dataStats} = useGetStats("", "", "Bitacoras");
  	const { data,isLoading, refetch} = useGetListBitacora("", "",selectedOption);

  	const {location, area} = useShiftStore()
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location);
	const [areaSeleccionada, setAreaSeleccionada] = useState(area)
	const [all, setAll] = useState(false)

  useEffect(()=>{
    if(selectedOption){
      refetch()
    }
  },[selectedOption, refetch])
  
return (
    <div className="">
		<div className="p-6 space-y-1 pt-3 w-full mx-auto ">

		<div className="flex justify-between">
			<div>
				<PageTitle title="Registro de Entradas y Salidas" />	
			</div>
			<div className="flex gap-5">
				<div className="border px-12 py-1 rounded-md">
					<div className="flex gap-6"><Home className="text-primary w-10 h-10" />
						<span className="flex items-center font-bold text-4xl"> {dataStats?.visitas_en_dia}</span>
						
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Visitas en el día</span>
				</div>
				<div className="border p-4 px-12 py-1 rounded-md">
					<div className="flex gap-6"><Users className="text-primary w-10 h-10"/>
						<span className="flex items-center font-bold text-4xl"> {dataStats?.personal_dentro}</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Personal dentro</span>
				</div>
				<div className="border p-4 px-12 py-1 rounded-md">
					<div className="flex gap-6"><Car className="text-primary w-10 h-10"/>
						<span className="flex items-center font-bold text-4xl"> {dataStats?.total_vehiculos_dentro}</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Vehiculos Dentro</span>
				</div>
				<div className="border p-4 px-12 py-1 rounded-md">
					<div className="flex gap-6"><DoorClosed className="text-primary w-10 h-10"/>
						<span className="flex items-center font-bold text-4xl"> {dataStats?.salidas_registradas}</span>
					</div>
					<div className="flex items-center space-x-0">
						<div className="h-1 w-1/2 bg-cyan-100"></div>
						<div className="h-1 w-1/2 bg-blue-500"></div>
					</div>
					<span className="text-md">Salidas registradas</span>
				</div>
			</div>
		</div>
			<Tabs defaultValue="Personal" className="w-full">
				<TabsContent value="Personal">
					
				<div className="">
					<BitacorasTable data={data} refetch={refetch} setSelectedOption={setSelectedOption} isLoading={isLoading}
					ubicacionSeleccionada={ubicacionSeleccionada} areaSeleccionada={areaSeleccionada} setUbicacionSeleccionada={setUbicacionSeleccionada} 
					setAreaSeleccionada={setAreaSeleccionada} setAll={setAll} all={all} 
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
