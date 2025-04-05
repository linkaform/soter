import React, { Dispatch, SetStateAction} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
// import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";

interface InputChangeLocation {
	ubicacionSeleccionada: string;
	setUbicacionSeleccionada: Dispatch<SetStateAction<string>>;
	areaSeleccionada: string
	setAreaSeleccionada: Dispatch<SetStateAction<string>>;
}

const ChangeLocation:React.FC<InputChangeLocation> = ({ ubicacionSeleccionada, setUbicacionSeleccionada, areaSeleccionada, setAreaSeleccionada })=> {
	const { dataAreas, dataLocations} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true, ubicacionSeleccionada?true:false);

	return (
    <div className="flex flex-col w-full gap-2">
		<Select defaultValue={ubicacionSeleccionada} 
		onValueChange={(value:string) => {
			setUbicacionSeleccionada(value); 
		}}
		>
			<SelectTrigger>
				<SelectValue placeholder="Ubicación" />
			</SelectTrigger>
			<SelectContent>
			{dataLocations?.map((vehiculo:string, index:number) => (
				<SelectItem key={index} value={vehiculo}>
					{vehiculo}
				</SelectItem>
			))}
			</SelectContent>
		</Select>
		<Select defaultValue={areaSeleccionada}
		onValueChange={(value:string) => {
			setAreaSeleccionada(value); 
		}}>
			<SelectTrigger>
				<SelectValue placeholder="Caseta" />
			</SelectTrigger>
			<SelectContent>
			<SelectItem key={"todas"} value={"todas"}> Todas las Casetas </SelectItem>
			{dataAreas?.length >0 ? (
				<>
				{dataAreas?.map((area:string, index:number) => {
				return(
					<SelectItem key={index} value={area}>
					{area}
					</SelectItem>
				)})} 
				</>
			):<SelectItem key={"1"} value={"1"} disabled>No hay opciones disponibles.</SelectItem>}
			</SelectContent>
		</Select>
    </div>
  );
};

export default ChangeLocation;