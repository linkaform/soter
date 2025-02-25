'use client'; 

import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { EntryPassModal } from "@/components/modals/add-pass-modal";
import { List, Mail, MessageCircleMore } from "lucide-react";
import { useCatalogoPaseLocation } from "@/hooks/useCatalogoPaseLocation";
import { useCatalogoPaseArea } from "@/hooks/useCatalogoPaseArea";
import { formatDateToString, formatFecha } from "@/lib/utils";
import { useGetConfSeguridad } from "@/hooks/useGetConfSeguridad";
import AreasList from "@/components/areas-list";
import { Areas, Comentarios } from "@/hooks/useCreateAccessPass";
import ComentariosList from "@/components/comentarios-list";
import DateTime from "@/components/dateTime";
import { MisContactosModal } from "@/components/modals/user-contacts";
import Image from "next/image";
import { Contacto } from "@/lib/get-user-contacts";
// import useAuthStore from "@/store/useAuthStore";

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
	ubicacion: z.string().min(1, {
	 	 message: "Por favor, ingresa una ubicación válida.",
	}),
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
	// const {userEmailSoter, userNameSoter , userIdSoter}= useAuthStore()
	const [tipoVisita, setTipoVisita] = useState("fecha_fija");
	const [config_dias_acceso, set_config_dias_acceso] = useState<string[]>([]);
	const [config_dia_de_acceso, set_config_dia_de_acceso] = useState("cualquier_día");
	const [isSuccess, setIsSuccess] = useState(false);
	const [modalData, setModalData] = useState<any>(null);
	const { data: ubicaciones, isLoading: loadingUbicaciones } = useCatalogoPaseLocation();
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');
	const {  isLoading: loadingAreas} = useCatalogoPaseArea(ubicacionSeleccionada);


	// const protocol = window.location.protocol;  
	// const host = window.location.host;  
	const[ userIdSoter] = useState<number|null>(()=>{
			return Number(typeof window !== "undefined"? window.localStorage.getItem("userId_soter"):0) 
	});

	const[userNameSoter] = useState<string|null>(()=>{
		return typeof window !== "undefined"? window.localStorage.getItem("userName_soter"):""
	})
	const [userEmailSoter] = useState<string|null>(()=>{
		return typeof window !== "undefined"? window.localStorage.getItem("userEmail_soter"):""
	})

	const [host] = useState(()=>{
		return typeof window !== "undefined"? window.location.host:""
	});
	const [protocol] = useState(()=>{
		return typeof window !== "undefined"? window.location.protocol:""
	});

	const { data: configLocation, isLoading: loadingConfigLocation, refetch:refetchConfLocation } = useGetConfSeguridad(ubicacionSeleccionada);
	const {data:catAreas, isLoading: loadingCatAreas, refetch:refetchAreas } = useCatalogoPaseArea(ubicacionSeleccionada)

	const [enviar_correo_pre_registro, set_enviar_correo_pre_registro] = useState<string[]>([]);
	const [formatedDocs, setFormatedDocs] = useState<string[]>([])
	const [comentariosList, setComentariosList] = useState<Comentarios[]>([]);
	const [areasList, setAreasList] = useState<Areas[]>([]);
	const [isActive, setIsActive] = useState(false);
	const [isActiveSMS, setIsActiveSMS] = useState(false);
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

	// useEffect(() => {
	// 	if (typeof window !== "undefined") {
	// 	  const protocol = window.location.protocol;
	// 	  const host = window.location.host;
	// 	  setHostPro({ protocol, host });
  
	// 	  //const {userIdSoter,userEmailSoter, userNameSoter} = useAuthStore();
	// 	  console.log(window.localStorage.getItem("userEmail_soter"),window.localStorage.getItem("userName_soter") ,window.localStorage.getItem("userId_soter"))
	// 	  setUserIdSoter(Number(window.localStorage.getItem("userId_soter")));
	// 	  setUserNameSoter(window.localStorage.getItem("userName_soter"));
	// 	  setUserEmailSoter(window.localStorage.getItem("userEmail_soter"));
	// 	}
	//   }, []);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: "",
			email: "",
			telefono: "",
			ubicacion:"",
			tema_cita:"",
			descripcion:"",
			perfil_pase: "Visita General",
			status_pase:"Proceso",
			// userNameSoter??
			visita_a: userNameSoter ?? "",
			custom: true,
			link:{
				link :`${protocol}//${host}/dashboard/pase-update`,
				docs : formatedDocs,
				// userIdSoter||
				creado_por_id: userIdSoter || 0,
				// userEmailSoter ??
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
		if ( form.formState.errors ) {
			console.log("enviar_correo_pre_registro",form.getValues("link"))
			console.log("form.formState.errors",form.formState.errors, userEmailSoter,userIdSoter, formatedDocs )
		}
	}, [form.formState.errors])

	useEffect(()=>{
		if ( ubicacionSeleccionada ) {
			refetchConfLocation()
		}
	}, [ubicacionSeleccionada, refetchConfLocation])

	useEffect(()=>{
		if ( ubicacionSeleccionada && isActiveAdvancedOptions ) {
			refetchAreas()
		}
	}, [ubicacionSeleccionada, isActiveAdvancedOptions, refetchAreas])

	useEffect(()=>{
		if(configLocation){
		const docs: string[] = []
		configLocation?.map((value:string)=>{
			if(value=="identificacion") {
				docs.push("agregarIdentificacion")}
			if(value=="fotografia") {
				docs.push("agregarFoto")}
		})
		setFormatedDocs(docs)
		}
	},[configLocation])

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		console.log("Formulario enviado con los siguientes datos:", data, userEmailSoter,userIdSoter, formatedDocs );
		const formattedData = {
			nombre: data.nombre,
			email: data.email,
			telefono: data.telefono,
			ubicacion: data.ubicacion,
			tema_cita: data.tema_cita,
			descripcion: data.descripcion,
			perfil_pase: "Visita General",
			status_pase:"Proceso",
			visita_a: userNameSoter?? "",//userNameSoter,
			custom:true,
			link:{
				link : data.link.link,
				docs : formatedDocs,
				creado_por_id: userIdSoter ,// userIdSoter,
				creado_por_email: userEmailSoter,// userEmailSoter
			},
			enviar_correo_pre_registro: enviar_correo_pre_registro, 
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

	const handleToggleEmail = () => {
		if (form.getValues("email")=="") { 
			form.setError("email", { type: "manual", message: "El campo email debe tener datos." });
		} else {
			form.clearErrors("email");
		}

		const email= "enviar_correo_pre_registro"
		set_enviar_correo_pre_registro((prev) => {
			const pre = prev.includes(email)
			? prev.filter((d) => d !== email) 
			: [...prev, email];
			return pre;
		});
		setIsActive(!isActive);

	};

	const handleToggleSMS = () => {
		if (!form.getValues("telefono")) {
			form.setError("telefono", { type: "manual", message: "El campo telefono debe tener datos." });
		} else {
			form.clearErrors("telefono");
		}
		const sms= "enviar_sms_pre_registro"
		set_enviar_correo_pre_registro((prev) => {
			const pre = prev.includes(sms)
			? prev.filter((d) => d !== sms)
			: [...prev, sms];
			return pre;
		});
		setIsActiveSMS(!isActiveSMS);
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

			<div className="flex justify-between">
				<p className="font-bold text-xl">Sobre la visita</p>
				
				<Button
					className="bg-blue-500 text-white hover:text-white hover:bg-blue-600"
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
						<FormField
							control={form.control}
							name="ubicacion"
							render={({ field }:any) => (
							<FormItem>
								<FormLabel>Ubicación:</FormLabel>

								{ !loadingConfigLocation ? ( <>

								<FormControl>
								
									<Select
									onValueChange={(value:string) => {
										field.onChange(value); 
										setUbicacionSeleccionada(value);  // Actualiza el estado
										// handleSelectLocation(value)
									}}
									value={field.value} 
									>
									<SelectTrigger className="w-full">
									{loadingAreas?(
									<>
									<SelectValue placeholder="Cargando ubicaciónes..." />
									</>
									): (
									<>
									<SelectValue placeholder="Selecciona una ubicación" />
									</>
									)}
									</SelectTrigger>
									<SelectContent>
									{Array.isArray(ubicaciones) && (
										<>
										{ubicaciones.map((ubicacion: string, index: number) => (
											<SelectItem key={index} value={ubicacion}>
											{ubicacion}
											</SelectItem>
										))}
										</>
									)}
									</SelectContent>
								</Select>
								
								</FormControl>

								</>):(<>
								<div role="status">
									<svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
										<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
									</svg>
									<span className="sr-only">Cargando...</span>
								</div>
								</>)}
								<FormMessage />
							</FormItem>
							)}
						/>
						
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
					
					<div className="flex gap-2 flex-col">
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
								} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}  //hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]
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
								} hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
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
						
					</div>

					{/* <div className="flex gap-2 flex-col">
						<FormLabel className="mb-2">
							Selecciona una opción:
						</FormLabel>
						<div className="flex gap-2 flex-wrap">
						<Controller
						control={form.control}
						name="toggleFieldEmail"
						render={() => (
								<FormItem>
								<FormControl>
									<Button
									type="button"
									onClick={handleToggleEmail}
									className={`px-4 py-2 rounded-md transition-all duration-300 ${
										isActive ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent "
									} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
									>
									<div className="flex flex-wrap items-center">
										{isActive ? (
										<><Mail className="mr-3" /><div className="">Enviar por correo</div></>
										):(
										<><Mail className="mr-3 text-blue-600" /><div className="text-blue-600">Enviar por correo</div></>
										)}
										
									</div>
									</Button>
								</FormControl>
								<FormMessage />
								</FormItem>
							)}
							/>
						<Controller
						control={form.control}
						name="toggleFieldSMS"
						render={() => (
								<FormItem>
								<FormControl>
									<Button
									type="button"
									onClick={handleToggleSMS}
									className={`px-4 py-2 rounded-md transition-all duration-300 ${
										isActiveSMS ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
									} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
									>
									<div className="flex flex-wrap items-center">
										{isActiveSMS ? (
										<><MessageCircleMore className="mr-3 text-white" /><div className="">Enviar por sms</div></>
										):(
										<><MessageCircleMore className="mr-3 text-blue-600" /><div className="text-blue-600">Enviar por sms</div></>
										)}
										
									</div>
									</Button>
								</FormControl>
								<FormMessage />
								</FormItem>
							)}
							/>
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
										field.onChange(e); // Propagar el valor a react-hook-form

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
						{/* Botón Toggle sin FormField */}
						<div className="flex gap-2 flex-wrap">
							<Button
							type="button"
							onClick={handleToggleAdvancedOptions}
							className={`px-4 py-2 rounded-md transition-all duration-300 ${
								isActiveAdvancedOptions ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
							} hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
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
						location={ubicacionSeleccionada}
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

			{loadingAreas == false && loadingConfigLocation == false && loadingUbicaciones == false ? (
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