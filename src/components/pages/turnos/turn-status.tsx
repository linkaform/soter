import { CloseShiftModal } from "@/components/modals/close-shift-modal";
import { StartShiftModal } from "@/components/modals/start-shift-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetShift } from "@/hooks/useGetShift";
import { capitalizeOnlyFirstLetter } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import React, { useEffect, useState } from "react";

const TurnStatus = () => {
  const { shift } = useGetShift( false);
  const { area } = useShiftStore();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const turno =  capitalizeOnlyFirstLetter(shift?.guard.status_turn?? "")
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // 🔥 Se actualiza cada 60,000ms (1 minuto)

    return () => clearInterval(interval); 
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  }); 

  return (
    <div className="flex items-center flex-col md:flex-row justify-between mb-10 md:mb-5">
      <div className="flex mb-5 lg:mb-0">
        <div className="flex flex-col sm:flex-row justify-between sm:gap-10 sm:gap-y-10">
          <div>
            <p>Fecha:</p>
            <p className="mt-1">{formattedDate}</p>
         </div>

          <div>
            <p>Hora:</p>
             <p className="mt-1">{formattedTime}</p>
         </div>

          <div>
       
            <p>Estatus del Turno:</p>
             <Badge
              className={`text-white text-md  ${
              shift?.guard?.status_turn === "Turno Cerrado"
                ? "bg-red-600 hover:bg-red-600"
                : "bg-green-600 hover:bg-green-600"
              }`}
            >
              {turno}
            </Badge>
          </div>

         
        </div>
      </div>
	  <div className="flex flex-col items-end">
      <StartShiftModal title="Confirmación">
        {shift?.guard?.status_turn === "Turno Cerrado" && (
          <Button className="w-[520px] md:w-[300px] bg-blue-500 hover:bg-blue-600" disabled ={area==""?true:false ||  shift?.booth_status?.status=="No Disponible"}>
          Iniciar Turno
          </Button>
        
        )}
      </StartShiftModal>
       
     	  <CloseShiftModal title="Confirmación">
          {shift?.guard?.status_turn !== "Turno Cerrado" && (
            <Button className="w-[520px] md:w-[300px] bg-red-600 hover:bg-red-700" disabled ={area==""?true:false}>
            Cerrar Turno
            </Button>
          )}
      	</CloseShiftModal>

          <>
          {shift?.booth_status.status=="No Disponible" && shift?.guard?.status_turn === "Turno Cerrado" ?
            <div className="text-red-500 break-all ml-2">
              * Fuerce el cierre de la caseta para iniciar turno
            </div>
          :null}
          </>


          {area==""?
            <div className="text-red-500">
              Selecciona una caseta para iniciar turno
            </div>
          :null}
	  </div>
    </div>
  );
};

export default TurnStatus;
