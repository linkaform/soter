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
import { useFallas } from "@/hooks/useFallas";

interface AddFallaModalProps {
  	title: string;
    arrayFolios:any[];
	children: React.ReactNode;
}

export const EliminarFallaModal: React.FC<AddFallaModalProps> = ({
  	title,
	arrayFolios,
	children
}) => {
	const { eliminarFallaMutation, isLoading} = useFallas("","", "abierto", false, "", "", "")

	const [isSuccess, setIsSuccess] =useState(false)

	useEffect(()=>{
		if(!isLoading){
			handleClose()			
		}
	},[isLoading])
	
	const handleClose = () => {
		setIsSuccess(false); 
	};

    const deleteFallas = ()=>{
		if(arrayFolios.length>0){
			const foliosArray = arrayFolios.map(item => item.folio);
			eliminarFallaMutation.mutate({folio:foliosArray})
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
			{arrayFolios.length==1 ?(<p className="text-2xl font-bold"> ¿Seguro que quieres eliminar esta falla?</p>):(
               <p className="text-2xl font-bold"> ¿Seguro que quieres eliminar las fallas seleccionadas?</p>)}
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
					{arrayFolios.length==1 ?("Eliminar falla seleccionada"):("Eliminar fallas seleccionadas")}
					</>) :(<> <Loader2 className="animate-spin"/> {arrayFolios.length==1 ?("Eliminando falla seleccionada"):("Eliminando fallas seleccionadas")} </>)}
				</Button>
			</div>
        
      </DialogContent>
    </Dialog>
  );
};
