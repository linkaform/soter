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
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import DateTime from "../dateTime";
import { Loader2 } from "lucide-react";
import { useRondines } from "@/hooks/Rondines/useRondines";
import { Input } from "../ui/input";
import { format } from "date-fns";
import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import { useShiftStore } from "@/store/useShiftStore";

interface AddRondinModalProps {
  	title: string;
    children: React.ReactNode;
}

const formSchema = z.object({
    nombre_rondin:z.string().optional(),
    duracion_estimada: z.string().optional(),
    ubicacion: z.string().optional(),
    areas: z.array(z.string().optional()),
    grupo_asignado:z.string().optional(),
    fecha_hora_programada: z.string().optional(),
    programar_anticipacion: z.string().optional(),
    cuanto_tiempo_de_anticipacio:z.string().optional(),
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
    en_que_mes:z.string().optional(),
    cada_cuantos_meses_se_repite:z.string().optional(),
    la_recurrencia_cuenta_con_fecha_final: z.string().optional(),
    fecha_final_recurrencia:z.string().optional(),
});

export const AddRondinModal: React.FC<AddRondinModalProps> = ({
  	title,
    children
}) => {
    const [isSuccess, setIsSuccess] = useState(false);
	const [areasSeleccionadas, setAreasSeleccionadas] = useState<any[]>([]);
	const { createRondinMutation, isLoading} = useRondines()
	const [date, setDate] = useState<Date|"">("");
	const { location} = useShiftStore()
	
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
            cuanto_tiempo_de_anticipacio: '',
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
            que_dias_de_la_semana: [],
            en_que_semana_sucede: '',
            que_dia_del_mes: '',
            cada_cuantos_dias_se_repite: '',
            en_que_mes: '',
            cada_cuantos_meses_se_repite: '',
            la_recurrencia_cuenta_con_fecha_final: '',
            fecha_final_recurrencia: '',
            
            // nombre_recorrido:"",
            // ubicacion_recorrido:"",
            // fecha_hora_programada_rondin: "",
            // fecha_hora_inicio_rondin: "",
            // fecha_hora_fin_rondin: "",
            // estatus_recorrido:"",
            // recorrido: "",
            // areas_recorrido:"",
            // incidencias:"",
            // duracion_recorrido_minutos: "",
            // motivo_cancelacion: "",
		},
	});

	const { reset } = form;
	console.log("rest", reset)

	useEffect(()=>{
		if(isSuccess){
			reset()
			// setDate(new Date())
			// // setEvidencia([])
			// // setDocumento([])
			// refetchAreaEmpleado()
			// refetchAreaEmpleadoApoyo()
			// refetchFallas()
		}
	},[isSuccess])


	// useEffect(()=>{
	// 	if(dataFallas && subconcepto){
	// 		setCatalogoSub(dataFallas)
	// 	}
	// 	if(dataFallas && !subconcepto){
	// 		setFallas(dataFallas)
	// 	}
	// },[dataFallas])

	function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("NOMBRE DEL RONDIN",values.nombre_rondin)
		let formattedDate=""
		if(date){
			formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
			const areas = areasSeleccionadas.map( e => e.id);
			const formatData ={
				nombre_rondin: values.nombre_rondin ||"",
				duracion_estimada: values.duracion_estimada + " minutos",
				ubicacion: location,
				areas: areas,
				grupo_asignado: '',
				fecha_hora_programada: formattedDate,
				programar_anticipacion: 'no',
				cuanto_tiempo_de_anticipacio: '',
				cuanto_tiempo_de_anticipacion_expresado_en: '',
				tiempo_para_ejecutar_tarea: 30,
				tiempo_para_ejecutar_tarea_expresado_en: 'minutos',
				la_tarea_es_de: '',
				se_repite_cada: '',
				sucede_cada: 'igual_que_la_primer_fecha',
				sucede_recurrencia: [],
				en_que_minuto_sucede: '',
				cada_cuantos_minutos_se_repite: '',
				en_que_hora_sucede: '',
				cada_cuantas_horas_se_repite: '',
				que_dias_de_la_semana: [],
				en_que_semana_sucede: '',
				que_dia_del_mes: '',
				cada_cuantos_dias_se_repite: '',
				en_que_mes: '',
				cada_cuantos_meses_se_repite: '',
				la_recurrencia_cuenta_con_fecha_final: 'no',
				fecha_final_recurrencia: '', 
			}
			createRondinMutation.mutate({rondin_data: formatData},{
				onSuccess: ()=>{
					setIsSuccess(false)
				}
			})
		}else{
			form.setError("fecha_hora_programada", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleClose = () => {
		setIsSuccess(false); 
	};



  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogTrigger asChild>{children}</DialogTrigger>

	  <DialogContent className="max-w-xl flex flex-col"  aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

		<div className="max-h-[80vh] flex-grow p-4 " >
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
						{/* <Select value={unit} onValueChange={setUnit} >
						<SelectTrigger id="unit-select">
							<SelectValue placeholder="Unidad" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="segundos">Segundos</SelectItem>
							<SelectItem value="minutos">Minutos</SelectItem>
							<SelectItem value="horas">Horas</SelectItem>
						</SelectContent>
						</Select> */}
					</div>
				</div>


				<FormField
					control={form.control}
					name="cada_cuantos_dias_se_repite"
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
							{/* {catalagoSub.length>0 ? (
								catalagoSub?.map((item:string, index:number) => {
									return ( */}
										<SelectItem value={"No se repite"}>
                                        No se repite
										</SelectItem>
                                        <SelectItem value={"Diariamente"}>
                                        Diariamente
										</SelectItem>
                                        <SelectItem value={"Semanalmente los jueves"}>
                                        Semanalmente los jueves
										</SelectItem>
                                        <SelectItem value={"Anualmente el 10 de marzo"}>
                                        Anualmente el 10 de marzo
										</SelectItem>
										<SelectItem value={"Todos los dias de la semana(Lunes a Viernes)"}>
                                        Todos los dias de la semana(Lunes a Viernes)
										</SelectItem>
										<SelectItem value={"Personalizado "}>
                                        Personalizado
										</SelectItem>
									{/* )
								})
							):(
								<><SelectItem disabled value={"no opciones"}>No hay opciones disponibles</SelectItem></>
							)} */}
							</SelectContent>
						</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>	
				<div className="">
					<div className="text-sm mb-2">Áreas: </div>
					<Multiselect
					options={[{id:"Antenas", name:"Antenas"}, {id:"Papeleria", name:"Papeleria"}, {id:"Area de rampa 24", name:"Area de rampa 24"},{id:"Cuarto de servidores", name:"Cuarto de servidores"}]} 
					// selectedValues={ubicacionesDefaultFormatted}
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
