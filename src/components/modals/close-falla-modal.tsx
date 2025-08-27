/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useFallas } from "@/hooks/Fallas/useFallas";

interface AddFallaModalProps {
  	title: string;
    folio:string;
	setModalCerrarAbierto:Dispatch<SetStateAction<boolean>>; 
	modalCerrarAbierto:boolean;
}

export const CerrarFallaModal: React.FC<AddFallaModalProps> = ({
  	title,
	folio,
	setModalCerrarAbierto,
	modalCerrarAbierto
}) => {
	// const { isLoading } = useShiftStore();
	const { editarFallaMutation, isLoading} = useFallas("","", "abierto", false, "", "", "")

	const handleClose = () => {
		setModalCerrarAbierto(false); 
	};

	const deleteFallas = ()=>{
		if(folio){
			editarFallaMutation.mutate({data_failure_update:{falla_estatus:"resuelto"}, folio:folio},{
				onSuccess: () => {
					handleClose(); 
				  },
				onError: () => {
					handleClose(); 
				}
			})
		}else{
			toast.error("Selecciona una falla para poder cerrarla...")
		}
    }

  return (
    <Dialog onOpenChange={setModalCerrarAbierto} open={modalCerrarAbierto} modal>
      <DialogContent className="max-w-3xl" aria-describedby=""  onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

            <div className="my-3 flex flex-col items-center">
			<p className="text-2xl font-bold"> ¿Seguro que quieres cerrar esta falla?</p>
			<p>Esta accion no se puede revertir.</p>
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
					{"Cerrar falla seleccionada"}
					</>) :(<> <Loader2 className="animate-spin"/> {"Cerrando falla seleccionada"} </>)}
				</Button>
			</div>
        
      </DialogContent>
    </Dialog>
  );
};
