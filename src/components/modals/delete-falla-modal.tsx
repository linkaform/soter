/* eslint-disable react-hooks/exhaustive-deps */
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDeleteFalla } from "@/hooks/useDeleteFallas";

interface AddFallaModalProps {
  	title: string;
    arrayFolios:string[];
	refetchTableFallas: ()=> void;
	children: React.ReactNode;
}

export const EliminarFallaModal: React.FC<AddFallaModalProps> = ({
  	title,
	arrayFolios,
	refetchTableFallas,
	children
}) => {
    console.log("FOLIOSSS",arrayFolios)
    const { data:responseDeleteFallas,isLoading:isLoadingDeleteFallas, refetch:refetchDeleteFallas, error} = useDeleteFalla(arrayFolios);
	const [isSuccess, setIsSuccess] =useState(false)
	useEffect(()=>{
		console.log("QUE PASA", responseDeleteFallas)
		if(responseDeleteFallas?.status_code == 202){
			handleClose()
			refetchTableFallas()
			toast.success("Falla(s) eliminadas correctamente!")
		}
	},[responseDeleteFallas])

	useEffect(()=>{
		if(error){
			toast.error(error.message)
			handleClose()
		}
	
	},[error])

	const handleClose = () => {
		setIsSuccess(false); 
	};

    const deleteFallas = ()=>{
		if(arrayFolios.length>0){
			refetchDeleteFallas()
		}else{
			toast.error("Selecciona una falla para poder eliminarla...")
		}
    }

  return (
    <Dialog onOpenChange={setIsSuccess} open={isSuccess}>
      <DialogTrigger>{children}</DialogTrigger> 

      <DialogContent className="max-w-3xl" aria-describedby="">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

            <div className="my-3 flex flex-col items-center">
                <p className="text-2xl font-bold"> ¿Seguro que quieres eliminar esta falla?</p>
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
					className="w-full  bg-blue-500 hover:bg-blue-600 text-white " disabled={isLoadingDeleteFallas}
				>
					{ !isLoadingDeleteFallas ? (<>
					{arrayFolios.length==1 ?("Eliminar falla seleccionada"):("Eliminar fallas seleccionadas")}
					</>) :(<> <Loader2 className="animate-spin"/> {arrayFolios.length==1 ?("Eliminando falla seleccionada"):("Eliminando fallas seleccionadas")} </>)}
				</Button>
			</div>
        
      </DialogContent>
    </Dialog>
  );
};
