import { CloseShiftModal } from "@/components/modals/close-shift-modal";
import { StartShiftModal } from "@/components/modals/start-shift-modal";
import TakePhotoGuard from "@/components/modals/take-photo-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Imagen } from "@/lib/update-pass-full";
import { capitalizeOnlyFirstLetter } from "@/lib/utils";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";

const TurnStatus = ({shift, location, area, evidencia, setEvidencia, identificacion, setIdentificacion}: {shift: any, location: string, area:string ,
	evidencia:Imagen[], setEvidencia:Dispatch<SetStateAction<Imagen[]>>, identificacion:Imagen[], setIdentificacion:Dispatch<SetStateAction<Imagen[]>>
}) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const turno =  capitalizeOnlyFirstLetter(shift?.guard.status_turn?? "")


  useEffect(() => {
	if(shift?.booth_status?.fotografia_inicio_turno)
		setEvidencia(shift?.booth_status?.fotografia_inicio_turno)
	if(shift?.booth_status?.fotografia_cierre_turno)
		setIdentificacion(shift?.booth_status?.fotografia_cierre_turno)

    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // 🔥 Se actualiza cada 60,000ms (1 minuto)

    return () => clearInterval(interval); 

  }, [setEvidencia, setIdentificacion, shift?.booth_status?.fotografia_inicio_turno, shift?.booth_status?.fotografia_cierre_turno]);




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
    <div className="flex items-center flex-col md:flex-row justify-between md:mb-3">
      <div className="flex mb-3 lg:mb-0">
        <div className="flex flex-col">
			<p className="font-bold text-2xl">Detalles del turno</p>
			<div className="flex flex-col sm:flex-row gap-10 mt-2">

				<TakePhotoGuard title="Tomar Fotografía" descripcion="Capture una fotografía de su uniforme completo antes de iniciar su turno." evidencia={evidencia} setEvidencia={setEvidencia}>
					<div className="relative w-32 h-32 mx-auto flex flex-col items-center justify-center border-2 border-dashed border-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.2)] cursor-pointer">

							{Array.isArray(evidencia) && evidencia.length > 0 && (
								<button
									onClick={(e) => {
									e.stopPropagation(); // Evita que abra el modal
									setEvidencia([]);
									}}
									className="absolute top-1 right-1 bg-red-600 text-white rounded-sm px-1.5 shadow hover:bg-red-600"
									title="Eliminar imagen"
								>
								x
								</button>
							)}

							<Image
							width={112}
							height={96}
							className="w-28 h-24 object-contain"
							src={evidencia?.[0]?.file_url || "/nouser.svg"}
							alt="Inicio de turno"
							/>
							<span className="text-xs text-center text-gray-600">
							Inicio de turno
							</span>
						</div>
				</TakePhotoGuard>

				<TakePhotoGuard title="Tomar Fotografía" descripcion="Capture una fotografía de su uniforme completo antes de cerrar su turno." evidencia={identificacion} setEvidencia={setIdentificacion} >
					<div>
						<div className="relative w-32 h-32 mx-auto flex flex-col items-center justify-center border-2 border-dashed border-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.2)] cursor-pointer">

							{Array.isArray(identificacion) && identificacion.length > 0 && (
								<button
									onClick={(e) => {
									e.stopPropagation(); // Evita que abra el modal
									setIdentificacion([]);
									}}
									className="absolute top-1 right-1 bg-red-600 text-white rounded-sm px-1.5 shadow hover:bg-red-600"
									title="Eliminar imagen"
								>
								x
								</button>
							)}

							<Image
							width={112}
							height={96}
							className="w-28 h-24 object-contain"
							src={identificacion?.[0]?.file_url || "/nouser.svg"}
							alt="Cierre de turno"
							/>
							<span className="text-xs text-center text-gray-600">
							Cierre de turno
							</span>
						</div>
					</div>
				</TakePhotoGuard>

				<div className="flex flex-col sm:flex-row justify-between sm:gap-10 sm:gap-y-10 items-center">
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
        </div>
      </div>

	  <div className="flex flex-col items-end">
		<StartShiftModal title="Confirmación" evidencia={evidencia} >
			{shift?.guard?.status_turn === "Turno Cerrado" && (
			<Button className="w-[520px] md:w-[300px] bg-blue-500 hover:bg-blue-600" disabled ={area==""?true:false ||  shift?.booth_status?.status=="No Disponible" || (evidencia?.length ?? 0) === 0
			}>
			Iniciar Turno
			</Button>
			
			)}
		</StartShiftModal>
       
     	  <CloseShiftModal title="Confirmación" shift={shift} area={area} location={location} identificacion={identificacion}>
          {shift?.guard?.status_turn !== "Turno Cerrado" && (
            <Button className="w-[520px] md:w-[300px] bg-red-600 hover:bg-red-700" disabled ={area==""?true:false  ||  (identificacion?.length ?? 0) === 0}>
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
		
		{shift?.guard?.status_turn == "Turno Cerrado" &&(evidencia?.length ?? 0) === 0?
		<div className="text-red-500">
			Tomate una fotografía para iniciar turno.
		</div>
		:null}

		{shift?.guard?.status_turn == "Turno Abierto" && (identificacion?.length ?? 0) === 0?
		<div className="text-red-500">
			Tomate una fotografía para cerrar turno.
		</div>
		:null}


	  </div>
    </div>
  );
};

export default TurnStatus;
