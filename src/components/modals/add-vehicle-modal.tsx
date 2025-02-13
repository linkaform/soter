import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import {Vehiculo } from "@/lib/update-pass";
import VehicleList from "../vehicle-list";
import { useUpdateBitacora } from "@/hooks/useUpdateBitacora";
import { Vehiculo_bitacora } from "../table/bitacoras/bitacoras-columns";
import { formatVehiculosToBitacora, sweetAlert } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface AddVehicleModalProps {
	title: string;
	children: React.ReactNode;
	id:string;
	refetchTable:()=>void;
}

type params= {
		vehiculo: Vehiculo_bitacora[], 
		equipo:null,
		id:string
		
	}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
	title,
	children,
	id,
	refetchTable
}) => {
	const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
	const [dataFetch, setDataFetch] = useState<params| null>(null);
	const [showError, setShowError] = useState(false);
	const { data:responseUpdateBitacora, isLoading:loadingUpdateBitacora, refetch: refetch } = useUpdateBitacora(dataFetch?.vehiculo ?? null, dataFetch?.equipo ?? null, id);
	const [isOpen, setIsOpen] = useState(false);
	const account_id = parseInt(localStorage.getItem("userId_soter") || "0", 10);
		 
	function onSubmit() {
		const fv= formatVehiculosToBitacora(vehiculos)
		if(fv.length>0){
			setShowError(false)
			setDataFetch({vehiculo: fv, equipo:null, id:id})
		}else{
			setShowError(true)
		}
	}
 
	useEffect(()=>{
		if(dataFetch){
			refetch()
		}
	},[dataFetch,refetch])

	useEffect(()=>{
		if(responseUpdateBitacora?.status_code==202){
			setIsOpen(false)
			refetchTable()
			sweetAlert("success", "Confirmación", "Vehiculo asignado correctamente.")
			// toast.success("¡Vehiculos actualizados correctamente!");
		}
	},[responseUpdateBitacora, refetchTable])

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className="max-w-3xl">
				<DialogHeader>
					<DialogTitle className="text-2xl text-center  font-bold my-5">
						{title}
					</DialogTitle>
				</DialogHeader>

				<VehicleList
					vehicles={vehiculos}
					setVehicles={setVehiculos} account_id={account_id}
				/>
					<p className="text-red-500" hidden={!showError}> Agrega almenos un elemento para actualizar. </p>
		 
				<div className="flex gap-5">
					<DialogClose asChild>
						<Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
							Cancelar
						</Button>
					</DialogClose>
					
					<Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white"
					onClick={onSubmit}
					disabled={loadingUpdateBitacora}
					>
						{ !loadingUpdateBitacora ? (<>
									{("Actualizar vehículos")}
								</>) :(<> <Loader2 className="animate-spin"/> {"Actualizando vehículos..."} </>)}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
