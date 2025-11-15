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
	cada_cuantos_meses_se_repite?: string;
  
	la_recurrencia_cuenta_con_fecha_final?: string;
	fecha_final_recurrencia?: string;
	cron_config:string;
	accion_recurrencia: string;
  };
  
  const recurrenciaKeys = {
	diario: ["que_dias_de_la_semana","se_repite_cada","en_que_semana_sucede","sucede_recurrencia"],
	semana: ["se_repite_cada","que_dias_de_la_semana","en_que_semana_sucede","sucede_recurrencia"],
	mes: ["se_repite_cada","que_dia_del_mes","sucede_recurrencia","en_que_mes"],
	MensualDiaSemana: ["se_repite_cada","que_dias_de_la_semana","sucede_recurrencia","en_que_semana_sucede","en_que_mes"],
	configurable: ["se_repite_cada", "cron_config"],
  } as const;


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
    sucede_recurrencia: z.string().optional(),
    en_que_minuto_sucede:z.string().optional(),
    cada_cuantos_minutos_se_repite:z.string().optional(),
    en_que_hora_sucede:z.string().optional(),
    cada_cuantas_horas_se_repite:z.string().optional(),
    que_dias_de_la_semana: z.array(z.string().optional()),
    en_que_semana_sucede:z.string().optional(),
    que_dia_del_mes:z.string().optional(),
    cada_cuantos_dias_se_repite:z.string().optional(),
    en_que_mes:z.string().optional(),
    cada_cuantos_meses_se_repite:z.string().optional(),
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
	const [en_que_mes, set_en_que_mes] = useState<string>("")

	 
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
            sucede_recurrencia: '',
            en_que_minuto_sucede: '',
            cada_cuantos_minutos_se_repite: '',
            en_que_hora_sucede: '',
            cada_cuantas_horas_se_repite: '',
            que_dias_de_la_semana: que_dias_de_la_semana,
            en_que_semana_sucede: en_que_semana_sucede,
            que_dia_del_mes: '',
            cada_cuantos_dias_se_repite: '',
            en_que_mes: en_que_mes,
            cada_cuantos_meses_se_repite: '',
            la_recurrencia_cuenta_con_fecha_final: '',
            fecha_final_recurrencia: '',
            accion_recurrencia:'programar'
		},
	});

	const { reset } = form;

	useEffect(()=>{
		if(isSuccess){
			reset()
		}
	},[isSuccess])

	const diasSemana = [
		"Lunes",
		"Martes",
		"Miércoles",
		"Jueves",
		"Viernes",
		"Sábado",
		"Domingo",
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

		function filtrarPorRecurrencia<T extends Record<string, any>>(
			data: T,
			tipoRecurrencia: keyof typeof recurrenciaKeys
		  ): Partial<{ [K in keyof T]: T[K] | null }> { 
			const allowedKeys = recurrenciaKeys[tipoRecurrencia];
			const result: Partial<{ [K in keyof T]: T[K] | null }> = {};
		  
			allowedKeys.forEach((k) => {
			  const key = k as keyof T;
			  result[key] = data[key] ?? null;
			});
		  
			return result;
		  }
	// function onSubmit(values: z.infer<typeof formSchema>) {
	// 	let formattedDate=""
	// 	if(date){
	// 		formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
	// 		const areas = areasSeleccionadas.map( e => e.id);
	// 		const formatData ={
	// 			nombre_rondin: values.nombre_rondin ||"",
	// 			duracion_estimada: values.duracion_estimada + " minutos",
	// 			ubicacion: location,
	// 			areas: areas,
	// 			grupo_asignado: '',
	// 			fecha_hora_programada: formattedDate,
	// 			programar_anticipacion: 'no',
	// 			cuanto_tiempo_de_anticipacio: '',
	// 			cuanto_tiempo_de_anticipacion_expresado_en: '',
	// 			tiempo_para_ejecutar_tarea: 30,
	// 			tiempo_para_ejecutar_tarea_expresado_en: 'minutos',
	// 			la_tarea_es_de: '',
	// 			se_repite_cada: '',
	// 			sucede_cada: 'igual_que_la_primer_fecha',
	// 			sucede_recurrencia: [],
	// 			en_que_minuto_sucede: '',
	// 			cada_cuantos_minutos_se_repite: '',
	// 			en_que_hora_sucede: '',
	// 			cada_cuantas_horas_se_repite: '',
	// 			que_dias_de_la_semana: que_dias_de_la_semana,
	// 			en_que_semana_sucede: en_que_semana_sucede,
	// 			que_dia_del_mes: '',
	// 			cada_cuantos_dias_se_repite: '',
	// 			en_que_mes: en_que_mes,
	// 			cada_cuantos_meses_se_repite: '',
	// 			la_recurrencia_cuenta_con_fecha_final: 'no',
	// 			fecha_final_recurrencia: '', 
	// 			accion_recurrencia:"programar"
	// 		}
	// 		createRondinMutation.mutate({rondin_data: formatData},{
	// 			onSuccess: ()=>{
	// 				setIsSuccess(false)
	// 			}
	// 		})
	// 	}else{
	// 		form.setError("fecha_hora_programada", { type: "manual", message: "Fecha es un campo requerido." });
	// 	}
	// }


	function onSubmit(values: z.infer<typeof formSchema>) {
		// REVISAR LA CREACION DE RONDIN!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 
		//HACER PRUEBAS CON EL CODIGO AGREGADO PARA CREA RONDINES
		if (!date) {
		  form.setError("fecha_hora_programada", { type: "manual", message: "Fecha es obligatoria" });
		  return;
		}
		const valuesConDias = {
			...values,
			que_dias_de_la_semana: que_dias_de_la_semana, 
		  };
		  
		const formattedDate = format(new Date(date), 'yyyy-MM-dd HH:mm:ss');
		const areas = areasSeleccionadas.map(e => e.id);
		const tipoRecurrencia = values.se_repite_cada as keyof typeof recurrenciaKeys;
		const recurrenciaFiltrada = filtrarPorRecurrencia(valuesConDias, tipoRecurrencia);
		
	    console.log("RECURRENCIA DIARIA", recurrenciaFiltrada)
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
		// console.log("RECURRENCIA DIARIA", payload)
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
		set_en_que_mes(prev => prev === mes ? "" : mes);
	  };

	  useEffect(()=>{
		console.log("que_dias_de_la_semana",que_dias_de_la_semana)
	  },[que_dias_de_la_semana])

  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogTrigger asChild>{children}</DialogTrigger>

	  <DialogContent className="max-w-xl flex flex-col w-full "  aria-describedby="" onInteractOutside={(e) => e.preventDefault()} >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

		<div className=" p-4 " >
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
									<FormItem key={dia?.toLowerCase()} className="flex items-center space-x-3">
										<FormControl>
											<Button
											type="button"
											onClick={() => toggleDia(dia?.toLocaleLowerCase())}
											className={`m-2 px-4 py-2 rounded-md transition-all duration-300 
											${que_dias_de_la_semana.includes(dia?.toLowerCase()) ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-white"}
											hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
											>
												<div className="flex flex-wrap">
													{que_dias_de_la_semana.includes(dia?.toLowerCase()) ? (
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
		{recurrencia === "semana" && (
		<div className="mt-2">
			<FormLabel>Seleccione la semana del mes:</FormLabel>

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
							en_que_semana_sucede === value
							? "bg-blue-600 text-white"
							: "border-2 border-blue-400 bg-white"
						}
						hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
					>
						<div className="flex flex-wrap">
						{en_que_semana_sucede === value ? (
							<div>{semana}</div>
						) : (
							<div className="text-blue-600">{semana}</div>
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
								<Select {...field} className="input"
									onValueChange={(value:string) => {
									field.onChange(value); 
								}}
								value={field.value} 
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecciona una opción" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={"Día del mes"}>
									Día del mes
									</SelectItem>
									<SelectItem value={"Día de la semana"}>
									Día de la semana
									</SelectItem>
								</SelectContent>
							</Select>
								</FormControl>
								<FormMessage />
								
								{field.value === "Día del mes" && (
								<div className="mt-4 flex items-center gap-2">
								<span className="text-sm">En el día</span>
								<Select
									onValueChange={(v) => form.setValue("se_repite_cada", v)}
									value={form.watch("se_repite_cada")}
								>
									<SelectTrigger className="w-24">
									<SelectValue placeholder="1" />
									</SelectTrigger>
									<SelectContent>
									{Array.from({ length: 31 }, (_, i) => (
										<SelectItem key={i + 1} value={String(i + 1)}>
										{i + 1}
										</SelectItem>
									))}
									</SelectContent>
								</Select>
								<span className="text-sm">del mes</span>
								</div>
							)}
							{field.value === "Día de la semana" && (
								<div className="mt-4 flex items-center gap-2">
								<span className="text-sm">En el </span>
								<Select
									onValueChange={(v) => form.setValue("en_que_hora_sucede", v)}
									value={form.watch("en_que_hora_sucede")}
								>
									<SelectTrigger className="w-24">
									<SelectValue placeholder="1" />
									</SelectTrigger>
									<SelectContent>
									
										<SelectItem key={"Primero"} value={"Primero"}> Primero
										</SelectItem>
										<SelectItem key={"Segundo"} value={"Segundo"}> Segundo
										</SelectItem>
										<SelectItem key={"Tercero"} value={"Tercero"}> Tercero
										</SelectItem>
										<SelectItem key={"Cuarto"} value={"Cuarto"}> Cuarto
										</SelectItem>
										<SelectItem key={"Quinto"} value={"Quinto"}> Quinto
										</SelectItem>
									</SelectContent>
								</Select>
								<Select
								onValueChange={(v) => field.onChange("cada_cuantos_minutos_se_repite",v)}
								value={field.value || ""}
								>
								<SelectTrigger className="w-40">
									<SelectValue placeholder="Selecciona un día" />
								</SelectTrigger>
								<SelectContent>
									{diasSemana.map((dia: string) => (
									<SelectItem key={dia} value={dia}>
										{dia}
									</SelectItem>
									))}
								</SelectContent>
								</Select>
								<span className="text-sm">del mes </span>
								</div>
							)}
							</FormItem>
						)}
					/>	

					<div className="mt-2">
					<div className="mt-2">
						<div className="flex justify-between">
							<FormLabel>Seleccione los meses de acceso:</FormLabel>
							<div className="flex items-center gap-2 ml-3">
							<input
								type="checkbox"
								checked={mesesDelAño.every((m) => en_que_mes.includes(m))} 
								// onChange={() => toggleMes()}
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
					</div>

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
