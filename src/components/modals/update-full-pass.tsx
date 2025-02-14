/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm,Controller } from "react-hook-form";
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

import { Mail, MessageCircleMore } from "lucide-react";
import { useCatalogoPaseLocation } from "@/hooks/useCatalogoPaseLocation";
import { useCatalogoPaseArea } from "@/hooks/useCatalogoPaseArea";
import { formatDateToString } from "@/lib/utils";
import { useGetConfSeguridad } from "@/hooks/useGetConfSeguridad";
import AreasList from "@/components/areas-list";
import { Areas, Comentarios } from "@/hooks/useCreateAccessPass";
import ComentariosList from "@/components/comentarios-list";
import DateTime from "@/components/dateTime";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { EntryPassModalUpdate } from "./add-pass-modal-update";

export const linkSchema = z.object({
	link: z.string().url({ message: "Por favor, ingresa una URL válida." }), 
	docs: z.array(z.string()).optional(),
	creado_por_id: z.number().int({ message: "El ID debe ser un número entero." }),  
	creado_por_email: z.string().email({ message: "Por favor, ingresa un correo electrónico válido." }), 
});

export const enviarPreSmsSchema = z.object({
	from: z.string().min(1, { message: "El campo 'from' no puede estar vacío." }),
	mensaje: z.string().min(1, { message: "El mensaje no puede estar vacío." }),  
	numero: z.string().optional()
});

export const comentariosSchema = z.array(
	z.object({
		tipo_comentario: z.string().optional(),      
		comentario_pase: z.string().optional(),      
	})
);

export const areasSchema = z.array(
	z.object({
		nombre_area: z.string().optional(),         
		comentario_area: z.string().optional(),     
	})
);

export const formSchema = z
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
		visita_a: z.string().min(1),
		custom: z.boolean().optional(),
		link: linkSchema,
		enviar_correo_pre_registro:z.array(
			z.enum(["enviar_correo_pre_registro", "enviar_sms_pre_registro"])
		).optional(),
		
		tipo_visita_pase: z.enum(["fecha_fija", "rango_de_fechas"], {
			required_error: "Seleccione un tipo de fecha.",
		}),
		fechaFija: z.string().optional(),
		fecha_desde_visita: z.string().optional(),
		fecha_desde_hasta: z.string().optional(),
		config_dia_de_acceso: z.enum(["cualquier_día", "limitar_días_de_acceso"], {
			required_error: "Seleccione un tipo de acceso.",
		}),
		config_dias_acceso: z.array(
				z.enum(["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"])
			).optional(),
		config_limitar_acceso: z.number().optional().refine((val) => (val ? !isNaN(Number(val)) && Number(val) > 0 : true), {
				message:
					"Ingrese un número válido mayor a 0 para el límite de accesos.",
			}),
		areas: areasSchema,
		comentarios:comentariosSchema,
		enviar_pre_sms: enviarPreSmsSchema,
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
		path: ['fecha_desde_hasta'], // Error para 'fecha_desde_hasta'
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

	interface updatedFullPassModalProps{
		dataPass:any;
		children: React.ReactNode;
	}

	function formatArea(arr: any[]) {
		return arr.map(a => {
			if ('nombre_area' in a) {
				return a;
			} else if ('note_booth' in a) {
				return { nombre_area: a.note_booth, comentario_area: a.commentario_area };
			}
			return a; 
		});
	}

const UpdateFullPassModal: React.FC<updatedFullPassModalProps> = ({ dataPass, children }) => {
	const [tipoVisita, setTipoVisita] = useState(dataPass.tipo_visita_pase || "fecha_fija");
	const [config_dias_acceso, set_config_dias_acceso] = useState<string[]>(dataPass.config_dias_acceso||[]);
	const [config_dia_de_acceso, set_config_dia_de_acceso] = useState(dataPass.config_dia_de_acceso);
	const [isSuccess, setIsSuccess] = useState(false);
	const [modalData, setModalData] = useState<any>(null);
	const { data: ubicaciones, isLoading: loadingUbicaciones } = useCatalogoPaseLocation();
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(dataPass.ubicacion);
	const { isLoading: loadingAreas} = useCatalogoPaseArea(ubicacionSeleccionada);
	const userEmailSoter = localStorage.getItem("userEmail_soter");
	const userIdSoter = parseInt(localStorage.getItem("userId_soter") || "0", 10);
	const [enviar_correo_pre_registro, set_enviar_correo_pre_registro] = useState<string[]>(dataPass.enviar_correo_pre_registro);
	const { data: configLocation, isLoading: loadingConfigLocation, refetch:refetchConfLocation } = useGetConfSeguridad(ubicacionSeleccionada);
	const [formatedDocs, setFormatedDocs] = useState<string[]>(configLocation)

	const [isActiveRangoFecha, setIsActiveRangoFecha] = useState(dataPass.tipo_visita_pase=="rango_de_fechas");
	const {data:catAreas, isLoading: loadingCatAreas, refetch:refetchAreas } = useCatalogoPaseArea(ubicacionSeleccionada)

	const [comentariosList, setComentariosList] = useState<Comentarios[]>(dataPass.comentarios);
	const [areasList, setAreasList] = useState<Areas[]>(formatArea(dataPass.areas));

	const [isActive, setIsActive] = useState(dataPass.enviar_correo_pre_registro.includes("enviar_correo_pre_registro"));
	const [isActiveSMS, setIsActiveSMS] = useState(dataPass.enviar_correo_pre_registro.includes("enviar_sms_pre_registro"));
	const [isActiveFechaFija, setIsActiveFechaFija] = useState(dataPass.tipo_visita_pase=="fecha_fija");
	const [isActivelimitarDias, setIsActiveLimitarDias] = useState(dataPass.config_limitar_acceso >0 ? true: false);

	const [isActiveCualquierDia, setIsActiveCualquierDia] = useState(true);
	const [isActivelimitarDiasSemana, setIsActiveLimitarDiasSemana] = useState(false);
	const [isActiveAdvancedOptions, setIsActiveAdvancedOptions] = useState(dataPass.areas.length>0);
	
	const [date, setDate] = React.useState<Date| "">(dataPass.tipo_visita_pase=="fecha_fija" ?
				new Date(dataPass.fecha_desde_visita): new Date(dataPass.fecha_desde_visita));
	const [fechaDesde, setFechaDesde] = useState<string>('');

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			_id:dataPass._id,
			folio:dataPass.folio,
			nombre: dataPass.nombre,
			email: dataPass.email ||"",
			telefono: dataPass.telefono||"",
			ubicacion: dataPass.ubicacion||"",
			tema_cita:dataPass.tema_cita||"",
			descripcion:dataPass.descripcion||"",
			perfil_pase: dataPass.perfil_pase||"",
			status_pase:dataPass.status_pase||"",
			visita_a: dataPass?.visita_a?.nombre||"",
			custom: true,
			link:{
				link : dataPass.link.link,
				docs : formatedDocs,
				creado_por_id: userIdSoter,
				creado_por_email: userEmailSoter
			},
			qr_pase: dataPass.qr_pase||[],
			limitado_a_dias	: dataPass.limitado_a_dias||[],
			enviar_correo_pre_registro:enviar_correo_pre_registro||[], 
			tipo_visita_pase: tipoVisita ||"",
			fechaFija: dataPass.tipo_visita_pase=="fecha_fija" ?
				dataPass.fechaFija: dataPass.fecha_desde_visita,
			fecha_desde_visita: dataPass.tipo_visita_pase==="fecha_fija"? 
				(dataPass.fechaFija || dataPass.fecha_desde_visita) : (dataPass.fecha_desde_visita),
			fecha_desde_hasta: dataPass.fecha_desde_hasta !=="" ? dataPass.fecha_desde_hasta: "",
			config_dia_de_acceso:config_dia_de_acceso === "limitar_días_de_acceso" ? config_dia_de_acceso : "cualquier_día",
			config_dias_acceso:config_dias_acceso,
			config_limitar_acceso: Number(dataPass.config_limitar_acceso) || 1,
			areas: areasList,
			comentarios: comentariosList,
			enviar_pre_sms:{
				from: "enviar_pre_sms",
				mensaje: "prueba",
				numero: dataPass.telefono,
			},
		},
	});

	const toggleDia = (dia: string) => {
		set_config_dias_acceso((prev) => {
			const updatedDias = prev.includes(dia)
				? prev.filter((d) => d !== dia) // Si ya está seleccionado, lo quitamos
				: [...prev, dia]; // Si no está seleccionado, lo añadimos
			return updatedDias;
		});
	};

	// useEffect(()=>{
	// 	console.log("Error",form.formState.errors)
	// },[form.formState.errors])


	useEffect(()=>{
		form.setValue("fecha_desde_visita", dataPass.fecha_desde_visita.split(" ")[0])
		form.setValue("fecha_desde_hasta", dataPass.fecha_desde_hasta.split(" ")[0])
	},[])


	useEffect(()=>{
		if(ubicacionSeleccionada){
			refetchConfLocation()
		}
	}, [refetchConfLocation, ubicacionSeleccionada])

	useEffect(()=>{
		if(ubicacionSeleccionada && isActiveAdvancedOptions){
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
		console.log("Formulario enviado con los siguientes datos:", data);

		const formattedData = {
			_id: dataPass._id,
			folio: dataPass.folio,
			nombre: data.nombre,
			email: data.email ||"",
			telefono: data.telefono||"",
			ubicacion: data.ubicacion||"",
			tema_cita:data.tema_cita||"",
			descripcion:data.descripcion||"",
			perfil_pase: dataPass.perfil_pase||"",
			status_pase:data.status_pase||"",
			visita_a: data?.visita_a ||"",
			custom: true,
			link:{
				link : dataPass.link.link,
				docs : formatedDocs,
				creado_por_id: userIdSoter,
				creado_por_email: userEmailSoter
			},
			qr_pase: dataPass.qr_pase||[],
			limitado_a_dias	: dataPass.limitado_a_dias||[],
			enviar_correo_pre_registro:enviar_correo_pre_registro||[], 
			tipo_visita_pase: tipoVisita ||"",
			config_dia_de_acceso:config_dia_de_acceso === "limitar_días_de_acceso" ? config_dia_de_acceso : "cualquier_día",
			config_dias_acceso:config_dias_acceso,
			config_limitar_acceso: Number(dataPass.config_limitar_acceso) || 1,
			areas: areasList,
			comentarios: comentariosList,
			enviar_pre_sms:{
				from: "enviar_pre_sms",
				mensaje: "prueba",
				numero: dataPass.telefono,
			},

			fechaFija: date !=="" ? formatDateToString(date):"",
			fecha_desde_visita: tipoVisita === "fecha_fija"? (date !=="" ? formatDateToString(date): "") : 
					(data.fecha_desde_visita !== "" ? data.fecha_desde_visita: ""),
			fecha_desde_hasta: data.fecha_desde_hasta ? data?.fecha_desde_hasta.split(" ")[0] : "",
			grupo_equipos: dataPass.grupo_equipos,
			grupo_vehiculos:dataPass.grupo_vehiculos
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
					? prev.filter((d) => d !== email) // Si ya está seleccionado, lo quitamos
					: [...prev, email]; // Si no está seleccionado, lo añadimos
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
					? prev.filter((d) => d !== sms) // Si ya está seleccionado, lo quitamos
					: [...prev, sms]; // Si no está seleccionado, lo añadimos
				return pre;
			});
		setIsActiveSMS(!isActiveSMS);
	};

	const handleToggleAdvancedOptions = () => {
		setIsActiveAdvancedOptions(!isActiveAdvancedOptions);
	};

	const handleToggleTipoVisitaPase = (tipo:string) => {
		if(tipo =="fecha_fija"){
			form.setValue('fecha_desde_hasta', '')
			form.setValue('fecha_desde_visita', '')
			setIsActiveFechaFija(true)
			setIsActiveRangoFecha(false)
		}else{
			form.setValue('fechaFija', '')
			setDate("")
			setIsActiveFechaFija(false)
			setIsActiveRangoFecha(true)
		}
		setTipoVisita(tipo)
	};

	const handleToggleDiasAcceso = (tipo:string) => {
		if(tipo =="cualquier_día"){
			setIsActiveCualquierDia(true)
			setIsActiveLimitarDiasSemana(false)
		}else{
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
		currentDate.setDate(currentDate.getDate() + 1); // Añadir un día
		return currentDate.toISOString().split('T')[0]; // Retornar la fecha en formato 'YYYY-MM-DD'
	}

	const closeModal = () => {
		setIsSuccess(false);  // Reinicia el estado para que el modal no se quede abierto.
	};

return (
	<Dialog >
		<DialogTrigger asChild>{children}</DialogTrigger>
		<DialogContent className="max-w-3xl max-h-[90vh] overflow-scroll">
			<DialogHeader>
				<DialogTitle className="text-2xl text-center  font-bold my-5">
					Editar pase
				</DialogTitle>
			</DialogHeader>


			<div className="p-8">
			<EntryPassModalUpdate
				title={"Confirmación"}
				dataPass={modalData}
				isSuccess={isSuccess}
				setIsSuccess={setIsSuccess}
				onClose={closeModal}
				id={dataPass._id}
				folio={dataPass.folio}
			/>

		<div className="flex flex-col space-y-5 max-w-3xl mx-auto">

			<div className="">
				<p className="font-bold">Tipo de pase : <span className="font-normal" > Visita General</span></p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					
						<FormField
							control={form.control}
							name="nombre"
							render={({ field }) => (
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
								render={({ field }) => (
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
								render={({ field}) => (
									<FormItem>
										<FormLabel>
											<span className="text-red-500">*</span> Teléfono
										</FormLabel>
										<FormControl>
											<PhoneInput
												{...field}
												onChange={(value: string) => {
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
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ubicación:</FormLabel>

										{ !loadingConfigLocation ? ( <>

										<FormControl>
											
												<Select
													onValueChange={(value:string) => {
														field.onChange(value); 
														setUbicacionSeleccionada(value);  
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
												{ubicaciones?.map((ubicacion:string, index:string) => (
													<SelectItem key={index} value={ubicacion}>
														{ubicacion}
													</SelectItem>
												))}
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
								render={({ field }) => (
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
							render={({ field }) => (
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
					</div>
					
					
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
										render={({ field }) => (
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
															field.onChange(e); 
															handleFechaDesdeChange(e); 

														}}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)} />
									<FormField
										control={form.control}
										name="fecha_desde_hasta"
										render={({ field }) => (
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
													render={() => (
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
									)} />

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
										render={({ field }) => (
											<FormItem>
												<FormLabel>Limitar número de accesos:</FormLabel>
												<FormControl>
													<Input
														placeholder="Ejemplo: 5"
														type="number" 
														min={0} 
														step={1} 
														{...field} 
														onChange={(e) => {
															const newValue = e.target.value ? Number(e.target.value) : 0;
															field.onChange(newValue); 
														}}/>  
												</FormControl>
												<FormMessage />
											</FormItem>
										)} />
								</div>
							)}
							</>
						)}
				</div>
					<FormField
							control={form.control}
							name="showAreas"
							value={"show_areas"}
							render={() => (
								<FormItem>
									<FormControl>
										<Button
											type="button"
											onClick={handleToggleAdvancedOptions}
											className={`px-4 py-2 rounded-md transition-all duration-300 ${
												isActiveAdvancedOptions ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
											} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
										>
											<div className="flex flex-wrap">
												{isActiveAdvancedOptions ? (
													<><div className="">Áreas de acceso</div></>
												):(
													<><div className="text-blue-600">Áreas de acceso</div></>
												)}
													
											</div>
										</Button>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

				</form>
				</Form>
					{isActiveAdvancedOptions&& (
						<><div className="font-bold text-xl">Areas de acceso:</div>
							<AreasList
								areas={areasList}
								setAreas={setAreasList}
								location={ubicacionSeleccionada}
								catAreas={catAreas}
								loadingCatAreas={loadingCatAreas} 
								existingAreas={true}/>
						</> ) }
							<div className="font-bold text-xl">Comentarios/ Instrucciones:</div>
							<ComentariosList
								comentarios={comentariosList}
								setComentarios={setComentariosList}
								tipo={"Pase"}
							/>

					{loadingAreas == false && loadingConfigLocation == false && loadingUbicaciones == false ? (<>
						<div className="text-center">
						<Button
							className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-2/3 md:w-1/2 lg:w-1/2"
							variant="secondary"
							type="submit"
							onClick={form.handleSubmit(onSubmit)}>
							Siguiente
						</Button>
					</div>
					</>):null}
				</div>
			</div>
	</DialogContent>
	</Dialog>
);
};

export default UpdateFullPassModal;