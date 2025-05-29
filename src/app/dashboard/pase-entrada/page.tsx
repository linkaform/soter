//eslint-disable react-hooks/exhaustive-deps
'use client'; 

import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import Multiselect from 'multiselect-react-dropdown';
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { EntryPassModal } from "@/components/modals/add-pass-modal";
import { List } from "lucide-react";
import { formatDateToString, formatFecha } from "@/lib/utils";
import AreasList from "@/components/areas-list";
import { Areas, Comentarios } from "@/hooks/useCreateAccessPass";
import ComentariosList from "@/components/comentarios-list";
import DateTime from "@/components/dateTime";
import { MisContactosModal } from "@/components/modals/user-contacts";
import Image from "next/image";
import { Contacto } from "@/lib/get-user-contacts";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { usePaseEntrada } from "@/hooks/usePaseEntrada";
import { useShiftStore } from "@/store/useShiftStore";

 const formSchema = z
	.object({
	nombre: z.string().min(2, {
	  	message: "Por favor, ingresa un tu nombre completo",
	}),
	email: z.string().optional().refine((val) => {
		if (val && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(val)) {
			return false;
		}
		return true;
	}, {
		  message: "Por favor, ingresa un correo electrónico válido.",
	}),
	telefono: z.string().optional(),
	ubicacion: z.string().optional(),
	ubicaciones: z.array(z.string()),
	tema_cita: z.string().optional(),
	descripcion: z.string().optional(),
	perfil_pase: z.string().min(1),
	status_pase:z.string().min(1),
	visita_a: z.string().nullable().optional(),
	custom: z.boolean().optional(),
	link: z.object({
		link: z.string().optional(), 
		docs: z.array(z.string()).optional(),
		creado_por_id: z.number().int({ message: "El ID debe ser un número entero." }).optional(),  
		creado_por_email: z.string().optional(), 
	}),
	enviar_correo_pre_registro:z.array(z.string()).optional(),
	
	tipo_visita_pase: z.enum(["fecha_fija", "rango_de_fechas"], {
	  	required_error: "Seleccione un tipo de fecha.",
	}),
	fechaFija: z.string().optional(),
	fecha_desde_visita: z.string().optional(),
	fecha_desde_hasta: z.string().optional(),
	config_dia_de_acceso: z.enum(["cualquier_día", "limitar_días_de_acceso"], {
	  	required_error: "Seleccione un tipo de acceso.",
	}),
	config_dias_acceso: z.array(z.string()).optional(),
	config_limitar_acceso: z.number().optional().refine((val) => (val ? !isNaN(Number(val)) && Number(val) > 0 : true), {
		message:
		  "Ingrese un número válido mayor a 0 para el límite de accesos.",
	}),
	areas: z.array(
		z.object({
			nombre_area: z.string().optional(),         
			comentario_area: z.string().optional(),     
		})
	),
	comentarios:z.array(
		z.object({
			tipo_comentario: z.string().optional(),      
			comentario_pase: z.string().optional(),      
		})
	),
	enviar_pre_sms: z.object({
		from: z.string().min(1, { message: "El campo 'from' no puede estar vacío." }),  
		mensaje: z.string().min(1, { message: "El mensaje no puede estar vacío." }),  
		numero: z.string().optional()
	}),
  }) 
  .refine((data) => {
		if (data.tipo_visita_pase === 'rango_de_fechas') {
		const fechaDesdeValida = data.fecha_desde_visita && data.fecha_desde_hasta;
		if (!fechaDesdeValida) {
			return false;
		}
	}
	return true;
  }, {
		message: "Ambas fechas (Desde y Hasta) son requeridas cuando el tipo de pase es 'rango de fechas'.",
		path: ['fecha_desde_visita'],
  })
  .refine((data) => {
		if (data.tipo_visita_pase === 'rango_de_fechas') {
		const fechaDesdeValida = data.fecha_desde_visita && data.fecha_desde_hasta;
		if (!fechaDesdeValida) {
			return false;
		}
	}
	return true;
  }, {
		message: "Ambas fechas (Desde y Hasta) son requeridas cuando el tipo de pase es 'rango de fechas'.",
		path: ['fecha_desde_hasta'], 
  })
  .refine((data) => {
		if (!data.email && !data.telefono) {
		return false;
		}
		return true;
  }, {
		message: "Se requiere un email o teléfono.", 
		path:['email']
  });

  const PaseEntradaPage = () =>  {
	const [tipoVisita, setTipoVisita] = useState("fecha_fija");
	const { location } = useShiftStore()
	const [config_dias_acceso, set_config_dias_acceso] = useState<string[]>([]);
	const [config_dia_de_acceso, set_config_dia_de_acceso] = useState("cualquier_día");
	const [isSuccess, setIsSuccess] = useState(false);
	const [modalData, setModalData] = useState<any>(null);
	// const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');
	const { dataAreas:catAreas, dataLocations:ubicaciones, ubicacionesDefault , isLoadingAreas:loadingCatAreas, isLoadingLocations:loadingUbicaciones} = useCatalogoPaseAreaLocation(location, true, location?true:false);
	const [ubicacionesSeleccionadas, setUbicacionesSeleccionadas] = useState<string[]>(ubicacionesDefault??[]);

	const ubicacionesFormatted = ubicaciones?.map((u: any) => ({ id: u, name: u }));

	const [userIdSoter] = useState<number|null>(()=>{
			return Number(typeof window !== "undefined"? window.localStorage.getItem("userId_soter"):0) 
	});

	const[userNameSoter] = useState<string|null>(()=>{
		return typeof window !== "undefined"? window.localStorage.getItem("userName_soter"):""
	})
	const [userEmailSoter] = useState<string|null>(()=>{
		return typeof window !== "undefined"? window.localStorage.getItem("userEmail_soter"):""
	})


	const [host, setHost] = useState<string>();
	//()=>{return typeof window !== "undefined"? window.location.host:""}
	const [protocol,setProtocol] = useState<string>();
	//()=>{	return typeof window !== "undefined"? window.location.protocol:""	}
	useEffect(() => {
		if (typeof window !== "undefined" && typeof window.location !== "undefined") {
			setHost(window.location.host);
			setProtocol(window.location.protocol);
		}
	}, []); 

	const { dataConfigLocation, isLoadingConfigLocation } = usePaseEntrada(ubicacionesSeleccionadas[0]?? '')
	const [enviar_correo_pre_registro] = useState<string[]>([]);
	const [formatedDocs, setFormatedDocs] = useState<string[]>([])
	const [formatedEnvio, setFormatedEnvio] = useState<string[]>([])
	const [comentariosList, setComentariosList] = useState<Comentarios[]>([]);
	const [areasList, setAreasList] = useState<Areas[]>([]);
	// const [isActive, setIsActive] = useState(false);
	// const [isActiveSMS, setIsActiveSMS] = useState(false);
	const [isActiveFechaFija, setIsActiveFechaFija] = useState(true);
	const [isActiveRangoFecha, setIsActiveRangoFecha] = useState(false);
	const [isActivelimitarDias, setIsActiveLimitarDias] = useState(true);
	const [isActiveCualquierDia, setIsActiveCualquierDia] = useState(true);
	const [isActivelimitarDiasSemana, setIsActiveLimitarDiasSemana] = useState(false);
	const [isActiveAdvancedOptions, setIsActiveAdvancedOptions] = useState(false);
	const [date, setDate] = React.useState<Date| "">("");
	const [fechaDesde, setFechaDesde] = useState<string>('');
	const [selected, setSelected] = useState<Contacto |null>(null);
	const [isOpenModal, setOpenModal] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: "",
			email: "",
			telefono: "",
			ubicacion:"",
			ubicaciones:[],
			tema_cita:"",
			descripcion:"",
			perfil_pase: "Visita General",
			status_pase:"Proceso",
			visita_a: userNameSoter ?? "",
			custom: true,
			link:{
				link :`${protocol}//${host}/dashboard/pase-update`,
				docs : formatedDocs,
				creado_por_id: userIdSoter || 0,
				creado_por_email: userEmailSoter ??""
		},
			enviar_correo_pre_registro:enviar_correo_pre_registro??[], 
			tipo_visita_pase: "fecha_fija",
			fechaFija: "",
			fecha_desde_visita: "",
			fecha_desde_hasta: "",
			config_dia_de_acceso: "cualquier_día",
			config_dias_acceso: config_dias_acceso??[],
			config_limitar_acceso: 1,
			areas: [],
			comentarios: [],
			enviar_pre_sms:{
				from: "enviar_pre_sms",
				mensaje: "SOY UN MENSAJE",
				numero: "528120084370",
			},
		},
	});

	const toggleDia = (dia: string) => {
		set_config_dias_acceso((prev) => {
		const updatedDias = prev.includes(dia)
			? prev.filter((d) => d !== dia) 
			: [...prev, dia]; 
		return updatedDias;
		});
		
	};


	useEffect(()=>{
		if ( selected ) {
			form.setValue("nombre", selected.nombre || "");
			form.setValue("email", selected.email || "");
			form.setValue("telefono", selected.telefono || "");
			closeModalContactos()
		}
	}, [selected, form])

	useEffect(()=>{
		if(dataConfigLocation){
			const docs: string[] = []
			dataConfigLocation?.requerimientos?.map((value:string)=>{
				if(value=="identificacion") {
					docs.push("agregarIdentificacion")}
				if(value=="fotografia") {
					docs.push("agregarFoto")}
			})
			setFormatedDocs(docs)

			const envioCS: string[] = []
			dataConfigLocation?.envios?.map((envio: string) => {
				if(envio == "correo") {
					envioCS.push("enviar_correo_pre_registro")
				}
				if(envio == "sms") {
					envioCS.push("enviar_sms_pre_registro")
				}
			})
			setFormatedEnvio(envioCS)
		}
	},[dataConfigLocation])

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		const formattedData = {
			nombre: data.nombre,
			email: data.email,
			telefono: data.telefono,
			ubicacion: data.ubicacion,
			ubicaciones:ubicacionesSeleccionadas,
			tema_cita: data.tema_cita,
			descripcion: data.descripcion,
			perfil_pase: "Visita General",
			status_pase:"Proceso",
			visita_a: userNameSoter?? "",//userNameSoter,
			custom:true,
			link:{
				link : `${protocol}//${host}/dashboard/pase-update`,
				docs : formatedDocs,
				creado_por_id: userIdSoter ,// userIdSoter,
				creado_por_email: userEmailSoter,// userEmailSoter
			},
			enviar_correo_pre_registro: formatedEnvio, 
			tipo_visita_pase: tipoVisita,
			fechaFija: date !=="" ? formatDateToString(date):"",
			fecha_desde_visita: tipoVisita === "fecha_fija"? 
				(date !=="" ? formatDateToString(date): "") : 
				(data.fecha_desde_visita !== "" ? formatFecha(data.fecha_desde_visita)+` 00:00:00`: ""),
			fecha_desde_hasta: data.fecha_desde_hasta !=="" ? formatFecha(data.fecha_desde_hasta)+` 00:00:00` : "",
			config_dia_de_acceso: config_dia_de_acceso === "limitar_días_de_acceso" ? config_dia_de_acceso : "cualquier_día",
			config_dias_acceso: config_dias_acceso,
			config_limitar_acceso: Number(data.config_limitar_acceso) || 0,
			areas:areasList,
			comentarios: comentariosList,
			enviar_pre_sms:{
				from: "enviar_pre_sms",
				mensaje: "SOY UN MENSAJE",
				numero: data.telefono,
		},
		};
		if(tipoVisita == "fecha_fija" && date == ""){
			form.setError("fechaFija", { type: "manual", message: "Fecha Fija es requerida cuando el tipo de pase es 'fecha fija'." });
		}else if(tipoVisita == "rango_de_fechas" && (formattedData.fecha_desde_visita == "" || formattedData.fecha_desde_hasta == "" ) ){
			form.setError("fecha_desde_hasta", { type: "manual", message: "Ambas fechas son requeridas" });
		}else{
			setModalData(formattedData);
			setIsSuccess(true);
		}
		
	};

	const handleToggleAdvancedOptions = () => {
		setIsActiveAdvancedOptions(!isActiveAdvancedOptions);
	};

	const handleToggleTipoVisitaPase = (tipo:string) => {
		if ( tipo == "fecha_fija" ){
			form.setValue('fecha_desde_hasta', '')
			form.setValue('fecha_desde_visita', '')
			setIsActiveFechaFija(true)
			setIsActiveRangoFecha(false)
		} else {
			form.setValue('fechaFija', '')
			setDate("")
			setIsActiveFechaFija(false)
			setIsActiveRangoFecha(true)
		}
		setTipoVisita(tipo)
	};
	const handleToggleDiasAcceso = (tipo:string) => {
		if (tipo == "cualquier_día") {
			setIsActiveCualquierDia(true)
			setIsActiveLimitarDiasSemana(false)
		} else {
			setIsActiveCualquierDia(false)
			setIsActiveLimitarDiasSemana(true)
		}
		set_config_dia_de_acceso(tipo)
	};

	const handleToggleLimitarDias = () => {
		setIsActiveLimitarDias(!isActivelimitarDias);
	};

	const handleFechaDesdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFechaDesde(e.target.value);
		form.setValue('fecha_desde_hasta', '');
	};

	function getNextDay(date: string | number | Date) {
		const currentDate = new Date(date);
		currentDate.setDate(currentDate.getDate() + 1); 
		return currentDate.toISOString().split('T')[0]; 
	}

	const closeModal = () => {
		setIsSuccess(false); 
	};

	const openModalContactos = () => setOpenModal(true);
	const closeModalContactos = () => setOpenModal(false);

return (
	<div className="p-8">
		<EntryPassModal
			title={"Confirmación"}
			dataPass={modalData}
			isSuccess={isSuccess}
			setIsSuccess={setIsSuccess}
			onClose={closeModal}
		/>

		<div className="flex flex-col space-y-5 max-w-3xl mx-auto">
			<div className="text-center">
				<h1 className="font-bold text-2xl">Crear pase de entrada</h1>
			</div>

			<div className="flex justify-between flex-col sm:flex-row">
				<p className="font-bold text-xl">Sobre la visita</p>
				<Button
					className="bg-blue-500 text-white hover:text-white hover:bg-blue-600 w-40"
					variant="outline"
					onClick={openModalContactos}
				>
					<List size={36} />
					Mis contactos
				</Button>
				<MisContactosModal title="Mis Contactos" setSelected={setSelected} isOpenModal={isOpenModal} closeModal={closeModalContactos}>
				</MisContactosModal> 

			</div>

			<div className="">
				<p className="font-bold">Tipo de pase : <span className="font-normal" > Visita General</span></p>
			</div>

			<Form {...form}>
				<form className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{selected && (
							<><Image
								className="dark:invert h-32 w-32 object-cover rounded-full bg-gray-300"
								src={ selected.fotografia && selected.fotografia[0]?.file_url !== "" ? selected.fotografia[0]?.file_url 
								: '/nouser.svg'}
								alt="Next.js logo"
								width={150}
								height={50}
							/></>
						)}

						<FormField
							control={form.control}
							name="nombre"
							render={({ field}:any)=> (
								<FormItem>
									<FormLabel className="">
										<span className="text-red-500">*</span> Nombre Completo:
									</FormLabel>{" "}
									<FormControl>
										<Input placeholder="Nombre Completo" {...field} 
										/>
									</FormControl>
								<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<FormField
							control={form.control}
							name="email"
							render={({ field }: any) => (
							<FormItem>
								<FormLabel className="">
								<span className="text-red-500">*</span> Email:
								</FormLabel>{" "}
								<FormControl>
								<Input placeholder="example@example.com" {...field}
								onChange={(e) => {
									field.onChange(e);
								}}
								/>
								</FormControl>
								<FormMessage />
							</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="telefono"
							render={({ field }: any) => (
							<FormItem>
								<FormLabel>
								<span className="text-red-500">*</span> Teléfono
								</FormLabel>
								<FormControl>
								<PhoneInput
									{...field}
									// value={`${selected?.telefono||""}`}
									onChange={(value:string) => {
									form.setValue("telefono", value || "");
									}}
									placeholder="Teléfono"
									defaultCountry="MX"
									international={false}
									withCountryCallingCode={false}
									containerComponentProps={{
									className:
										"flex h-10 w-full rounded-md border border-input bg-background pl-3 py-0 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
									}}
									numberInputProps={{
									className: "pl-3",
									}}
								/>
								</FormControl>
								<FormMessage />
							</FormItem>
							)}
						/>

						{/* <FormField
							control={form.control}
							name="ubicacion"
							render={() => (
						
							<FormItem>
								<FormLabel>Ubicación:</FormLabel>
								<div className="flex flex-wrap gap-2 flex-col sm:flex-row">
									{ubicaciones?.map((ubicacion:string, index:number) => {
									const isSelected = ubicacionesSeleccionadas.includes(ubicacion);
									const toggleUbicacion = () => {
										setUbicacionSeleccionada(ubicacion)
										setUbicacionesSeleccionadas(prev =>
										isSelected
											? prev.filter(u => u !== ubicacion)
											: [...prev, ubicacion]
										);
									};
									return (
										<Button
										key={index}
										type="button"
										onClick={toggleUbicacion}
										className={`px-4 py-2 rounded-md transition-all duration-300 ${
										isSelected ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"}
								 		hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)] mr-2`}
										>
										<div className="flex flex-wrap items-center">
										{isSelected ? (
												<><div className="">{ubicacion}</div></>
											):(
												<><div className="text-blue-600">{ubicacion}</div></>
											)}
										</div>
										</Button>
									);
									})}
								</div>
								<FormMessage />
							</FormItem>
							)}
						/> */}

						<div className="mt-0">
							<div className="text-sm mb-2">Ubicaciones del pase: </div>
							<Multiselect
							options={ubicacionesFormatted} 
							selectedValues={ubicacionesDefault}
							onSelect={(selectedList) => {
								setUbicacionesSeleccionadas(selectedList);
							}}
							onRemove={(selectedList) => {
								setUbicacionesSeleccionadas(selectedList);
							}}
							displayValue="name"
							/>
						</div>
						
						<FormField
							control={form.control}
							name="tema_cita"
							render={({ field }:any) => (
							<FormItem>
								<FormLabel className="">
									Tema cita:
								</FormLabel>{" "}
								<FormControl>
								<Input placeholder="" {...field}
								/>
								</FormControl>
								<FormMessage />
							</FormItem>
							)}
						/>
					</div>
				

					<div className="grid gap-5">
						<FormField
						control={form.control}
						name="descripcion"
						render={({ field }:any) => (
							<FormItem>
							<FormLabel className="">
								Descripción:
							</FormLabel>{" "}
							<FormControl>
							<Textarea
								placeholder="Escribe un comentario"
								{...field}
								rows={2}
								/>
							</FormControl>
							<FormMessage />
							</FormItem>
						)}
						/>         
					</div>
					
					{/* <div className="flex gap-2 flex-col">
						<FormLabel className="mb-2">
							Selecciona una opción:
						</FormLabel>
						<div className="flex gap-2">
							<div className="flex gap-2 flex-wrap">
								<Button
								type="button"
								onClick={handleToggleEmail}
								className={`px-4 py-2 rounded-md transition-all duration-300 ${
									isActive ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
								} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
								>
								<div className="flex flex-wrap items-center">
									{isActive ? (
									<>
										<Mail className="mr-3" />
										<div>Enviar por correo</div>
									</>
									) : (
									<>
										<Mail className="mr-3 text-blue-600" />
										<div className="text-blue-600">Enviar por correo</div>
									</>
									)}
								</div>
								</Button>
							</div>
							<div className="flex gap-2 flex-wrap">
								<Button
								type="button"
								onClick={handleToggleSMS}
								className={`px-4 py-2 rounded-md transition-all duration-300 ${
									isActiveSMS ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
								} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
								>
								<div className="flex flex-wrap items-center">
									{isActiveSMS ? (
									<>
										<MessageCircleMore className="mr-3" />
										<div>Enviar por sms</div>
									</>
									) : (
									<>
										<MessageCircleMore className="mr-3 text-blue-600" />
										<div className="text-blue-600">Enviar por SMS</div>
									</>
									)}
								</div>
								</Button>
							</div>
						</div>
						
					</div> */}

					<h1 className="font-bold text-xl">Sobre vigencia y acceso</h1>
					<div className="flex items-center flex-wrap gap-5">
					<FormLabel>Visita de: </FormLabel>
					<Controller
						control={form.control}
						name="tipo_visita_pase"
						render={() => (
							<FormItem>
							<Button
								type="button"
								onClick={()=>{handleToggleTipoVisitaPase("fecha_fija")}}
								className={`px-4 py-2 rounded-md transition-all duration-300 ${
								isActiveFechaFija ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
								} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)] mr-2`}
							>
								<div className="flex flex-wrap items-center">
								{isActiveFechaFija ? (
									<><div className="">Fecha Fija</div></>
								):(
									<><div className="text-blue-600">Fecha Fija</div></>
								)}
									
								</div>
							</Button>
							<Button
								type="button"
								onClick={()=>{handleToggleTipoVisitaPase("rango_de_fechas")}}
								className={`px-4 py-2 rounded-md transition-all duration-300 ${
								isActiveRangoFecha ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
								} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]  mr-2`}
							>
								<div className="flex flex-wrap items-center">
								{isActiveRangoFecha ? (
									<><div className="">Rango de Fechas</div></>
								):(
									<><div className="text-blue-600">Rango de Fechas</div></>
								)}
									
								</div>
							</Button>
							{tipoVisita === "rango_de_fechas" && (
								<Button
								type="button"
								onClick={()=>{handleToggleLimitarDias()}}
								className={`px-4 py-2 rounded-md transition-all duration-300 ${
									isActivelimitarDias ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
								} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
								>
								<div className="flex flex-wrap items-center">
									{isActivelimitarDias ? (
									<><div className="">Limitar Días</div></>
									):(
									<><div className="text-blue-600">Limitar Días</div></>
									)}
									
								</div>
								</Button>
							)}
							<FormMessage />
							</FormItem>
						)}
						/>
					</div>

					<div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{tipoVisita === "fecha_fija" && (
							<FormField
								control={form.control}
								name="fechaFija"
								render={() => (
									<FormItem>
										<FormLabel>
											<span className="text-red-500">*</span> Fecha y Hora de
											Visita:
										</FormLabel>
										<FormControl>
											<DateTime date={date} setDate={setDate} />
										</FormControl>
									<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{tipoVisita === "rango_de_fechas" && (
							<><div className="grid grid-cols-1 md:grid-cols-1 gap-2">
							<FormField
								control={form.control}
								name="fecha_desde_visita"
								render={({ field }:any) => (
								<FormItem>
									<FormLabel>
									<span className="text-red-500">*</span> Fecha y Hora
									de Visita:
									</FormLabel>
									<FormControl>
									<Input
										type="date"
										{...field}
										min={new Date().toISOString().split('T')[0]} // Corta el exceso de datos
										onChange={(e) => {
										field.onChange(e); // Propagar el valor a react-hook-form
										handleFechaDesdeChange(e); // Guardar la fecha seleccionada en el estado

										}}
									/>
									</FormControl>
									<FormMessage />
								</FormItem>
								)} />
							<FormField
								control={form.control}
								name="fecha_desde_hasta"
								render={({ field }:any) => (
								<FormItem>
									<FormLabel>
									<span className="text-red-500">*</span> Fecha y Hora
									Hasta:
									</FormLabel>
									<FormControl>
									<Input
										type="date"
										{...field}
										min={fechaDesde ? getNextDay(fechaDesde) : new Date().toISOString().split('T')[0]}
										disabled={!fechaDesde}
										onChange={(e) => {
										field.onChange(e); 
										}}
									/>
									</FormControl>
									<FormMessage />
								</FormItem>
								)} />
							</div>
							</>
						)}
						</div>

						{tipoVisita === "rango_de_fechas" && (
							<><div className="grid  gap-5 mt-3">
								<FormField
									control={form.control}
									name="config_dia_de_acceso"
									render={() => (
										<FormItem>
											<FormLabel>Días de acceso:</FormLabel>
											<Controller
												control={form.control}
												name="config_dia_de_acceso"
												render={({ }) => (
													<FormItem>
													<Button
														type="button"
														onClick={()=>{handleToggleDiasAcceso("cualquier_día")}}
														className={`px-4 py-2 rounded-md transition-all duration-300 ${
														isActiveCualquierDia ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
														} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)] mr-2`}
													>
														<div className="flex flex-wrap items-center">
														{isActiveCualquierDia ? (
															<><div className="">Cualquier Día</div></>
														):(
															<><div className="text-blue-600">Cualquier Día</div></>
														)}
														</div>
													</Button>
													<Button
														type="button"
														onClick={()=>{handleToggleDiasAcceso("limitar_días_de_acceso")}}
														className={`px-4 py-2 rounded-md transition-all duration-300 ${
														isActivelimitarDiasSemana ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
														} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]  mr-2`}
													>
														<div className="flex flex-wrap items-center">
														{isActivelimitarDiasSemana ? (
															<><div className="">Limitar Días de Acceso</div></>
														):(
															<><div className="text-blue-600">Limitar Días de Acceso</div></>
														)}
														</div>
													</Button>
													<FormMessage />
													</FormItem>
												)}
											/>
											<FormMessage />
										</FormItem>
									)} 
								/>

								{config_dia_de_acceso === "limitar_días_de_acceso" && (
								<div>
									<FormLabel>Seleccione los días de acceso:</FormLabel>
										<div className="flex flex-wrap mt-2 mb-5">
											{[
											"Lunes",
											"Martes",
											"Miércoles",
											"Jueves",
											"Viernes",
											"Sábado",
											"Domingo"
											].map((dia) => {
											return (
												<FormItem key={dia.toLowerCase()} className="flex items-center space-x-3">
													<FormControl>
														<Button
														type="button"
														onClick={() => toggleDia(dia.toLocaleLowerCase())}
														className={`m-2 px-4 py-2 rounded-md transition-all duration-300 
														${config_dias_acceso.includes(dia.toLowerCase()) ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-white"}
														hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
														>
															<div className="flex flex-wrap">
																{config_dias_acceso.includes(dia.toLowerCase()) ? (
																	<><div className="">{dia}</div></>
																) : (
																	<><div className="text-blue-600">{dia}</div></>
																)}
															</div>
														</Button>
													</FormControl>
												</FormItem>
											);
											})}
										</div>
								</div>
								)}
							</div>

						{isActivelimitarDias && (
							<div className="w-1/3 mt-3">
								<FormField
									control={form.control}
									name="config_limitar_acceso"
									render={({ field }:any) => (
										<FormItem>
											<FormLabel>Limitar número de accesos:</FormLabel>
												<FormControl>
													<Input
													placeholder="Ejemplo: 5"
													type="number"
													min={0} 
													step={1} 
													{...field} 
													value={field.value ? Number(field.value) : 0}
													onChange={(e) => {
														const newValue = e.target.value ? Number(e.target.value) : 0;
														field.onChange(newValue); 
													}}/>  
												</FormControl>
											<FormMessage />
										</FormItem>
									)} 
								/>
							</div>
						)}
						</>
						)}
					</div>


					<div className="flex gap-2 flex-col">
						<div className="flex gap-2 flex-wrap">
							<Button
							type="button"
							onClick={handleToggleAdvancedOptions}
							className={`px-4 py-2 rounded-md transition-all duration-300 ${
									isActiveAdvancedOptions ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
								} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
							>
							<div className="flex flex-wrap">
								{isActiveAdvancedOptions ? (
								<div>Áreas de acceso</div>
								) : (
								<div className="text-blue-600">Áreas de acceso</div>
								)}
							</div>
							</Button>
						</div>
					</div>
				</form>
			</Form>
			
			{isActiveAdvancedOptions&& (
				<><div className="font-bold text-xl">Areas de acceso:</div>
					<AreasList
						areas={areasList}
						setAreas={setAreasList}
						catAreas={catAreas}
						loadingCatAreas={loadingCatAreas} existingAreas={false} 
					/>
				</> 
			)}

			<div className="font-bold text-xl">Comentarios/ Instrucciones:</div>
			<ComentariosList
				comentarios={comentariosList}
				setComentarios={setComentariosList}
				tipo={"Pase"} 
			/>

			{loadingCatAreas == false && isLoadingConfigLocation == false && loadingUbicaciones == false ? (
				<><div className="text-center">
					<Button
						className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-2/3 md:w-1/2 lg:w-1/2"
						variant="secondary"
						type="button"
						onClick={(e)=>{e.preventDefault()
							form.handleSubmit(onSubmit)()
						}}
					>
						Siguiente
					</Button>
				</div></>
			):null}
		</div>
	</div>
);
};

export default PaseEntradaPage;