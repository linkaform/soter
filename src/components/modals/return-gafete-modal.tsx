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
import { useAsignarGafete } from "@/hooks/useAsignarGafete";

import { toast } from "sonner";
import { dataGafetParamas } from "@/lib/bitacoras";

interface AddBadgeModalProps {
  title: string;
  children: React.ReactNode;
  refetchTable:()=>void;
  id_bitacora:string;
  ubicacion:string;
  area:string;
  fecha_salida:string;
  gafete:string;
  locker:string;
  tipo_movimiento:string;
}

export const ReturnGafeteModal: React.FC<AddBadgeModalProps> = ({
  title,
  children,
  area,
  refetchTable, 
  id_bitacora,
  ubicacion,
  gafete,
  locker,
  tipo_movimiento
}) => {
    const [dataGafete, setDataGafete]= useState<dataGafetParamas | null>(null)
    const { data:responseAsignarGafete, isLoading:loadingAsginarGafete, refetch: refetchAsignarGafete, error:errorAsignarGafete } = useAsignarGafete(dataGafete ?? null, 
        id_bitacora ?? null, tipo_movimiento ?? null );
     const [isOpen, setIsOpen] = useState(false);

  useEffect(()=>{
    if(errorAsignarGafete){
      setIsOpen(false)
      toast.error( "Error al devolver gafete.")
    }
    },[errorAsignarGafete])

  function onSubmit() {
    setDataGafete({locker_id:locker, gafete_id:gafete, documento:"", status_gafete:"entregado" , ubicacion:ubicacion, area:area})
  }


  useEffect(()=>{
    if(dataGafete){
      refetchAsignarGafete()
    }
  },[dataGafete,refetchAsignarGafete])

  useEffect(()=>{
    if(responseAsignarGafete){
        if(responseAsignarGafete.success==false){
            setIsOpen(false)
            toast.error("Gafete liberado correctamente.")
            // errorAlert(responseAsignarGafete)
        }else{
            setIsOpen(false)
            toast.error("Gafete liberado correctamente.")
            // sweetAlert("success", "Confirmación", "Gafete liberado correctamente.")
            refetchTable()
        }
    }
  }, [responseAsignarGafete,refetchTable])

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

              <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white" onClick={onSubmit}>
              { !loadingAsginarGafete ? (<>
              {("Confirmar")}
            </>) :(<> <Loader2 className="animate-spin"/> {"Cargando..."} </>)}
              </Button>
            </div>
      
      </DialogContent>        
    </Dialog>
  );
};
