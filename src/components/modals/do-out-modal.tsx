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
import { Loader2 } from "lucide-react";
import { errorAlert, sweetAlert } from "@/lib/utils";
import { useDoOut } from "@/hooks/useDoOut";

interface AddBadgeModalProps {
  title: string;
  children: React.ReactNode;
  refetchTable:()=>void;
  id_bitacora:string;
  ubicacion:string;
  area:string;
  fecha_salida:string;
}

export const DoOutModal: React.FC<AddBadgeModalProps> = ({
  title,
  children,
  area,
  refetchTable, 
  id_bitacora,
  ubicacion,
}) => {
  const { data:responseDoOut, isLoading:loadingDoOut, refetch: refetchDoOut, error:errorDoOut } = useDoOut(id_bitacora ?? null, ubicacion?? null, area??null );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(()=>{
    if(errorDoOut){
      setIsOpen(false)
      errorAlert(errorDoOut, "Error al asignar registrar la salida.", "warning")
    }
    },[errorDoOut])

  function onSubmit() {
    refetchDoOut()
  }

  useEffect(()=>{
    if(responseDoOut){
        if(responseDoOut.success==false){
            setIsOpen(false)
            errorAlert(responseDoOut)
        }else{
            console.log("RESPONSE", responseDoOut)
            setIsOpen(false)
            sweetAlert("success", "Confirmación", "Salida registrada exitosamente.")
            refetchTable()
        }
      
    }
  }, [responseDoOut])

//   if (open) {
//     return (
//       <SuccessModal
//         title={"Gafete Recibido"}
//         description={"El gafete ha sido recibido correctamente."}
//         open={open}
//         setOpen={setOpen}
//       />
//     );
//   }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

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

              <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white" onClick={onSubmit}>
              { !loadingDoOut ? (<>
              {("Confirmar")}
            </>) :(<> <Loader2 className="animate-spin"/> {"Cargando..."} </>)}
              </Button>
            </div>
      
      </DialogContent>        
    </Dialog>
  );
};
