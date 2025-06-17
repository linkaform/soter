/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Textarea } from "../ui/textarea";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import LoadImage from "../upload-Image";
import { Imagen } from "@/lib/update-pass";
import { useCatalogoAreaEmpleado } from "@/hooks/useCatalogoAreaEmpleado";
import { format } from 'date-fns';
import DateTime from "../dateTime";
import LoadFile from "../upload-file";
import { CircleAlert, Edit, Loader2 } from "lucide-react";
import { AccionesTomadas, Depositos, PersonasInvolucradas } from "@/lib/incidencias";
import PersonasInvolucradasList from "../personas-involucradas-list";
import AccionesTomadasList from "../acciones-tomadas-list";
import { useShiftStore } from "@/store/useShiftStore";
import { useInciencias } from "@/hooks/useIncidencias";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { PersonaExtraviadaFields } from "./persona-extraviada";
import { RoboDeCableado } from "./robo-de-cableado";
import { RoboDeVehiculo } from "./robo-de-vehiculo";

interface EditarIncidenciaModalProps {
  	title: string;
	setShowLoadingModal:Dispatch<SetStateAction<boolean>>;
	data: any;
	selectedIncidencia:string;
}

const formSchema = z.object({
	reporta_incidencia: z.string().optional(),
	fecha_hora_incidencia: z.string().optional(),
	ubicacion_incidencia: z.string().min(1, { message: "Comentario es obligatorio" }),
	area_incidencia: z.string().min(1, { message: "Comentario es obligatorio" }), 
	evidencia_incidencia: z.array(
	  z.object({
		file_url: z.string().optional(),
		file_name: z.string().optional(),
	  })
	).optional(),
	documento_incidencia: z.array(
		z.object({
		  file_url: z.string().optional(),
		  file_name: z.string().optional(),
		})
	  ).optional(),
	personas_involucradas_incidencia: z.array(
		z.object({
		  nombre_completo: z.string().optional(),
		  tipo_persona: z.string().optional(),
		})
	  ).optional(),
	acciones_tomadas_incidencia: z.array(
		z.object({
		  acciones_tomadas: z.string().optional(),
		  responsable_accion: z.string().optional(),
		})
	  ).optional(),
	datos_deposito_incidencia: z.array(
		z.object({
		  cantidad: z.number().optional(),
		  tipo_deposito: z.string().optional(),
		})
	  ).optional(),
	notificacion_incidencia: z.string().min(1, { message: "Este campo es requerido" }),
	prioridad_incidencia: z.string().min(1, { message: "Este campo es requerido" }),
	dano_incidencia: z.string().optional(),
	tipo_dano_incidencia: z.string().optional(),
	comentario_incidencia: z.string().min(1, { message: "Este campo es requerido" }),
	incidencia: z.string().min(1, { message: "La ubicación es obligatoria" }),

	categoria:z.string().optional(),
	sub_categoria:z.string().optional(),
	incidente:z.string().optional(),
	//PersonaExtraviado
	nombre_completo_persona_extraviada: z.string().optional(),
	edad: z.string().optional(),
	color_piel: z.string().optional(),
	color_cabello: z.string().optional(),
	estatura_aproximada: z.string().optional(),
	descripcion_fisica_vestimenta: z.string().optional(),
	nombre_completo_responsable: z.string().optional(),
	prentesco: z.string().optional(),
	num_doc_identidad: z.string().optional(),
	telefono: z.string().optional(),
	info_coincide_con_videos: z.string().optional(),
	responsable_que_entrega: z.string().optional(),
	responsable_que_recibe: z.string().optional(),

	//Robo de cableado
	valor_estimado: z.string().optional(),
	pertenencias_sustraidas: z.string().optional(),
	//robo de vehiculo
	placas: z.string().optional(),
	tipo: z.string().optional(),
	marca: z.string().optional(),
	modelo: z.string().optional(),
	color: z.string().optional(),

});

export const EditarIncidenciaModal: React.FC<EditarIncidenciaModalProps> = ({
  	title,
	setShowLoadingModal,
	data,
	selectedIncidencia
}) => {
	const { location, isLoading } = useShiftStore();
	const [isSuccess, setIsSuccess] = useState(false)
	const [evidencia , setEvidencia] = useState<Imagen[]>([]);
	const [documento , setDocumento] = useState<Imagen[]>([]);
	const [date, setDate] = useState<Date|"">("");
	const [ubicacionSeleccionada] = useState(data.ubicacion_incidencia);
	const { dataAreas:areas} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true,  ubicacionSeleccionada?true:false);

	const [personasInvolucradas, setPersonasInvolucradas] = useState<PersonasInvolucradas[]>(data.personas_involucradas_incidencia)
	const [accionesTomadas, setAccionesTomadas] = useState<AccionesTomadas[]>(data.acciones_tomadas_incidencia)
	const [depositos] = useState<Depositos[]>(data.depositos)
	const { data:dataAreaEmpleado, isLoading:loadingAreaEmpleado } = useCatalogoAreaEmpleado(isSuccess, location, "Incidencias" );
	const { editarIncidenciaMutation , loading} = useInciencias("", "",[], "", "", "");
	// const [ setCatAreas] = useState<any| string[]>(areas);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			reporta_incidencia: data.reporta_incidencia,
			fecha_hora_incidencia: data.fecha_hora_incidencia,
			ubicacion_incidencia: data.ubicacion_incidencia,
			area_incidencia:  data.area_incidencia,
			incidencia: data.incidencia,
			comentario_incidencia: data.comentario_incidencia,
			tipo_dano_incidencia: data.tipo_dano_incidencia ||"",
			dano_incidencia: data.dano_incidencia,
			personas_involucradas_incidencia:personasInvolucradas,
			acciones_tomadas_incidencia: accionesTomadas,
			evidencia_incidencia: evidencia,
			documento_incidencia:documento,
			prioridad_incidencia: data.prioridad_incidencia.toLowerCase(),
			notificacion_incidencia: data.notificacion_incidencia,
			datos_deposito_incidencia: depositos,

			categoria:data.vategoria,
			sub_categoria:data.sub_categoria,
			incidente:data.incidencia,

			nombre_completo_persona_extraviada:data.nombre_completo,
			edad:data.edad,
			color_piel:data.color_piel,
			color_cabello:data.color_cabello,
			estatura_aproximada:data.estatura_aproximada,
			descripcion_fisica_vestimenta:data.descripcion_fisica_vestimenta,
			nombre_completo_responsable:data.nombre_completo_responsable,
			prentesco:data.parentesco,
			num_doc_identidad:data.num_doc_identidad,
			telefono:data.telefono,
			info_coincide_con_videos:data.info_coincide_con_videos,
			responsable_que_entrega:data.responsable_que_entrega,
			responsable_que_recibe:data.responsable_que_recibe,
		
			//Robo de cableado
			valor_estimado:data.valor_estimado,
			pertenencias_sustraidas:data.pertenencias_sustraidas,
			//robo de vehiculo
			placas:data.placas,
			tipo:data.tipo,
			marca:data.marca,
			modelo:data.modelo,
			color:data.color,
		},
	});

	useEffect(()=>{
		if(isSuccess){
			setEvidencia(data.evidencia_incidencia)
			setDocumento(data.evidencia_incidencia)
			setDate(new Date(data.fecha_hora_incidencia))
			setShowLoadingModal(false)
		}
		if(areas){
			// setCatAreas(areas)
		}
	},[isSuccess, areas])

	useEffect(()=>{
		if(!loading){
			handleClose()			
		}
	},[loading])

	function onSubmit(values: z.infer<typeof formSchema>) {
		let formattedDate=""
		if(date){
			formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
			const formatData ={
					reporta_incidencia: values.reporta_incidencia||"",
					fecha_hora_incidencia:formattedDate||"",
					ubicacion_incidencia:ubicacionSeleccionada||"",
					area_incidencia: values.area_incidencia||"",
					incidencia:values.incidencia||"",
					comentario_incidencia: values.comentario_incidencia||"",
					tipo_dano_incidencia: values.tipo_dano_incidencia||"",
					dano_incidencia:values.dano_incidencia||"",
					personas_involucradas_incidencia: personasInvolucradas||[],
					acciones_tomadas_incidencia: accionesTomadas||[],
					evidencia_incidencia:evidencia||[],
					documento_incidencia:documento||[],
					prioridad_incidencia:values.prioridad_incidencia||"",
					notificacion_incidencia:values.notificacion_incidencia||"",
					datos_deposito_incidencia: depositos||[],

					categoria:data.categoria,
					sub_categoria:data.subCategoria,
					incidente:data.incidencia,

					nombre_completo_persona_extraviada: values.nombre_completo_persona_extraviada,
					edad: values.edad,
					color_piel: values.color_piel,
					color_cabello: values.color_cabello,
					estatura_aproximada: values.estatura_aproximada,
					descripcion_fisica_vestimenta: values.descripcion_fisica_vestimenta,
					nombre_completo_responsable: values.nombre_completo_responsable,
					prentesco: values.prentesco,
					num_doc_identidad: values.num_doc_identidad,
					telefono: values.telefono,
					info_coincide_con_videos: values.info_coincide_con_videos,
					responsable_que_entrega: values.responsable_que_entrega,
					responsable_que_recibe: values.responsable_que_recibe,
				
					//Robo de cableado
					valor_estimado: values.valor_estimado,
					pertenencias_sustraidas: values.pertenencias_sustraidas,
					//robo de vehiculo
					placas: values.placas,
					tipo: values.tipo,
					marca: values.marca,
					modelo: values.modelo,
					color: values.color,
				}
				editarIncidenciaMutation.mutate({ data_incidencia: formatData, folio: data.folio });
		}else{
			form.setError("fecha_hora_incidencia", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleClose = () => {
		setIsSuccess(false); 
	};

	const handleOpenModal = async () => {
		setShowLoadingModal(false);
		setIsSuccess(true);
	};

	return (
    <Dialog open={isSuccess} modal>
		<div className="cursor-pointer" onClick={handleOpenModal}>
            <Edit />
        </div>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] flex flex-col" aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

			<div className="flex-grow overflow-y-auto p-4">
				<div className="flex gap-2 mb-4">
					<CircleAlert />
					Incidente: <span className="font-bold"> {data.incidencia}</span>
				</div>
				<Form {...form} >
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
					
							{/* <FormField 
								control={form.control}
								name="ubicacion_incidencia"
								render={({ field }:any) => (
									<FormItem className="w-full">
										<FormLabel>Ubicacion: *</FormLabel>
										<FormControl>
										<Select {...field} className="input"
											onValueChange={(value:string) => {
											field.onChange(value);
											setUbicacionSeleccionada(value); 
										}}
										value={ubicacionSeleccionada} 
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Selecciona una ubicacion" />
										</SelectTrigger>
										<SelectContent>
										{ubicaciones?.map((vehiculo:string, index:number) => {
											return (
												<SelectItem key={index} value={vehiculo}>
													{vehiculo}
												</SelectItem>
											)
										})}
										</SelectContent>
									</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/> */}
							<FormField
								control={form.control}
								name="area_incidencia"
								render={({ field }:any) => (
									<FormItem className="w-full">
										<FormLabel>Area: *</FormLabel>
										<FormControl>
										<Select {...field} className="input"
											onValueChange={(value:string) => {
											field.onChange(value); 
										}}
										value={field.value} 
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Selecciona una ubicacion" />
										</SelectTrigger>
										<SelectContent>
										{areas?.map((vehiculo:string, index:number) => (
											<SelectItem key={index} value={vehiculo}>
												{vehiculo}
											</SelectItem>
										))}
										</SelectContent>
									</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
							control={form.control}
							name="fecha_hora_incidencia"
							render={() => (
								<FormItem className="w-full">
								<FormLabel>Fecha: *</FormLabel>
								<FormControl>
									{/* <Input type="datetime-local" placeholder="Fecha" {...field} /> */}
									<DateTime date={date} setDate={setDate} />
								</FormControl>

								<FormMessage />
								</FormItem>
							)}
							/>
							<FormField
								control={form.control}
								name="reporta_incidencia"
								render={({ field }:any) => (
									<FormItem className="w-full">
										<FormLabel>Reporta:</FormLabel>
										<FormControl>
										<Select {...field} className="input"
											onValueChange={(value:string) => {
											field.onChange(value); 
										}}
										value={field.value} 
									>
										<SelectTrigger className="w-full">
										{loadingAreaEmpleado?(<>
												<SelectValue placeholder="Cargando opciones..." />
											</>):(<>
												<SelectValue placeholder="Selecciona una opcion" />
											</>)}
										</SelectTrigger>
										<SelectContent>
										{dataAreaEmpleado?.map((vehiculo:string, index:number) => (
											<SelectItem key={index} value={vehiculo}>
												{vehiculo}
											</SelectItem>
										))}
										</SelectContent>
									</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>	
							<FormField
								control={form.control}
								name="prioridad_incidencia"
								render={({ field }:any) => (
									<FormItem className="w-full">
										<FormLabel>Importancia: *</FormLabel>
										<FormControl>
										<Select {...field} className="input"
											onValueChange={(value:string) => {
											field.onChange(value); 
										}}
										value={field.value} 
									>
										<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecciona una opcion" />
										</SelectTrigger>
										<SelectContent>
										<SelectItem key={"baja"} value={"baja"}>Baja</SelectItem>
										<SelectItem key={"media"} value={"media"}>Media</SelectItem>
										<SelectItem key={"alta"} value={"alta"}>Alta</SelectItem>
										<SelectItem key={"crítica"} value={"crítica"}>Crítica</SelectItem>
										</SelectContent>
									</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>	
							{/* <FormField
								control={form.control}
								name="incidencia"
								render={({ field }:any) => (
									<FormItem className="w-full">
										<FormLabel>Incidencia: *</FormLabel>
										<FormControl>
										<Select {...field} className="input"
											onValueChange={(value:string) => {
											field.onChange(value); 
										}}
										value={field.value} 
									>
										<SelectTrigger className="w-full">
											{isLoadingCatIncidencias ? (
												<SelectValue placeholder="Cargando incidencias..." />
											):
											(
												<SelectValue placeholder="Selecciona una incidencia" />
											)}
										</SelectTrigger>
										<SelectContent>
										{catIncidencias?.map((vehiculo:string, index:number) => {
											return (
												<SelectItem key={index} value={vehiculo}>
													{vehiculo}
												</SelectItem>
											)
										})}
										</SelectContent>
									</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>	 */}
							
							<FormField
							control={form.control}
							name="comentario_incidencia"
							render={({ field }:any) => (
								<FormItem className="col-span-1 md:col-span-2">
								<FormLabel>Comentarios: *</FormLabel>
								<FormControl className="w-full">
									<Textarea
									placeholder="Texto"
									className="resize-none w-full" 
									{...field}
									/>
								</FormControl>
								<FormMessage />
								</FormItem>
							)}
							/>
							
							<LoadImage
								id="evidencia" 
								titulo={"Evidencia"} 
								setImg={setEvidencia}
								showWebcamOption={true}
								facingMode="environment"
								imgArray={evidencia}
								showArray={true}
								limit={10}/>

							<LoadFile
								id="documento"
								titulo={"Documento"}
								setDocs={setDocumento}
								docArray={documento}
								limit={10}/>
							
							<FormField
								control={form.control}
								name="notificacion_incidencia"
								render={({ field }:any) => (
									<FormItem className="w-full mb-3">
										<FormLabel>Notificaciones: *</FormLabel>
										<FormControl>
										<Select {...field} className="input"
											onValueChange={(value:string) => {
											field.onChange(value); 
										}}
										value={field.value} 
									>
										<SelectTrigger className="w-full ">
										<SelectValue placeholder="Selecciona una opcion" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem key={"no"} value={"no"}>
												No
											</SelectItem>
											<SelectItem key={"correo"} value={"correo"}>
											Correo
										</SelectItem>
										</SelectContent>
									</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>	



								{selectedIncidencia =="Persona extraviada" && (
									<div className="col-span-2 w-full">
										<PersonaExtraviadaFields control={form.control} data={{}}></PersonaExtraviadaFields>
									</div>
								)}
								{selectedIncidencia =="Robo de cableado" && (
									<div className="col-span-2 w-full flex flex-col ">
										<Button className="w-full bg-blue-500 hover:bg-blue-600 text-white sm:w-2/3 md:w-1/2 lg:w-1/3 mb-2" >
											Dar seguimiento
										</Button>
										<RoboDeCableado control={form.control} ></RoboDeCableado>
									</div>
								)}
								{selectedIncidencia =="Robo de vehículo" && (
									<div className="col-span-2 w-full">
										<RoboDeVehiculo control={form.control} ></RoboDeVehiculo>
									</div>
								)}


						</form>
				</Form>
			
        
			<div className="col-span-1 md:col-span-2 mt-2">
				<PersonasInvolucradasList personasInvolucradas={personasInvolucradas} setPersonasInvolucradas={setPersonasInvolucradas} ></PersonasInvolucradasList>
			</div>
			<div className="col-span-1 md:col-span-2">
				<AccionesTomadasList accionesTomadas={accionesTomadas} setAccionesTomadas={setAccionesTomadas} ></AccionesTomadasList>
			</div>
			</div>
			<div className="flex gap-2">
				<DialogClose asChild>
					<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 sm:w-2/3 md:w-1/2 lg:w-1/2 mb-2" onClick={handleClose}>
					Cancelar
					</Button>
				</DialogClose>

				
				<Button
					type="submit"
					onClick={form.handleSubmit(onSubmit)}
					className="w-full bg-blue-500 hover:bg-blue-600 text-white sm:w-2/3 md:w-1/2 lg:w-1/2 mb-2" disabled={isLoading}
				>
					{isLoading? (
					<>
						<Loader2 className="animate-spin"/> {"Editando incidencia..."}
					</>
				):("Editar incidencia")}
				</Button>
			</div>
          
      </DialogContent>
    </Dialog>
  );
};
