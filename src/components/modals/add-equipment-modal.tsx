import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

import EquipoList from "../equipo-list";
import { useEffect, useState } from "react";
import { Equipo } from "@/lib/update-pass";
import { Loader2 } from "lucide-react";
import { useUpdateBitacora } from "@/hooks/useUpdateBitacora";
import { formatEquiposToBitacora, sweetAlert } from "@/lib/utils";
import { Equipo_bitacora } from "../table/bitacoras/bitacoras-columns";

interface AddEquipmentModalProps {
	title: string;
	children: React.ReactNode;
	id:string;
	refetchTable:()=>void;

}
type params= {
	vehiculo:null, 
	equipo:Equipo_bitacora[]|null,
	id:string
}

export const AddEquipmentModal: React.FC<AddEquipmentModalProps> = ({
	title,
	children,
	id,
	refetchTable
}) => {
	const [equipos, setEquipos] = useState<Equipo[]>([]);
	const [dataFetch, setDataFetch] = useState<params| null>(null);
	const [showError, setShowError] = useState(false);
	const { data:responseUpdateBitacora, isLoading:loadingUpdateBitacora, refetch } = useUpdateBitacora(dataFetch?.vehiculo ?? null, dataFetch?.equipo ?? null, id);
	const [isOpen, setIsOpen] = useState(false);

	function onSubmit() {
		const ef= formatEquiposToBitacora(equipos)
		if(ef.length>0){
			setShowError(false)
			setDataFetch({vehiculo: null, equipo:ef, id:id})
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
			sweetAlert("success", "Confirmación", "Equipo asignado correctamente.")
			// toast.success("¡Equipos actualizados correctamente!");
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
					<EquipoList
					equipos={equipos}
					setEquipos={setEquipos} />
				<p className="text-red-500" hidden={!showError}> Agrega almenos un elemento para actualizar. </p>
					<div className="flex gap-5">
						<DialogClose asChild>
							<Button
								className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700"
							>
								Cancelar
							</Button>
						</DialogClose>

						<Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white"
						onClick={onSubmit}
						disabled={loadingUpdateBitacora}
						>
							{ !loadingUpdateBitacora ? (<>
								{("Actualizar equipos")}
							</>) :(<> <Loader2 className="animate-spin"/> {"Actualizando equipos..."} </>)}
						</Button>
					</div>
		</DialogContent>
	</Dialog>
);
};
