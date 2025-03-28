import React, { Dispatch, SetStateAction} from "react";
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

interface InputChangeLocation {
	ubicacionSeleccionada: string;
	setUbicacionSeleccionada: Dispatch<SetStateAction<string>>;
	areaSeleccionada: string
	setAreaSeleccionada: Dispatch<SetStateAction<string>>;
	all:boolean;
	setAll:Dispatch<SetStateAction<boolean>>;
}

const ChangeLocation:React.FC<InputChangeLocation> = ({ ubicacionSeleccionada, setUbicacionSeleccionada, areaSeleccionada, setAreaSeleccionada, all, setAll })=> {
	const { dataAreas, dataLocations} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true, ubicacionSeleccionada?true:false);
	
	const handleCheckboxChange = () => {
		setAll(!all);
	};

return (
    <div className="flex w-full gap-2">
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
		<Select defaultValue={areaSeleccionada} disabled={all}
		onValueChange={(value:string) => {
			setAreaSeleccionada(value); 
		}}>
			<SelectTrigger>
				<SelectValue placeholder="Caseta" />
			</SelectTrigger>
			<SelectContent>
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

		<div className="flex items-center gap-2">
			<Checkbox id="terms" defaultChecked={all} onCheckedChange={handleCheckboxChange} />
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