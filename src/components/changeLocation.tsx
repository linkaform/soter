/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAreasLocationStore } from "@/store/useGetAreaLocationByUser";

interface InputChangeLocation {
	ubicacionSeleccionada: string;
	setUbicacionSeleccionada: (location: string) => void;
	areaSeleccionada: string
	setAreaSeleccionada:(area: string) => void;
	ubicacion?:string
}

const ChangeLocation:React.FC<InputChangeLocation> = ({ ubicacionSeleccionada, setUbicacionSeleccionada, areaSeleccionada, setAreaSeleccionada, ubicacion })=> {

	const {areas, locations, fetchAreas, fetchLocations} = useAreasLocationStore();
	// const {location, area} = useShiftStore();
	//   console.log("objects",ubicacionSeleccionada, areaSeleccionada, locations, areas)

	// useEffect(()=>{
	// 	if(!location || !area){
	// 		fetchLocations();
	// 	}
	// },[])

	  useEffect(() => {
		if(!locations){
			fetchLocations();
			if (ubicacionSeleccionada) {
				fetchAreas(ubicacionSeleccionada);
			  }
		}
	  }, [ubicacionSeleccionada]);

	return (
    <div className="flex flex-col w-full gap-2">
		<Select defaultValue={ubicacionSeleccionada}  disabled={ubicacion=="accesos"}
		onValueChange={(value:string) => {
			setUbicacionSeleccionada(value); 
		}}
		>
			<SelectTrigger>
				<SelectValue placeholder="Ubicación" />
			</SelectTrigger>
			<SelectContent>
			{locations?.map((vehiculo:string, index:number) => (
				<SelectItem key={index} value={vehiculo}>
					{vehiculo}
				</SelectItem>
			))}
			</SelectContent>
		</Select>
		<Select defaultValue={areaSeleccionada}  disabled={ubicacion=="accesos"}
		onValueChange={(value:string) => {
			setAreaSeleccionada(value); 
		}}>
			<SelectTrigger>
				<SelectValue placeholder="Caseta" />
			</SelectTrigger>
			<SelectContent>
			<SelectItem key={"todas"} value={"todas"}> Todas las Casetas </SelectItem>
			{areas?.length >0 ? (
				<>
				{areas?.map((area:string, index:number) => {
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