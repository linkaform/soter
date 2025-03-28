import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { useEffect, useState } from "react";
import {Vehiculo } from "@/lib/update-pass";
import VehicleList from "../vehicle-list";
import { useUpdateBitacora } from "@/hooks/useUpdateBitacora";
import { Vehiculo_bitacora } from "../table/bitacoras/bitacoras-columns";
import { formatVehiculosToBitacora } from "@/lib/utils";
import { Car, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddVehicleModalProps {
	title: string;
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
			toast.success("¡Vehiculos actualizados correctamente!");
		}
	},[responseUpdateBitacora, refetchTable])

	const handleClose = () => {
		setIsOpen(false); 
	};
	const handleOpenModal = async () => {
		setIsOpen(true); 
	}

	return (
		<Dialog open={isOpen}  modal>
			<div className="cursor-pointer" onClick={handleOpenModal}>
				<Car />
			</div>
			<DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] flex flex-col" aria-describedby="">
			<DialogHeader className="flex-shrink-0">
			<DialogTitle className="text-2xl text-center font-bold">
				{title}
			</DialogTitle>
			</DialogHeader>

				<div className="overflow-y-auto">
					<VehicleList
						vehicles={vehiculos}
						setVehicles={setVehiculos} account_id={account_id}/>
					<p className="text-red-500" hidden={!showError}> Agrega almenos un elemento para actualizar. </p>
				</div>
				
		 
				<div className="flex gap-5">
					<DialogClose asChild>
						<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
							Cancelar
						</Button>
					</DialogClose>
					
					<Button className="w-full  bg-blue-500 hover:bg-blue-600 text-white"
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
