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
import { Select ,SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import LoadImage from "../upload-Image";
import { Imagen } from "@/lib/update-pass";
import { useCatalogoAreaEmpleado } from "@/hooks/useCatalogoAreaEmpleado";
import { format } from 'date-fns';
import DateTime from "../dateTime";
import LoadFile from "../upload-file";
import { CircleAlert, Loader2 } from "lucide-react";
import { AccionesTomadas, Depositos, getCatIncidencias, PersonasInvolucradas } from "@/lib/incidencias";
import PersonasInvolucradasList from "../personas-involucradas-list";
import AccionesTomadasList from "../acciones-tomadas-list";
import { useShiftStore } from "@/store/useShiftStore";
import { useInciencias } from "@/hooks/Incidencias/useIncidencias";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { PersonaExtraviadaFields } from "./persona-extraviada";
import { RoboDeCableado } from "./robo-de-cableado";
import { RoboDeVehiculo } from "./robo-de-vehiculo";
import { categoriasConIconos, subCategoriasConIconos } from "./add-incidencia";
import { useCatalogoInciencias } from "@/hooks/useCatalogoIncidencias";
import { Slider } from "../slider";
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner";
import DepositosList from "../depositos-list";
import SelectReact from 'react-select'
import { SeguimientoIncidenciaModal } from "./seguimiento-incidencia";

interface EditarIncidenciaModalProps {
  	title: string;
	data: any;
	selectedIncidencia:string;
	onClose: () => void; 
	setModalEditarAbierto:Dispatch<SetStateAction<boolean>>; 
	modalEditarAbierto: boolean;

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
	parentesco: z.string().optional(),
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
	data,
	onClose,
	modalEditarAbierto,
	setModalEditarAbierto
}) => {
	const { location, isLoading } = useShiftStore();
	// const [modalEditarAbierto, setmodalEditarAbierto] = useState(false)
	const [evidencia , setEvidencia] = useState<Imagen[]>([]);
	const [documento , setDocumento] = useState<Imagen[]>([]);
	const [date, setDate] = useState<Date|"">("");
	const [ubicacionSeleccionada] = useState(data.ubicacion_incidencia);
	const { dataAreas:areas} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true,  ubicacionSeleccionada?true:false);

	const [personasInvolucradas, setPersonasInvolucradas] = useState<PersonasInvolucradas[]>(data.personas_involucradas_incidencia)
	const [accionesTomadas, setAccionesTomadas] = useState<AccionesTomadas[]>(data.acciones_tomadas_incidencia)
	const [depositos, setDepositos] = useState<Depositos[]>([])
	const { data:dataAreaEmpleado, isLoading:loadingAreaEmpleado } = useCatalogoAreaEmpleado(modalEditarAbierto, location, "Incidencias" );
	const { editarIncidenciaMutation} = useInciencias("", "",[], "", "", "");
	const [openModal, setOpenModal] = useState(false)

	const [search, setSearch]= useState("")
	const [catSubCategorias, setSubCatCategorias] = useState<any>([])
	const [catSubIncidences, setCatSubIncidences] = useState<any>([])
	const [subCategoria, setSubCategoria]= useState("")
	const [categoria, setCategoria]= useState(data.categoria)
	const [selectedIncidencia, setSelectedIncidencia]= useState("")
	const [catCategorias, setCatCategorias] = useState<any[]>([])
	const [loadingCatalogos, setLoadingCatalogos]= useState(false)

	const { catIncidencias } = useCatalogoInciencias(modalEditarAbierto, categoria, subCategoria);
	const [selectedNotificacion, setSelectedNotification] = useState(data.notificacion_incidencia)


	const formatValueLabel = (array:any[])=>{
		return array.map((val: any) => ({
			value: val.nombre, 
			label: val.nombre
		}));
	}


	const getNivelNumber = (val:string) => {
		if (val =="Alta") return 100
		if (val =="Media") return 50
		if (val =="Baja") return 0
	}
	const [value, setValue] = useState<number[]>([getNivelNumber(data.prioridad_incidencia) ?? 0]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			reporta_incidencia: data.reporta_incidencia||"",
			fecha_hora_incidencia: data.fecha_hora_incidencia||"",
			ubicacion_incidencia: data.ubicacion_incidencia||"",
			area_incidencia:  data.area_incidencia||"",
			incidencia: data.incidencia||"",
			comentario_incidencia: data.comentario_incidencia||"",
			tipo_dano_incidencia: data.tipo_dano_incidencia ||"",
			dano_incidencia: data.dano_incidencia||"",
			personas_involucradas_incidencia:personasInvolucradas,
			acciones_tomadas_incidencia: accionesTomadas,
			evidencia_incidencia: evidencia,
			documento_incidencia:documento,
			prioridad_incidencia: data.prioridad_incidencia ||"",
			notificacion_incidencia: data.notificacion_incidencia ||"",
			datos_deposito_incidencia: depositos,

			//Categoria
			categoria:data.categoria||"",
			sub_categoria:data.sub_categoria||"",
			incidente:data.incidencia||"",

			//Persona extraviada
			nombre_completo_persona_extraviada:data.nombre_completo_persona_extraviada||"",
			edad:data.edad||"",
			color_piel:data.color_piel||"",
			color_cabello:data.color_cabello||"",
			estatura_aproximada:data.estatura_aproximada||"",
			descripcion_fisica_vestimenta:data.descripcion_fisica_vestimenta||"",
			nombre_completo_responsable:data.nombre_completo_responsable||"",
			parentesco:data.parentesco||"",
			num_doc_identidad:data.num_doc_identidad||"",
			telefono:data.telefono||"",
			info_coincide_con_videos:data.info_coincide_con_videos||"",
			responsable_que_entrega:data.responsable_que_entrega||"",
			responsable_que_recibe:data.responsable_que_recibe||"",
		
			//Robo de cableado
			valor_estimado:data.valor_estimado||"",
			pertenencias_sustraidas:data.pertenencias_sustraidas||"",
			//robo de vehiculo
			placas:data.placas||"",
			tipo:data.tipo||"",
			marca:data.marca||"",
			modelo:data.modelo||"",
			color:data.color||"",
		},
	});



	useEffect(()=>{
		if(!modalEditarAbierto){
			resetStates()
		}
	
	},[modalEditarAbierto]);	

	const resetStates = ()=>{
		setSearch("")
		setSubCategoria("")
		setCategoria("")
		setSelectedIncidencia("")
		const catIncidenciasIcons = categoriasConIconos?.filter((cat) =>
			catIncidencias?.includes(cat.nombre)
			);
		setCatCategorias(catIncidenciasIcons)
		setCatSubIncidences([])
		setSubCatCategorias([])
		setDepositos([])
	}

	useEffect(()=>{
		if(catIncidencias){
			if(search==""){
				const catIncidenciasIcons = categoriasConIconos.filter((cat) =>
					catIncidencias.data.includes(cat.nombre)
					);
				if(catIncidenciasIcons.length>0){
					setCatCategorias(catIncidenciasIcons)
				}
			}else if(search=="cat" || search=="subCat"){
					if(catIncidencias.type=="incidence"){
						const formattedSubIncidentes = catIncidencias.data.map((nombre:string) => ({
							id: nombre,
							nombre,
							icono: ""
						}));
						setSearch("subCat")
						if(categoria && !subCategoria){
							setSubCatCategorias([])
						}
						setCatSubIncidences(formattedSubIncidentes)
					} else if (catIncidencias.type=="sub_catalog"){
						const subCatIncidenciasIcons = subCategoriasConIconos.filter((cat) =>
							catIncidencias.data.includes(cat.nombre)
						);
						// setSearch("cat")
						setSubCatCategorias(subCatIncidenciasIcons)
					}
			}
		}
	},[catIncidencias] )


	useEffect(()=>{
		if(modalEditarAbierto){
			setEvidencia(data.evidencia_incidencia)
			setDocumento(data.evidencia_incidencia)
			setDate(new Date(data.fecha_hora_incidencia))
			setCategoria(data.categoria)
			setSubCategoria(data.sub_categoria)
			setSelectedIncidencia(data.incidente)
			setDepositos(data.datos_deposito_incidencia	)
			handleOpenModal()
			
		}
	},[modalEditarAbierto])


	const handleOpenModal = async () =>{
		setLoadingCatalogos(true)
		const {catSubIncidenciasIcons, subCategories}= await LoadCategories()
		if (catSubIncidenciasIcons.length>0) {
			//Si me regresa el mismo catalogo de categorias, entonces rellenamos directo el cat Incidencias
			const subCatSubIncidenciasIcons = subCategoriasConIconos.filter((cat) =>
				subCategories.response.data.data.includes(cat.nombre)
			);
			setCatSubIncidences(subCatSubIncidenciasIcons)
		} else {
			//Si en caso de ser diferentes, reviso en las sub categorias, si existen las muestro y si no, muestro las lista de incidencias de esa sub categoria
			const subCatIcons = subCategoriasConIconos.filter((cat) =>
				subCategories.response.data.data.includes(cat.nombre)
			);
			if(subCatIcons.length > 0){
				setSubCatCategorias(subCatIcons)
			}
			await LoadIncidences();
		}
		setLoadingCatalogos(false)
	}

	const LoadCategories = async ()=>{
		try{
			const incidenciasRes = await getCatIncidencias("", "");
			const catIncidenciasIcons = categoriasConIconos.filter((cat) =>
				incidenciasRes.response.data.data.includes(cat.nombre)
			);
			setCatCategorias(catIncidenciasIcons);
			const subCategories = await getCatIncidencias(data.categoria,"");
			const catSubIncidenciasIcons = categoriasConIconos.filter((cat) =>
				subCategories.response.data.data.includes(cat.nombre)
			);
			return { catSubIncidenciasIcons, subCategories }
		}  catch {
			toast.error("Error al cargar catálogo de categorias, intenta de nuevo.");
			return { catSubIncidenciasIcons: [], subCategories: [] }
		}
	}

	const LoadIncidences = async ()=>{
		try{
			const subIncidentes = await getCatIncidencias(data.categoria,data.sub_categoria);
			const formattedSubIncidentes = subIncidentes.response.data.data.map((nombre:string) => ({
				id: nombre,
				nombre,
				icono: ""
			  }));
			setCatSubIncidences(formattedSubIncidentes)
		}  catch {
			toast.error("Error al cargar catálogo de incidencias, intenta de nuevo.");
			setCatSubIncidences([])
		}
	}

	function onSubmit(values: z.infer<typeof formSchema>) {
		let formattedDate=""
		if(date){
			formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
			const formatData ={
					reporta_incidencia: values.reporta_incidencia||"",
					fecha_hora_incidencia:formattedDate||"",
					ubicacion_incidencia:ubicacionSeleccionada||"",
					area_incidencia: values.area_incidencia||"",
					incidencia: selectedIncidencia ||"",
					comentario_incidencia: values.comentario_incidencia||"",
					tipo_dano_incidencia: values.tipo_dano_incidencia||"",
					dano_incidencia:values.dano_incidencia||"",
					personas_involucradas_incidencia: personasInvolucradas||[],
					acciones_tomadas_incidencia: accionesTomadas||[],
					evidencia_incidencia:evidencia||[],
					documento_incidencia:documento||[],
					prioridad_incidencia:values.prioridad_incidencia||"",
					notificacion_incidencia:selectedNotificacion||"",
					datos_deposito_incidencia: depositos||[],

					categoria: categoria,
					sub_categoria: subCategoria,
					incidente: selectedIncidencia,

					nombre_completo_persona_extraviada: values.nombre_completo_persona_extraviada,
					edad: values.edad,
					color_piel: values.color_piel,
					color_cabello: values.color_cabello,
					estatura_aproximada: values.estatura_aproximada,
					descripcion_fisica_vestimenta: values.descripcion_fisica_vestimenta,
					nombre_completo_responsable: values.nombre_completo_responsable,
					parentesco: values.parentesco,
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
				editarIncidenciaMutation.mutate({ data_incidencia: formatData, folio: data.folio }, {
					onSuccess: () => {
						setModalEditarAbierto(false)
					},
					onError: () => {
						setModalEditarAbierto(false)
					},
				  });
		}else{
			form.setError("fecha_hora_incidencia", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleToggleNotifications = (value:boolean)=>{
		const stringValue = !value? "no":"correo"
		setSelectedNotification(stringValue);
	}


	return (
    <Dialog open={modalEditarAbierto} onOpenChange={setModalEditarAbierto} modal>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] flex flex-col " aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
		{loadingCatalogos? (
				<div className="flex justify-center items-center h-screen">
				 	<div className="w-24 h-24 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
		   		</div>
			): (
				<>
					<div className="flex-grow overflow-y-auto p-4">
						<div className="flex gap-2 mb-4">
							<CircleAlert />
							Incidente: <span className="font-bold"> {data.incidencia}</span>
						</div>
						<Form {...form} >
							<form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
				
									<FormField
										control={form.control}
										name="categoria"
										render={({ field }:any) => (
											<FormItem className="w-full">
												<FormLabel>Categoria: * </FormLabel>
												<FormControl>
												<SelectReact
													inputId="select-categorias"
  													name="categoria"
													aria-labelledby="aria-label"
													// inputId="aria-example-input"
													// name="aria-live-color"
													options={formatValueLabel(catCategorias)}
													onChange={(value:any) =>{
														field.onChange(value.value); 
														setSearch("cat")
														setCategoria(value.value)
														setSubCategoria("")
													}}
													value={formatValueLabel(catCategorias).find(opt => opt.value === categoria) || null} 
													isDisabled={catCategorias.length==0}
												/>
												</FormControl>
												
												
												{/* <FormControl>
												<Select {...field} className="input"
													onValueChange={(value:string) => {
														field.onChange(value); 
														setSearch("cat")
														setCategoria(value)
														setSubCategoria("")
													}}
													value={categoria} 
													disabled={catCategorias.length==0}
												>
													<SelectTrigger className="w-full">
													<SelectValue placeholder="Selecciona una opcion" />
													</SelectTrigger>
													<SelectContent>
													{catCategorias?.map((cat:any) => (
														<SelectItem key={cat.id} value={cat.nombre}>
															{cat.nombre}
														</SelectItem>
													))}
													</SelectContent>
												</Select>
													</FormControl> */}
												<FormMessage />
											</FormItem>
										)}
									/>	
										<>
											<FormField
												control={form.control}
												name="sub_categoria"
												render={({ field }:any) => (
													<FormItem className="w-full">
														<FormLabel>Sub categoria: *</FormLabel>
														<FormControl>
														<SelectReact
															aria-labelledby="aria-label"
															inputId="select-categorias"
  															name="categoria"
															options={formatValueLabel(catSubCategorias)}
															onChange={(value:any) =>{
																field.onChange(value.value); 
																setSubCategoria(value.value)
															}}
															value={formatValueLabel(catSubCategorias).find(opt => opt.value === subCategoria) || null} 
															isDisabled={catSubCategorias.length==0}
														/>
														</FormControl>
														
														{/* <FormControl>
														<Select {...field} className="input"
															onValueChange={(value:string) => {
															field.onChange(value); 
															setSubCategoria(value)
														}}
														value={subCategoria} 
														disabled={catSubCategorias.length==0}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Selecciona una opcion" />
														</SelectTrigger>
														<SelectContent>
														{catSubCategorias?.map((cat:any) => (
															<SelectItem key={cat.id} value={cat.nombre}>
																{cat.nombre}
															</SelectItem>
														))}
														</SelectContent>
													</Select>
														</FormControl> */}
														<FormMessage />
													</FormItem>
												)}
											/>	
										</>
									{catSubIncidences.length > 0 ? (
										<>
											<FormField
											control={form.control}
											name="incidente"
											render={({ field }:any) => (
												<FormItem className="w-full">
													<FormLabel>Incidente: *</FormLabel>
													<FormControl>
													<SelectReact
															aria-labelledby="aria-label"
															inputId="select-categorias"
  															name="categoria"
															options={formatValueLabel(catSubIncidences)}
															onChange={(value:any) =>{
																field.onChange(value.value);
																setSearch("subCat")
																setSelectedIncidencia(value.value)
															}}
															value={formatValueLabel(catSubIncidences).find(opt => opt.value === selectedIncidencia) || null} 
															isDisabled={catSubIncidences.length==0}
														/>
													</FormControl>
												
													{/* <FormControl>
													<Select {...field} className="input"
														onValueChange={(value:string) => {
														field.onChange(value);
														setSearch("subCat")
														setSelectedIncidencia(value)
													}}
													value={selectedIncidencia} 
													disabled={catSubIncidences.length==0}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Selecciona una opcion" />
													</SelectTrigger>
													<SelectContent>
													{catSubIncidences?.map((cat:any) => (
														<SelectItem key={cat.id} value={cat.nombre}>
															{cat.nombre}
														</SelectItem>
													))}
													</SelectContent>
												</Select>
													</FormControl> */}
													<FormMessage />
												</FormItem>
											)}
											/>	
										</>
									):null}
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
												<div className="text-sm font-medium mb-7">
													Importancia: <span className="font-bold">{data.prioridad_incidencia}</span>
												</div> 
												<FormControl>
												<Slider
													defaultValue={field.value}
													value={value ?? 0}
													onValueChange={setValue}
													max={100}
													step={1}
												/>
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
									
									<div className="col-span-2  flex justify-between items-center my-2">
											<div className="w-1/2"> 
											<FormField
												control={form.control}
												name="notificacion_incidencia"
												render={() => (
													<>
														<FormLabel>Notificaciones: {`(No/Correo)`}:  </FormLabel>
														<Switch
														defaultChecked={false}
														onCheckedChange={(value:boolean) => { handleToggleNotifications(value); } }
														aria-readonly />
													</>
												)}
											/>	
											</div>

											{/* <div className="flex justify-end items-center w-full">
												<div className="cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white mr-5 rounded-sm p-1 px-3 text-center" onClick={()=>{setOpenModal(!openModal)}}>
													Agregar seguimiento 
												</div>
											</div> */}
											
									</div>


									{selectedIncidencia =="Persona extraviada" && (
										<div className="col-span-2 w-full">
											<PersonaExtraviadaFields control={form.control} ></PersonaExtraviadaFields>
										</div>
									)}

										

									{selectedIncidencia =="Robo de cableado" && (
											
										<div className="col-span-2 w-full flex flex-col ">
											<RoboDeCableado control={form.control} ></RoboDeCableado>
										</div>
									)}
									{selectedIncidencia =="Robo de vehículo" && (
										<div className="col-span-2 w-full">
											<RoboDeVehiculo control={form.control} ></RoboDeVehiculo>
										</div>
									)}
									{selectedIncidencia=="Depósitos y retiros de valores" && 
										<div className="col-span-1 md:col-span-2">
											<DepositosList depositos={depositos} setDepositos={setDepositos} ></DepositosList>
										</div>
									}
								</form>
						</Form>

						<SeguimientoIncidenciaModal
							title="Seguimiento Incidencia"
							folio={data?.folio}
							isSuccess={openModal}
							setIsSuccess={setOpenModal}
							>
							<div></div>
						</SeguimientoIncidenciaModal>

					<div className="col-span-1 md:col-span-2 mt-2">
						<PersonasInvolucradasList personasInvolucradas={personasInvolucradas} setPersonasInvolucradas={setPersonasInvolucradas} ></PersonasInvolucradasList>
					</div>
					<div className="col-span-1 md:col-span-2">
						<AccionesTomadasList accionesTomadas={accionesTomadas} setAccionesTomadas={setAccionesTomadas} ></AccionesTomadasList>
					</div>
					</div>
					<div className="flex gap-2">
						<DialogClose asChild>
							<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 sm:w-2/3 md:w-1/2 lg:w-1/2 mb-2" onClick={onClose}>
							Cancelar
							</Button>
						</DialogClose>

						
						<Button
							type="submit"
							onClick={()=>{setOpenModal(!openModal)}}
							className="w-full bg-yellow-500 hover:bg-yellow-600 text-white sm:w-2/3 md:w-1/2 lg:w-1/2 mb-2" disabled={isLoading}
						>
							{isLoading? (
							<>
								<Loader2 className="animate-spin"/> {"Agregando seguimiento..."}
							</>
						):("Agregar seguimiento")}
						</Button>


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
				</>
			)}
      </DialogContent>
    </Dialog>
  );
};
