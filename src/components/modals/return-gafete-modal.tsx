import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Dispatch, SetStateAction } from "react";
import { Loader2 } from "lucide-react";
import { useAsignarGafete } from "@/hooks/useAsignarGafete";

interface AddBadgeModalProps {
  title: string;
  id_bitacora:string;
  ubicacion:string;
  area:string;
  fecha_salida:string;
  gafete:string;
  locker:string;
  tipo_movimiento:string;
  setModalRegresarGafeteAbierto:Dispatch<SetStateAction<boolean>>; 
	modalRegresarGafeteAbierto:boolean;
}

export const ReturnGafeteModal: React.FC<AddBadgeModalProps> = ({
  title,
  area,
  id_bitacora,
  ubicacion,
  gafete,
  locker,
  tipo_movimiento,
  setModalRegresarGafeteAbierto,
  modalRegresarGafeteAbierto
}) => {
    const { asignarGafeteMutation, isLoading } = useAsignarGafete( );
    function onSubmit() {
		asignarGafeteMutation.mutate({data_gafete: {locker_id:locker, gafete_id:gafete, documento:"", status_gafete:"entregado" , ubicacion:ubicacion, area:area}, id_bitacora, tipo_movimiento})
    }

  return (
    <Dialog open={modalRegresarGafeteAbierto} onOpenChange={setModalRegresarGafeteAbierto} modal>
      {/* <DialogTrigger asChild>{children}</DialogTrigger> */}

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>
            <div className="flex flex-col justify-center items-center gap-2">
                <p className="text-xl font-bold">¿Estás seguro de querer recibir el gafete?</p> 
                <p>Esta accion no se puede revertir.</p>           
            </div>
            <div className="flex gap-5">
              <DialogClose asChild>
                <Button
                  className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancelar
                </Button>
              </DialogClose>

              <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white" onClick={onSubmit} disabled={isLoading}>
              { !isLoading ? (<>
              {("Confirmar")}
            </>) :(<> <Loader2 className="animate-spin"/> {"Cargando..."} </>)}
              </Button>
            </div>
      
      </DialogContent>        
    </Dialog>
  );
};
