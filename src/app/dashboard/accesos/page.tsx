/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { ActivePassesModal } from "@/components/modals/active-passes-modal";
import {
  CarFront,
  DoorOpen,
  Eraser,
  FileSymlink,
  List,
  LogIn,
  Menu,
  PackageOpen,
  Plus,
  Scan,
  Search,
  Sun,
  UsersRound,
  Wrench,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ComentariosAccesosTable } from "@/components/table/accesos/comentarios/table";
import Credentials from "@/components/pages/accesos/credential";
import { AccesosPermitidosTable } from "@/components/table/accesos/accesos-permitidos/table";
import { UltimosAccesosTable } from "@/components/table/accesos/ultimos-accesos/table";
import { VehiculosAutorizadosTable } from "@/components/table/accesos/vehiculos-autorizados/table";
import { EquiposAutorizadosTable } from "@/components/table/accesos/equipos-autorizados/table";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TemporaryPassesModal } from "@/components/modals/temporary-passes-modal";
import { useSearchPass } from "@/hooks/useSearchPass";
import { useAccessStore } from "@/store/useAccessStore";
import { AddVisitModal } from "@/components/modals/add-visit-modal";
import { toast } from "sonner";
import { useGetShift } from "@/hooks/useGetShift";
import { exitRegister, registerIncoming } from "@/lib/access";
import { PermisosTable } from "@/components/table/accesos/permisos-certificaciones/table";
import useAuthStore from "@/store/useAuthStore";
import { esHexadecimal } from "@/lib/utils";
import Link from "next/link";
import { useGetStats } from "@/hooks/useGetStats";
import { ScanPassWithCameraModal } from "@/components/modals/scan-pass-with-camera";
import Swal from "sweetalert2";
import { useAreasLocationStore } from "@/store/useGetAreaLocationByUser";
import { Equipo, Vehiculo } from "@/lib/update-pass-full";
import { UpdatePassModal } from "@/components/modals/complete-pass-accesos";
import Image from "next/image";

const AccesosPage = () => {
  const { isAuth } = useAuthStore()
  const { shift, isLoading:loadingShift } = useGetShift(true);
  const { area, location, setLoading , turno} = useShiftStore();
  const { passCode, setPassCode, clearPassCode, selectedEquipos, setSelectedEquipos, setSelectedVehiculos, selectedVehiculos, setTipoMovimiento, tipoMovimiento} = useAccessStore();
  const { isLoading, loading, searchPass } = useSearchPass(false);
  const [inputValue, setInputValue] = useState("");
  const [ openActivePases , setOpenActivePases ] = useState(false)
  const queryClient = useQueryClient();
  const [debouncedValue,setDebouncedValue]=useState("")
  const { data: stats } = useGetStats(true,location, area, 'Accesos')
  const { loading:loadingLocationArea} = useAreasLocationStore();
  const [equipos, setEquipos]= useState<Equipo[]>([])
  const [vehiculos, setVehiculos]= useState<Vehiculo[]>([])

  useEffect(() => {
	if(searchPass){
		setEquipos(searchPass?.grupo_equipos)
		setSelectedEquipos(searchPass?.grupo_equipos)
		const ultimoVehiculo = searchPass?.grupo_vehiculos?.[searchPass.grupo_vehiculos.length - 1];
		setVehiculos(searchPass?.grupo_vehiculos)
		setSelectedVehiculos([ultimoVehiculo])
		setTipoMovimiento(searchPass?.tipo_movimiento)
	}
  }, [searchPass?.grupo_equipos, searchPass?.grupo_vehiculos, searchPass?.tipo_movimiento]);


  const exitRegisterAccess = useMutation({
    mutationFn: async () => {
      const data = await exitRegister(area, location, passCode);

      if (!data.success) {
        throw new Error(data.error?.msg?.msg || "Hubo un error en la Salida");
      }

      return data.response?.data || [];
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setPassCode("");

	  toast.success("Salida Exitosa", {
		style: {
		  background: '#22c55e', 
		  color: 'white',
		},
	  });

      queryClient.invalidateQueries({ queryKey: ["serchPass"] });
      queryClient.invalidateQueries({ queryKey: ['getStats'] });
    },
    onError: (error) => {
	  Swal.fire({
		icon: "error",
		title: "Error al realizar la salida:",
		text: error.message,
		confirmButtonText: 'OK',
		customClass: {
		  confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow',
		},
		buttonsStyling: false, 
	  });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  //COMENTADO
  const certificaciones = Array.isArray(searchPass?.certificaciones)
    ? searchPass.certificaciones
    : []

  const ultimosAccesos = Array.isArray(searchPass?.ultimo_acceso)
    ? searchPass.ultimo_acceso
    : []

  const accesosPermitidos = Array.isArray(searchPass?.grupo_areas_acceso)
    ? searchPass.grupo_areas_acceso
    : []

  const { newCommentsPase, setAllComments } =
    useAccessStore();

  const allComments = [
    ...(newCommentsPase || []),
    ...(searchPass?.grupo_instrucciones_pase || []),
  ];

  React.useEffect(() => {
    if (allComments.length > 0) {
      setAllComments(allComments);
    }
  }, [newCommentsPase]);

  const doAccess = useMutation({
    mutationFn: async () => {
      const data = await registerIncoming({
        area,
        location,
        visita_a: searchPass?.visita_a,
        qr_code: passCode,
        vehiculo: selectedVehiculos,
        equipo: selectedEquipos,
        comentario_acceso:[],
        comentario_pase: allComments,
      });

      if (!data.success) {
        throw new Error(data.error?.msg?.msg || "Hubo un error en el Ingreso");
      }

      return data.response?.data || [];
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["serchPass"] });
      queryClient.invalidateQueries({ queryKey: ['getStats'] });

      setPassCode("");

	  toast.success("Entrada Exitosa", {
		style: {
		  background: '#22c55e', 
		  color: 'white',
		},
	  });

    },
    onError: (error) => {
	  Swal.fire({
		icon: "error",
		title: "Error al realizar ingreso:",
		text: error.message,
		confirmButtonText: 'OK',
		customClass: {
		  confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow',
		},
		buttonsStyling: false, 
	  });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

 

  useEffect(() => {
   	if(inputValue){
		const handler = setTimeout(() => {
			setDebouncedValue(inputValue)
		}, 700);
		return () => clearTimeout(handler); 
   	}
  }, [inputValue]);

  useEffect(() => {
    if (debouncedValue) {
		if(esHexadecimal(inputValue)){
			setInputValue("")
			setPassCode(inputValue)
		}else{
			// setInput(inputValue)
			setOpenActivePases(true)
			setPassCode("")
			setInputValue("")
		}
    }else{
		setOpenActivePases(false)
		setPassCode("")
		setPassCode("")
		setInputValue("")
	}
  }, [debouncedValue]);
  

  if (isLoading || loading || loadingShift || loadingLocationArea) {
    return (
      <div className="flex justify-center items-center h-screen">
			<div className="w-24 h-24 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!turno && isAuth) {
	return (
		<div className="flex justify-center items-center h-screen overflow-hidden">
		  <div className="flex items-center flex-col gap-2">
			  <Image
                src="/guardia1.png"
                alt="Next.js img"
                width={300}
                height={300}
                priority
              />

			<div className="text-2xl font-bold">Inicia turno para comenzar...</div>
			<p className="text-gray-500">Activa tus funciones registrando el inicio de turno.</p>
			<Link href="/dashboard/turnos">
			<Button
			  className="w-40 h-9 mt-5 px-3 border border-blue-500 bg-blue-500 rounded-md text-sm text-white font-medium hover:bg-blue-600"
			  variant="default"
			>
			  Turnos
			{/* <ArrowRight className="w-4 h-4" /> */}
			</Button>
			</Link>
		  </div>
		</div>
		)
  }

  return (
    <div className="h-screen ">
		<div className="flex flex-col w-full">
			<div className="p-6 space-y-6 w-full mx-auto pb-0">
				<div className="flex justify-center flex-col md:flex-row gap-3 ">
					<div className="flex justify-center mb-5 mr-5 w-full md:max-w-lg ">
					<div className="relative w-full flex items-center ">
						<Input
						type="text"
						placeholder="Escanear Pase"
						className="pl-5 pr-10 w-full"
						value={inputValue} // Enlazamos el input con su estado
						onChange={(e) => setInputValue(e.target.value)} // Actualizamos el estado
						/>
						 <Search className="absolute right-12 h-4 w-4 text-gray-500 pointer-events-none" />

						<ActivePassesModal title="Pases Activos"  input={debouncedValue} setInput={setDebouncedValue} setOpen={setOpenActivePases} open={openActivePases}>
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-0 top-0 h-full border rounded-tl-none rounded-bl-none rounded-tr-sm rounded-br-sm"
						>
							<Menu className="h-4 w-4" />
						</Button>
						</ActivePassesModal>
					</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-2">
					{searchPass?.tipo_movimiento === "Entrada" && (
						<Button
						className="bg-green-600 hover:bg-green-700"
						onClick={() => {
							if (shift?.guard?.status_turn === "Turno Cerrado") {
							toast.error(
								"¡Debes iniciar turno antes de registrar un ingreso!."
							);
							return;
							}
							doAccess.mutate();
						}}
						>
						<LogIn />
						Registrar ingreso
						</Button>
					)}

					{searchPass?.tipo_movimiento === "Salida" && (
						<Button
						className="bg-red-500 hover:bg-red-600 text-white"
						onClick={() => {
							if (shift?.guard?.status_turn === "Turno Cerrado") {
							toast.error(
								"¡Debes iniciar turno antes de registrar una salida!."
							);
							return;
							}

							exitRegisterAccess.mutate();
						}}
						>
						<DoorOpen />
						Registrar Salida
						</Button>
					)}
					<ScanPassWithCameraModal title="Escanea un pase con la camara" >
								<Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
					<Scan />
									Escanear un pase
								</Button>
					</ScanPassWithCameraModal>
					{!passCode && (
						<AddVisitModal title="Nueva Visita">
						<Button className="bg-green-600 hover:bg-green-700 text-white">
							<Plus />
							Nueva Visita
						</Button>
						</AddVisitModal>
					)}
					{ !searchPass ? (<>
					<TemporaryPassesModal title="Pases en Proceso">
						<Button
						variant="secondary"
						className="bg-blue-500 hover:bg-blue-600 text-white"
						>
						<List className="text-white" />
						Pases En Proceso
						</Button>
					</TemporaryPassesModal></>):null}
					{ searchPass ? (<>
					<Button
						className="bg-red-500 hover:bg-red-600 text-white"
						variant="secondary"
						onClick={() =>{ setDebouncedValue(""); clearPassCode(); }}
					>
						<Eraser className="text-white" />
						
					</Button></>):null}
					{ searchPass?.estatus=="proceso" ? (<>
					<UpdatePassModal title={"Completar Pase"} id={searchPass._id} dataCatalogos={searchPass}>
						<Button
							className="bg-blue-500 hover:bg-blue-600 text-white"
							variant="secondary"
							// onClick={() => {
							// 	navigator.clipboard.writeText(searchPass?.link).then(() => {
							// 	toast("¡Enlace copiado!", {
							// 	description:
							// 		"El enlace ha sido copiado correctamente al portapapeles.",
							// 	action: {
							// 		label: "Abrir enlace",
							// 		onClick: () => window.open(searchPass?.link, "_blank"), // Abre el enlace en una nueva pestaña
							// 	},
							// 	});
							// });
							// }}
						>
							<FileSymlink />  Completar Pase
							
						</Button>
					</UpdatePassModal>
					</>):null}
					

					</div>
				</div>
			</div>

			{ searchPass ? (
			<>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
					<div className="row-span-3  flex flex-col p-4 pt-0">
						<Credentials searchPass={searchPass} />
					</div>
					<div className="flex flex-col h-fit p-4 gap-3 ">
						<ComentariosAccesosTable allComments={allComments} />
						<PermisosTable certificaciones={certificaciones}/>
					</div>

					<div className="flex flex-col h-fit p-4 gap-3 ">
						<UltimosAccesosTable ultimosAccesos={ultimosAccesos} /> 
						
							<AccesosPermitidosTable accesosPermitidos={accesosPermitidos} />
						</div>

						
					  <div className="col-span-2 col-start-2 pr-4">
					 	<div className="fbg-slate-400 ml-5">
					 		<div className="">
					 			<EquiposAutorizadosTable equipos={equipos} setEquipos={setEquipos} setSelectedEquipos={setSelectedEquipos} selectedEquipos={selectedEquipos} tipoMovimiento={tipoMovimiento}/>
					 		</div>

					 		<div className="">
					 			<VehiculosAutorizadosTable vehiculos={vehiculos} setVehiculos={setVehiculos} setSelectedVehiculos={setSelectedVehiculos} selectedVehiculos={selectedVehiculos} tipoMovimiento={tipoMovimiento}/>
					 		</div>
					 	</div>
					 </div>
				</div>
				
			</>
			):null}
		</div>
		{!searchPass ?
	  	<div className="flex flex-col justify-center items-center gap-10 mt-32">
				<div className="flex flex-col justify-center w-1/6 gap-2">
					<Input placeholder="Ubicacion" value={location} disabled/>
					<Input placeholder="Area" value={area} disabled/>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
					<div className={`border p-4 px-12 py-6 rounded-md cursor-pointer transition duration-100`}>
						<div className="flex gap-6"><Sun className="text-primary w-14 h-14" />
							<span className="flex items-center font-bold text-5xl"> {stats?.visitas_en_dia}</span>
						</div>
						<div className="flex items-center space-x-0">
							<div className="h-1 w-1/2 bg-cyan-100"></div>
							<div className="h-1 w-1/2 bg-blue-500"></div>
						</div>
						<span className="text-lg">Visitas en el dia</span>
					</div>

					<div className={`border p-4 px-12 py-6 rounded-md cursor-pointer transition duration-100 `}>
						<div className="flex gap-6"><UsersRound className="text-primary w-14 h-14"/>
							<span className="flex items-center font-bold text-5xl"> {stats?.personas_dentro}</span>
						</div>
						<div className="flex items-center space-x-0">
							<div className="h-1 w-1/2 bg-cyan-100"></div>
							<div className="h-1 w-1/2 bg-blue-500"></div>
						</div>
						<span className="text-lg">Personas dentro</span>
					</div>

					<div className={`border p-4 px-12 py-6 rounded-md cursor-pointer transition duration-100 `} >
						<div className="flex gap-6"><DoorOpen className="text-primary w-14 h-14"/>
							<span className="flex items-center font-bold text-5xl"> {stats?.salidas_registradas}</span>
						</div>
						<div className="flex items-center space-x-0">
							<div className="h-1 w-1/2 bg-cyan-100"></div>
							<div className="h-1 w-1/2 bg-blue-500"></div>
						</div>
						<span className="text-lg">Salidas registradas</span>
					</div>

					<div className={`border p-4 px-12 py-6 rounded-md cursor-pointer transition duration-100 `} >
						<div className="flex gap-6"><PackageOpen className="text-primary w-14 h-14"/>
							<span className="flex items-center font-bold text-5xl"> {stats?.paquetes_recibidos}</span>
						</div>
						<div className="flex items-center space-x-0">
							<div className="h-1 w-1/2 bg-cyan-100"></div>
							<div className="h-1 w-1/2 bg-blue-500"></div>
						</div>
						<span className="text-lg">Paquetes Recibidos</span>
					</div>

					<div className={`border p-4 px-12 py-6 rounded-md cursor-pointer transition duration-100 `} >
						<div className="flex gap-6"><CarFront className="text-primary w-14 h-14"/>
							<span className="flex items-center font-bold text-5xl"> {stats?.total_vehiculos_dentro}</span>
						</div>
						<div className="flex items-center space-x-0">
							<div className="h-1 w-1/2 bg-cyan-100"></div>
							<div className="h-1 w-1/2 bg-blue-500"></div>
						</div>
						<span className="text-lg">Vehiculos Dentro</span>
					</div>

					<div className={`border p-4 px-12 py-6 rounded-md cursor-pointer transition duration-100 `} >
						<div className="flex gap-6"><Wrench className="text-primary w-14 h-14"/>
							<span className="flex items-center font-bold text-5xl"> {stats?.total_equipos_dentro}</span>
						</div>
						<div className="flex items-center space-x-0">
							<div className="h-1 w-1/2 bg-cyan-100"></div>
							<div className="h-1 w-1/2 bg-blue-500"></div>
						</div>
						<span className="text-lg">Equipos Dentro</span>
					</div>

				</div>
		</div>
	:null}
    </div>
  );
};

export default AccesosPage;