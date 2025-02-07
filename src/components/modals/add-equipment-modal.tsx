import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import EquipoList from "../equipo-list";
import { useEffect, useState } from "react";
import { Equipo } from "@/lib/update-pass";
import { Loader2 } from "lucide-react";
import { useUpdateBitacora } from "@/hooks/useUpdateBitacora";
import { formatEquiposToBitacora } from "@/lib/utils";
import { toast } from "sonner";
import { Equipo_bitacora, Vehiculo_bitacora } from "../table/bitacoras/bitacoras-columns";

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
    refetch()
  },[dataFetch])

  useEffect(()=>{
    if(responseUpdateBitacora?.status_code==202){
      setIsOpen(false)
      refetchTable()
      toast.success("¡Equipos actualizados correctamente!");
    }
  },[responseUpdateBitacora])

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
