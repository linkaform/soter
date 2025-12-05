"use client"
import { CloseShiftModal } from "@/components/modals/close-shift-modal";
import { StartShiftModal } from "@/components/modals/start-shift-modal";
import TakePhotoGuard from "@/components/modals/take-photo-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Imagen } from "@/lib/update-pass-full";
import { capitalizeOnlyFirstLetter } from "@/lib/utils";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import { ViewPhotoGuard } from "@/components/modals/view-photo-guard";
import DeletePhotoGuard from "@/components/modals/eliminar-photo-guard";
import useAuthStore from "@/store/useAuthStore";

const TurnStatus = ({
	shift,
	location,
	area,
	evidencia,
	setEvidencia,
	identificacion,
	setIdentificacion,
	nombreSuplente,
	forceOpenStartPhoto,
	setForceOpenStartPhoto
  }: {
	shift: any;
	location: string;
	area: string;
	evidencia: Imagen[];
	setEvidencia: Dispatch<SetStateAction<Imagen[]>>;
	identificacion: Imagen[];
	setIdentificacion: Dispatch<SetStateAction<Imagen[]>>;
	nombreSuplente: string;
	forceOpenStartPhoto: boolean;
	setForceOpenStartPhoto: Dispatch<SetStateAction<boolean>>;
  }) => {
  
  	const [currentDateTime, setCurrentDateTime] = useState(new Date());
  	const turno =  capitalizeOnlyFirstLetter(shift?.guard.status_turn?? "")
	const checkin_id = shift?.booth_status?.checkin_id
	const {userNameSoter} = useAuthStore()

	const [openStartShift, setOpenStartShift] = useState(false)
	const [openCloseShift, setOpenCloseShift] = useState(false);

	const [openClosePhotoModal, setOpenClosePhotoModal] = useState(false);
	const [openStartPhotoModal, setOpenStartPhotoModal] = useState(false);

	const [openStartView, setOpenStartView] = useState(false);
	const [openCloseView, setOpenCloseView] = useState(false);

	const [openDeletePhoto, setOpenDeletePhoto] = useState(false);

  useEffect(() => {
	
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(interval); 

  }, [setEvidencia, setIdentificacion, shift?.booth_status?.fotografia_inicio_turno, ]);


  const formattedDate = currentDateTime.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  }); 

	useEffect(() => {
	if (openClosePhotoModal === true && identificacion && identificacion.length > 0) {
		setTimeout(() => {
			setOpenCloseShift(true);
		}, 800);
	}
	}, [openClosePhotoModal, identificacion]);

	useEffect(() => {
		if (openStartPhotoModal === true && evidencia && evidencia.length > 0) {
			setTimeout(() => {
				setOpenStartShift(true);
			}, 800);
		}
	}, [openStartPhotoModal, evidencia]);

	useEffect(() => {
		if (forceOpenStartPhoto) {
			setOpenStartPhotoModal(true);  
			setForceOpenStartPhoto(false);
		}
	}, [forceOpenStartPhoto, setForceOpenStartPhoto]);
	
	useEffect(()=>{
		console.log("userNameSoter",userNameSoter, shift?.booth_status?.guard_on_dutty)
		if(shift?.booth_status?.fotografia_inicio_turno.length>0 && shift?.booth_status?.guard_on_dutty === userNameSoter)
			setEvidencia(shift?.booth_status?.fotografia_inicio_turno)
		if(shift?.booth_status?.fotografia_cierre_turno  && shift?.booth_status?.guard_on_dutty === userNameSoter)
			setIdentificacion(shift?.booth_status?.fotografia_cierre_turno.length)
	
	},[shift?.booth_status?.fotografia_inicio_turno, shift?.booth_status?.fotografia_cierre_turno, setEvidencia, setIdentificacion, userNameSoter, shift?.booth_status?.guard_on_dutty])

  return (
    <div className="flex items-center flex-col md:flex-row justify-between md:mb-3">
      <div className="flex mb-3 lg:mb-0">
        <div className="flex flex-col">
			<p className="font-bold text-2xl">Detalles del turno</p>
			<div className="flex flex-col sm:flex-row gap-10 mt-2">

				<div
					className={`
						relative w-32 h-32 mx-auto flex flex-col items-center justify-center border-2 border-dashed
						${turno=="Turno abierto" ? "border-gray-300 bg-gray-100 cursor-not-allowed shadow-none opacity-50" : "border-gray-400 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.2)]"}
					`}
					onClick={() => {
						if(evidencia.length>0 || shift?.booth_status?.fotografia_inicio_turno?.[0]?.file_url ){
							setOpenStartView(true);
						}else {
							if (turno=="Turno cerrado"){
								setOpenStartPhotoModal(true);
							}
						}
					}}
					>
					{Array.isArray(evidencia) && evidencia.length > 0 && turno=="Turno cerrado" && shift?.booth_status?.guard_on_dutty === userNameSoter && (
						<button
							onClick={(e) => {
								e.stopPropagation();
								setOpenDeletePhoto(true)
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
					src={shift?.booth_status?.guard_on_dutty === userNameSoter ? evidencia?.[0]?.file_url || shift?.booth_status?.fotografia_inicio_turno?.[0]?.file_url || "/nouser.svg" : "/nouser.svg"}
					alt="Inicio de turno"
					/>
					<span className="text-xs text-center text-gray-600">
					Inicio de turno
					</span>
				</div>

				<DeletePhotoGuard setEvidencia={setEvidencia} open={openDeletePhoto} setOpen={setOpenDeletePhoto}>
				</DeletePhotoGuard>

				<TakePhotoGuard title="Tomar Fotografía" descripcion="Capture una fotografía de su uniforme completo antes de iniciar su turno." evidencia={evidencia} setEvidencia={setEvidencia} open={openStartPhotoModal} setOpen={setOpenStartPhotoModal}>
				</TakePhotoGuard>

				<ViewPhotoGuard  evidencia={evidencia} open={openStartView} setOpen={setOpenStartView}>
				</ViewPhotoGuard>

				<ViewPhotoGuard evidencia={identificacion}  open={openCloseView} setOpen={setOpenCloseView}>
				</ViewPhotoGuard>
				
				<div
					className={`
						relative w-32 h-32 mx-auto flex flex-col items-center justify-center border-2 border-dashed
						${turno=="Turno abierto" ? "border-gray-400 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.2)]" : "border-gray-300 bg-gray-100 cursor-not-allowed shadow-none opacity-50"}
					`}
					onClick={() => {
						if(identificacion.length>0){
							setOpenCloseView(true);
						}else{
							if (turno=="Turno abierto"){
								setOpenClosePhotoModal(true);
							}
						}
					}}
					>
					{Array.isArray(identificacion) && identificacion.length > 0 && turno=="Turno abierto" && (
						<button
						onClick={(e) => {
							e.stopPropagation();
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
						src={identificacion?.[0]?.file_url  || shift?.booth_status?.fotografia_cierre_turno?.[0]?.file_url || "/nouser.svg"}
						alt="Cierre de turno"
					/>
					<span className="text-xs text-center text-gray-600">
						Cierre de turno
					</span>
				</div>

				<TakePhotoGuard title="Tomar Fotografía" descripcion="Capture una fotografía de su uniforme completo antes de cerrar su turno." evidencia={identificacion} setEvidencia={setIdentificacion} open={openClosePhotoModal} setOpen={setOpenClosePhotoModal} >
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
	  	{shift?.guard?.status_turn !== "Turno Abierto" && (
			<Button
				className="w-[520px] md:w-[300px] bg-blue-600 hover:bg-blue-700"
				disabled={area === ""}
				onClick={() => {
				if (!evidencia || evidencia.length === 0) {
					setOpenStartPhotoModal(true); // Foto de inicio faltante
				} else {
					setOpenStartShift(true); // Abrir modal de iniciar turno
				}
				}}
			>
				Iniciar Turno
			</Button>
		)}

		<StartShiftModal title="Confirmación" evidencia={evidencia} open= {openStartShift} setOpen={setOpenStartShift} nombreSuplente={nombreSuplente} checkin_id={checkin_id}>
		</StartShiftModal>
       
		{shift?.guard?.status_turn !== "Turno Cerrado" && (
            <Button className="w-[520px] md:w-[300px] bg-red-600 hover:bg-red-700" disabled ={area==""?true:false  }
			onClick={() => {
				if (!identificacion || identificacion.length === 0) {
					setOpenClosePhotoModal(true);
				} else {
					setOpenCloseShift(true);
				}
				}}>
            Cerrar Turno
            </Button>
        )}

     	<CloseShiftModal title="Confirmación" shift={shift} area={area} location={location} identificacion={identificacion} open={openCloseShift} setOpen={setOpenCloseShift}>
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
