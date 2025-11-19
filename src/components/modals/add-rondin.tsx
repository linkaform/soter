/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import DateTime from "../dateTime";
import { Loader2 } from "lucide-react";
import { useRondines } from "@/hooks/Rondines/useRondines";
import { Input } from "../ui/input";
import { format } from "date-fns";
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import { useShiftStore } from "@/store/useShiftStore";
import { useCatalogAreasRondin } from "@/hooks/Rondines/useCatalogAreasRondin";
import { capitalizeFirstLetter } from "@/lib/utils";

interface AddRondinModalProps {
  	title: string;
    children: React.ReactNode;
}
  
  export type RondinPayload = {
	nombre_rondin: string;
	duracion_estimada: string;
	ubicacion: string;
	areas: any[];
	grupo_asignado: string;
	fecha_hora_programada: string;
	programar_anticipacion: string;
	cuanto_tiempo_de_anticipacion: string;
	cuanto_tiempo_de_anticipacion_expresado_en: string;
	tiempo_para_ejecutar_tarea: number;
	tiempo_para_ejecutar_tarea_expresado_en: string;
	la_tarea_es_de: string;
  
	se_repite_cada?: string;
	sucede_recurrencia?: [];
  
	en_que_minuto_sucede?: string;
	cada_cuantos_minutos_se_repite?: string;
  
	en_que_hora_sucede?: string;
	cada_cuantas_horas_se_repite?: string;
  
	que_dias_de_la_semana?: string[];
	en_que_semana_sucede?: string;
  
	que_dia_del_mes?: string;
	cada_cuantos_dias_se_repite?: string;
  
	en_que_mes?: string;
	cada_cuantos_meses_se_repite?: number;
  
	la_recurrencia_cuenta_con_fecha_final?: string;
	fecha_final_recurrencia?: string;
	cron_config:string;
	accion_recurrencia: string;
  };
  
//   const recurrenciaKeys = {
// 	diario: ["que_dias_de_la_semana","se_repite_cada","en_que_semana_sucede","sucede_recurrencia"],
// 	semana: ["se_repite_cada","que_dias_de_la_semana","en_que_semana_sucede","sucede_recurrencia"],
// 	mes: ["se_repite_cada","que_dia_del_mes","sucede_recurrencia","en_que_mes"],
// 	MensualDiaSemana: ["se_repite_cada","que_dias_de_la_semana","sucede_recurrencia","en_que_semana_sucede","en_que_mes"],
// 	configurable: ["se_repite_cada", "cron_config"],
//   } as const;


const formSchema = z.object({
    nombre_rondin:z.string().optional(),
    duracion_estimada: z.string().optional(),
    ubicacion: z.string().optional(),
    areas: z.array(z.string().optional()),
    grupo_asignado:z.string().optional(),
    fecha_hora_programada: z.string().optional(),
    programar_anticipacion: z.string().optional(),
    cuanto_tiempo_de_anticipacion:z.string().optional(),
    cuanto_tiempo_de_anticipacion_expresado_en:z.string().optional(),
    tiempo_para_ejecutar_tarea:z.number().optional(),
    tiempo_para_ejecutar_tarea_expresado_en:z.string().optional(),
    la_tarea_es_de: z.string().optional(),
    se_repite_cada:z.string().optional(),
    sucede_cada:z.string().optional(),
    sucede_recurrencia: z.array(z.string().optional()),
    en_que_minuto_sucede:z.string().optional(),
    cada_cuantos_minutos_se_repite:z.string().optional(),
    en_que_hora_sucede:z.string().optional(),
    cada_cuantas_horas_se_repite:z.string().optional(),
    que_dias_de_la_semana: z.array(z.string().optional()),
    en_que_semana_sucede:z.string().optional(),
    que_dia_del_mes:z.string().optional(),
    cada_cuantos_dias_se_repite:z.string().optional(),
    en_que_mes:z.array(z.string().optional()),
    cada_cuantos_meses_se_repite:z.number().optional(),
    la_recurrencia_cuenta_con_fecha_final: z.string().optional(),
    fecha_final_recurrencia:z.string().optional(),
	accion_recurrencia:z.string().optional()
});

export const AddRondinModal: React.FC<AddRondinModalProps> = ({
  	title,
    children
}) => {
    const [isSuccess, setIsSuccess] = useState(false);
	const { location } = useShiftStore()
	const [areasSeleccionadas, setAreasSeleccionadas] = useState<any[]>([]);
	const { createRondinMutation, isLoading} = useRondines()
	const { data:catalogAreasRondin} = useCatalogAreasRondin(location, isSuccess)
	const [date, setDate] = useState<Date|"">("");
	const [que_dias_de_la_semana , set_que_dias_de_la_semana] =useState<string[]>([])
	const [en_que_semana_sucede, set_en_que_semana_sucede] = useState<string>("");
	const [en_que_mes, set_en_que_mes] = useState<string[]>([])
	const [todas_las_semanas, set_todas_las_semanas] =useState(false)
	const [todas_las_meses, set_todas_las_meses] =useState(false)
	const [esRepetirCada, setEsRepetirCada] = useState<boolean | null>(null);
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
            nombre_rondin: '',
            duracion_estimada: '',
            ubicacion: '',
            areas: [],
            grupo_asignado: '',
            fecha_hora_programada: '',
            programar_anticipacion: '',
            cuanto_tiempo_de_anticipacion: '',
            cuanto_tiempo_de_anticipacion_expresado_en: '',
            tiempo_para_ejecutar_tarea: 30,
            tiempo_para_ejecutar_tarea_expresado_en: '',
            la_tarea_es_de: '',
            se_repite_cada: '',
            sucede_cada: '',
            sucede_recurrencia: [],
            en_que_minuto_sucede: '',
            cada_cuantos_minutos_se_repite: '',
            en_que_hora_sucede: '',
            cada_cuantas_horas_se_repite: '',
            que_dias_de_la_semana: que_dias_de_la_semana,
            en_que_semana_sucede: en_que_semana_sucede,
            que_dia_del_mes: '',
            cada_cuantos_dias_se_repite: '',
            en_que_mes: en_que_mes,
            cada_cuantos_meses_se_repite: 0,
            la_recurrencia_cuenta_con_fecha_final: '',
            fecha_final_recurrencia: '',
            accion_recurrencia:'programar'
		},
	});
	const { reset } = form;
	
	console.log(form.formState.errors);

	useEffect(()=>{
		if(isSuccess){
			set_que_dias_de_la_semana([])
			set_en_que_semana_sucede("")
			set_todas_las_semanas(false)
			set_en_que_mes([])
			reset()
		}
	},[isSuccess])

	useEffect(()=>{
		if(esRepetirCada){
			set_en_que_mes([])
		}
	},[esRepetirCada])

	const diasSemana = [
		"lunes",
		"martes",
		"miercoles",
		"jueves",
		"viernes",
		"sabado",
		"domingo",
	  ];

	  const mesesDelAño = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre"];

	function onSubmit(values: z.infer<typeof formSchema>) {
		// REVISAR LA CREACION DE RONDIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
		//HACER PRUEBAS CON EL CODIGO AGREGADO PARA CREA RONDINES
		if (!date) {
		  form.setError("fecha_hora_programada", { type: "manual", message: "Fecha es obligatoria" });
		  return;
		}
		const formattedDate = format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
		const areas = areasSeleccionadas.map(e => e.id);
		const recurrenciaFiltrada = obtenerRecurrencia(values);
		const payload = {
			nombre_rondin: values.nombre_rondin,
			duracion_estimada: values.duracion_estimada + " minutos",
			ubicacion: location,
			areas,
			grupo_asignado: "",
			fecha_hora_programada: formattedDate,
			programar_anticipacion: "no",
			cuanto_tiempo_de_anticipacio: "",
			cuanto_tiempo_de_anticipacion_expresado_en: "",
			tiempo_para_ejecutar_tarea: 30,
			tiempo_para_ejecutar_tarea_expresado_en: "minutos",
			la_tarea_es_de: "cuenta_con_una_recurrencia",
			la_recurrencia_cuenta_con_fecha_final: "no",
			fecha_final_recurrencia: "",
			accion_recurrencia: "programar",
			se_repite_cada:values.se_repite_cada,
		  ...recurrenciaFiltrada
		};
		console.log("PAYLOAD", payload)
		createRondinMutation.mutate({ rondin_data: payload } ,{
			onSuccess: () => {
			  setIsSuccess(false);
			},
		  });
	}

	const handleClose = () => {
		setIsSuccess(false); 
	};
	const recurrencia = useWatch({
		control:form.control,
		name: "se_repite_cada"
	})

	useEffect(()=>{
		set_que_dias_de_la_semana([])
		set_en_que_semana_sucede("")
		set_todas_las_semanas(false)
		set_en_que_mes([])
	},[recurrencia])

	function toggleDia(dia: string) {
		set_que_dias_de_la_semana((prev: string[]) => {
		  if (prev.includes(dia)) {
			return prev.filter((d: string) => d !== dia);
		  } else {
			return [...prev, dia];
		  }
		});
	  }

	const toggleTodos = () => {
		if (que_dias_de_la_semana.length === diasSemana.length) {
		  set_que_dias_de_la_semana([]);
		} else {
		  set_que_dias_de_la_semana(diasSemana.map((d) => d.toLowerCase()));
		}
	  };

	const toggleSemana = (semana: string) => {
		set_en_que_semana_sucede((prev) =>
			prev === semana ? "" : semana 
		);
	};
	
	const toggleMes = (mes: string) => {
		set_en_que_mes((prev) =>
			prev.includes(mes)
			? prev.filter((m) => m !== mes) 
			: [...prev, mes]                
		);
	};

	function obtenerDiaSemana(fecha: Date): string {
		const indice = fecha.getDay(); 
		const indiceCorregido = indice === 0 ? 6 : indice - 1;
		return diasSemana[indiceCorregido];
	}

	  
	function obtenerRecurrencia(
		values: Record<string, any>,
	): Record<string, any> {
		switch (values.se_repite_cada) {
	  
		  case "diario":
			return {
				que_dias_de_la_semana: que_dias_de_la_semana,
				se_repite_cada: 'configurable',
				en_que_semana_sucede:'todas_las_semanas',
				sucede_recurrencia:['dia_de_la_semana'],
			};
	  
		  case "semana":
			return {
				se_repite_cada: 'configurable',
				que_dias_de_la_semana: [date?obtenerDiaSemana(date):""],
				...(!todas_las_semanas && {
					en_que_semana_sucede: en_que_semana_sucede,
				  }),
				sucede_recurrencia: ['dia_de_la_semana'],
			};
	  
			case "mes": {
				if (esRepetirCada == false) {
				  return {
					se_repite_cada: "configurable",
					sucede_recurrencia: ["dia_del_mes"],
					en_que_mes: en_que_mes,
					cada_cuantos_meses_se_repite: values.cada_cuantos_meses_se_repite
				  };
				}
			  
				if (esRepetirCada == true) {
				  return {
					se_repite_cada: "configurable",
					que_dias_de_la_semana: que_dias_de_la_semana,
					sucede_recurrencia: ["dia_de_la_semana"],
					...(todas_las_semanas
					  ? {}
					  : { en_que_semana_sucede: en_que_semana_sucede }),
					en_que_mes: en_que_mes,
				  };
				}
			  
				return {};
			}
		  	case "configurable":
			return {
				meses_del_anio: values.meses_del_anio ?? [],
				dias_del_mes: values.dias_del_mes ?? [],
			};
	  
		  default:
			return {};
		}
	}

	function opcionesMensuales(fecha: Date): string[] {
		const diaDelMes = fecha.getDate();
		const op1 = `Mensualmente el día ${diaDelMes}`;
		const diaSemana = fecha.getDay(); 
		const nombreDia = diasSemana[diaSemana];
		const semanaDelMes = Math.ceil(diaDelMes / 7);
		const ordinales = ["", "primer", "segundo", "tercer", "cuarto", "quinto"];
		const ordinal = ordinales[semanaDelMes];
		const op2 = `Mensualmente el ${ordinal} ${nombreDia} del mes`;
		return [op1, op2];
	}
	
	const opciones = date ? opcionesMensuales(date) : [];

	const seleccionar = (valor: boolean) => {
		setEsRepetirCada(prev => prev === valor ? null : valor);
	};
	  
	return (
		<Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
		<DialogTrigger asChild>{children}</DialogTrigger>

		<DialogContent className="max-w-2xl max-h-[80vh] flex flex-col m-3 overflow-auto"   aria-describedby="" onInteractOutside={(e) => e.preventDefault()} >
			<DialogHeader className="flex-shrink-0">
			<DialogTitle className="text-2xl text-center font-bold">
				{title}
			</DialogTitle>
			</DialogHeader>

			
			<div className=" p-3">
				<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-1 gap-5 ">
					<FormField
						control={form.control}
						name="nombre_rondin"
						render={({field}:any) => (
							<FormItem>
								<FormLabel>Nombre:</FormLabel>
								<FormControl>
									<Input
									placeholder="Texto"
									className="resize-none"
									{...field} 
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="fecha_hora_programada"
						render={() => (
							<FormItem>
								<FormLabel>Fecha y hora programada rondin: *</FormLabel>
								<FormControl>
									<DateTime date={date} setDate={setDate} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="flex flex-row gap-3">
						<div>
							<FormField
								control={form.control}
								name="duracion_estimada"
								render={({field}:any) => (
									<FormItem>
										<FormLabel>Duración estimada: *
										</FormLabel>
										<FormControl>
						
										<Input
										id="time-value"
										type="number"
										min={1}
										max={60}
										placeholder="1–60"
										value={field.value}
										onChange={(e) => {
											field.onChange(e.target.value); 
										}}
										/>					

										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="w-32 flex items-center mt-7">
							<div className="text-sm">Minutos</div>
							
						</div>
					</div>


					<FormField
						control={form.control}
						name="se_repite_cada"
						render={({ field }:any) => (
							<FormItem>
								<FormLabel>Recurrencia: *</FormLabel>
								<FormControl> 
								<Select {...field} className="input"
									onValueChange={(value:string) => {
									field.onChange(value); 
								}}
								value={field.value} 
								disabled={!date}
								
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecciona una opción" />
								</SelectTrigger>
								<SelectContent>
								
											<SelectItem value={"diario"}>
											Diario
											</SelectItem>
											<SelectItem value={"semana"}>
											Semanal
											</SelectItem>
											<SelectItem value={"mes"}>
											Mensual
											</SelectItem>
											<SelectItem value={"configurable"}>
											Configurable
											</SelectItem>
								</SelectContent>
							</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>	

					{recurrencia === "diario" && (
						<div className="mt-2">
							<div className="flex justify-between">
							<FormLabel>Seleccione los días de acceso:</FormLabel>
							<div className="flex items-center gap-2 ml-3">
								<input
									type="checkbox"
									checked={que_dias_de_la_semana.length === diasSemana.length}
									onChange={toggleTodos}
								/>
								<span className="text-sm">Todos los días</span>
								</div>
							</div>
								<div className="flex flex-wrap mt-2 mb-5">
									{diasSemana.map((dia) => {
									return (
										<FormItem key={dia?.toLowerCase()} className="flex items-center space-x-3">
											<FormControl>
												<Button
												type="button"
												onClick={() => toggleDia(dia?.toLocaleLowerCase())}
												className={`m-2 px-4 py-2 rounded-md transition-all duration-300 
												${que_dias_de_la_semana.includes(dia?.toLowerCase()) 
												? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]"
												: "border-2 border-blue-400 bg-white text-blue-600 hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]"
												}
												hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
												>
													<div className="flex flex-wrap">
														{que_dias_de_la_semana.includes(dia?.toLowerCase()) ? (
															<><div className="">{capitalizeFirstLetter(dia)}</div></>
														) : (
															<><div className="text-blue-600">{capitalizeFirstLetter(dia)}</div></>
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
						{recurrencia === "semana" && (
						<div className="mt-2">
							<div className="flex justify-between">
								<FormLabel>Seleccione la semana del mes:</FormLabel>
								<div className="flex items-center gap-2 ml-3">
									<input
										type="checkbox"
										onChange={(e:any) => set_todas_las_semanas(e.target.checked)}
									/>
									<span className="text-sm">Todas las semanas</span>
								</div>
							</div>
							<div className="flex flex-wrap mt-2 mb-5">
							{[
								"Primera semana del mes",
								"Segunda semana del mes",
								"Tercera semana del mes",
								"Cuarta semana del mes",
								"Quinta semana del mes",
							].map((semana) => {
								const value = semana.toLowerCase().replace(/\s+/g, "_");

								return (
								<FormItem
									key={value}
									className="flex items-center space-x-3"
								>
									<FormControl>
									<Button
										type="button"
										onClick={() => toggleSemana(value)}
										className={`m-2 px-4 py-2 rounded-md transition-all duration-300 
										${
												todas_las_semanas || en_que_semana_sucede === value
												? "bg-blue-600 text-white hover:bg-blue-600 hover:text-white"
												: "border-2 border-blue-400 bg-white text-blue-600 hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]"
											}
										`}
									>
										<div className="flex flex-wrap">
										{en_que_semana_sucede === value ? (
											<div>{semana}</div>
										) : (
											<div >{semana}</div>
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


					{recurrencia === "mes" && (
						<>
						
						<FormField
							control={form.control}
							name="que_dia_del_mes"
							render={({ field }:any) => (
								<FormItem>
									<FormLabel>Corriendo cada: *</FormLabel>
									<FormControl> 
									<Select
										onValueChange={field.onChange}
										value={field.value}
										disabled={!date}
										>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Selecciona una opción" />
										</SelectTrigger>

										<SelectContent>
											{opciones.map((op, i) => (
											<SelectItem key={i} value={op}>
												{op}
											</SelectItem>
											))}
										</SelectContent>
									</Select>
									</FormControl>
									<FormMessage />
							
								
									
								</FormItem>
							)}
						/>	

					{recurrencia=="mes" && 
						<div className="flex flex-wrap gap-4">
							{/* Repetir cada X mes : trueee*/}
							<Button
							type="button"
							onClick={() => seleccionar(true)}
							className={`px-4 py-2 rounded-md transition-all duration-300
								${
									esRepetirCada === true
									? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]"
									: "border-2 border-blue-400 bg-white text-blue-600 hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]"
								}
							`}
							>
							Repetir cada X mes
							</Button>
						
							{/* Seleccionar meses: falseeee */}
							<Button
							type="button"
							onClick={() => seleccionar(false)}
							className={`px-4 py-2 rounded-md transition-all duration-300
								${
									esRepetirCada === false
									? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]"
									: "border-2 border-blue-400 bg-white text-blue-600 hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]"
								}
							`}
							>
							Seleccionar meses
							</Button>
						</div>
					}

					{esRepetirCada === true && (
						<FormField
						control={form.control}
						name="cada_cuantos_meses_se_repite"
						render={({ field }) => (
								<div className="mt-3">
								<label className="text-sm font-medium mb-1 block">
									Se repetirá cada:
								</label>
						
								<Input
									type="number"
									min={1}
									max={10}
									className="w-32 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
									{...field}
									value={field.value} 
								/>
						
								<span className="ml-2 text-sm text-gray-600">mes(es)</span>
								</div>
							)}
						/>
						)}

						{esRepetirCada === false &&
								<div className="mt-2">
									<div className="flex justify-between">
										<FormLabel>Seleccione los meses de acceso:</FormLabel>
										<div className="flex items-center gap-2 ml-3">
											<input
											type="checkbox"
											checked={todas_las_meses}
											onChange={(e) => {
												const checked = e.target.checked;
												set_todas_las_meses(checked);

												if (checked) {
												// Agregar todos los meses
												const mesesDelAño = [
													"enero", "febrero", "marzo", "abril",
													"mayo", "junio", "julio", "agosto",
													"septiembre", "octubre", "noviembre", "diciembre"
												];
												set_en_que_mes(mesesDelAño);
												} else {
												set_en_que_mes([]);
												}
											}}
											/>
											<span className="text-sm">Todos los meses</span>
										</div>
									</div>
									<div className="flex flex-wrap mt-2 mb-5">
									{mesesDelAño.map((mes) => {
										const mesLower = mes.toLowerCase();
										return (
										<FormItem key={mesLower} className="flex items-center space-x-3">
											<FormControl>
											<Button
												type="button"
												onClick={() => toggleMes(mesLower)}
												className={`m-2 px-4 py-2 rounded-md transition-all duration-300 
												${en_que_mes.includes(mesLower) ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-white"}
												hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
											>
												<div className="flex flex-wrap">
												<div className={en_que_mes.includes(mesLower) ? "" : "text-blue-600"}>
													{mes}
												</div>
												</div>
											</Button>
											</FormControl>
										</FormItem>
										);
									})}
									</div>
							</div>
						}
						</>
					)}
					{recurrencia === "configurable" && (
						<FormField
							control={form.control}
							name="nombre_rondin"
							render={({field}:any) => (
								<FormItem>
									<FormLabel>Configurable:</FormLabel>
									<FormControl>
										<Input
										placeholder="Texto"
										className="resize-none"
										{...field} 
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					<div className="">
						<div className="text-sm mb-2">Áreas: </div>
						<Multiselect
						options={catalogAreasRondin} 
						onSelect={(selectedList) => {
							setAreasSeleccionadas(selectedList);
						}}
						onRemove={(selectedList) => {
							setAreasSeleccionadas(selectedList);
						}}
						displayValue="name"
						style={{ zIndex: 9999 }}
						/>
					</div>

					<div className="flex gap-2 mt-1">
						<DialogClose asChild>
							<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
							Cancelar
							</Button>
						</DialogClose>

						
						<Button
							type="submit"
							onClick={form.handleSubmit(onSubmit)}
							className="w-full  bg-blue-500 hover:bg-blue-600 text-white " disabled={isLoading}
						>
							{isLoading? (
							<>
								<Loader2 className="animate-spin"/> {"Creando rondin..."}
							</>
						):("Crear rondin")}
						</Button>
					</div>
					
				</form>
				</Form>
			</div>
			
		</DialogContent>
		</Dialog>
	);
};
