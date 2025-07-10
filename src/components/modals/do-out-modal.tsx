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
import { useDoOut } from "@/hooks/Bitacora/useDoOut";
import { useShiftStore } from "@/store/useShiftStore";

interface AddBadgeModalProps {
  title: string;
  id_bitacora:string;
  ubicacion:string;
  area:string;
  fecha_salida:string;
  setModalSalidaAbierto:Dispatch<SetStateAction<boolean>>; 
	modalSalidaAbierto:boolean;
}

export const DoOutModal: React.FC<AddBadgeModalProps> = ({
  title,
  area,
  id_bitacora,
  ubicacion,
  modalSalidaAbierto,
  setModalSalidaAbierto
}) => {
  const doOutMutation = useDoOut();
  const { isLoading } = useShiftStore()

  function onSubmit() {
    doOutMutation.mutate({
      qr_code:id_bitacora,location:ubicacion, area
    }, {
      onSuccess: () => {
        setModalSalidaAbierto(false)
      },
      onError: () => {
        setModalSalidaAbierto(false)
      }},)
  }

  return (
    <Dialog open={modalSalidaAbierto} onOpenChange={setModalSalidaAbierto} modal>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>
            <div className="flex flex-col justify-center items-center gap-2">
                <p className="text-xl font-bold">¿Estás seguro de querer registrar la salida?</p> 
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
