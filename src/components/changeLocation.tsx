/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";

interface ChangeLocationProps {
    location:string;
    area: string;
	all : boolean
    setAreas: Dispatch<SetStateAction<string[]>>
	setLocations: Dispatch<SetStateAction<string[]>>
	setAll: Dispatch<SetStateAction<boolean>>
}


const ChangeLocation:React.FC<ChangeLocationProps> = ({ location, area, all, setAreas, setLocations,setAll})=> {
    const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string>("");
	const { dataAreas:catAreas, dataLocations:ubicaciones, isLoadingAreas:loadingCatAreas, isLoadingLocations:loadingUbicaciones} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true, ubicacionSeleccionada?true:false);
	
return (
    <div className="flex w-full gap-2">
		<Select defaultValue={""} >
			<SelectTrigger>
				<SelectValue placeholder="Ubicación" />
			</SelectTrigger>
			<SelectContent>
			{ubicaciones?.map((vehiculo:string, index:number) => (
				<SelectItem key={index} value={vehiculo}>
					{vehiculo}
				</SelectItem>
			))}
			</SelectContent>
		</Select>
		<Select defaultValue={""}>
			<SelectTrigger>
				<SelectValue placeholder="Caseta" />
			</SelectTrigger>
			<SelectContent>
			{catAreas?.length >0 ? (
				<>
				{catAreas?.map((area:string, index:number) => {
				return(
					<SelectItem key={index} value={area}>
					{area}
					</SelectItem>
				)})} 
				</>
			):<SelectItem key={"1"} value={"1"} disabled>No hay opciones disponibles.</SelectItem>}
			</SelectContent>
		</Select>

		<div className="flex items-center gap-2">
			<Checkbox id="terms" />
			<Label
				htmlFor="terms"
				className="whitespace-nowrap text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
				Todas las casetas
			</Label>
		</div>
    </div>
  );
};

export default ChangeLocation;