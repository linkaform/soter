/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEliminarIncidencia } from "@/hooks/Incidencias/useEliminarIncidencias";
import { useShiftStore } from "@/store/useShiftStore";

interface AddFallaModalProps {
  	title: string;
    arrayFolios:any[];
	setModalEliminarAbierto:Dispatch<SetStateAction<boolean>>; 
	modalEliminarAbierto:boolean;
}

export const EliminarIncidenciaModal: React.FC<AddFallaModalProps> = ({
  	title,
	arrayFolios,
	setModalEliminarAbierto,
	modalEliminarAbierto
}) => {
	const { isLoading } = useShiftStore();
	const eliminarIncidenciaMutation = useEliminarIncidencia();

	const handleClose = () => {
		setModalEliminarAbierto(false); 
	};

    const deleteFallas = ()=>{
		if(arrayFolios.length>0){
			let foliosArray=[]
			if (Array.isArray(arrayFolios) && arrayFolios.every(item => typeof item === "string")) {
				foliosArray = arrayFolios.map(item => item);
			  } else {
				foliosArray = arrayFolios.map(item => item.folio);
			  }

			eliminarIncidenciaMutation.mutate({folio : foliosArray},{
				onSuccess: () => {
					handleClose(); 
				  },
				onError: () => {
					handleClose(); 
				  },
			})
		}else{
			toast.error("Selecciona una incidencia para poder eliminarla...")
		}
    }

  return (
    <Dialog onOpenChange={setModalEliminarAbierto} open={modalEliminarAbierto} modal>
      <DialogContent className="max-w-3xl" aria-describedby="">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

            <div className="my-3 flex flex-col items-center">
            {arrayFolios.length==1 ?(<p className="text-2xl font-bold"> ¿Seguro que quieres eliminar esta incidencia?</p>):(
               <p className="text-2xl font-bold"> ¿Seguro que quieres eliminar las incidencias seleccionadas?</p>)}
                
                <small>Esta acción no se puede revertir.</small>
            </div>

			<div className="flex gap-2">
				<DialogClose asChild>
					<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
					Cancelar
					</Button>
				</DialogClose>

				
				<Button
                    onClick={deleteFallas}
					className="w-full  bg-blue-500 hover:bg-blue-600 text-white " disabled={isLoading}
				>
					{ !isLoading ? (<>
					{arrayFolios.length==1 ?("Eliminar incidencia seleccionada"):("Eliminar incidencias seleccionadas")}
					</>) :(<> <Loader2 className="animate-spin"/> {arrayFolios.length==1 ?("Eliminando incidencia seleccionada"):("Eliminando incidencias seleccionadas")} </>)}
				</Button>
			</div>
        
      </DialogContent>
    </Dialog>
  );
};
