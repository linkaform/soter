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
import { Switch } from "@/components/ui/switch"
import {
	CircleDollarSign,
	VenetianMask,
	Car,
	TriangleAlert,
	HeartPulse,
	Cctv,
	Drill,
	UserRoundMinus,
	Boxes,
	CircleHelp,
	BrickWall,
	SprayCan,
	Grab,
	UserX,
	LockKeyholeOpen,
	DoorOpen,
	Siren,
	MegaphoneOff,
	PackageMinus,
	Skull,
	Shield,
	ChevronRight,
	ChevronLeft,
	CircleAlert,
  } from "lucide-react";

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
import { Loader2 } from "lucide-react";
import { AccionesTomadas, Depositos, PersonasInvolucradas } from "@/lib/incidencias";
import PersonasInvolucradasList from "../personas-involucradas-list";
import AccionesTomadasList from "../acciones-tomadas-list";
import { useShiftStore } from "@/store/useShiftStore";
import { useInciencias } from "@/hooks/Incidencias/useIncidencias";
// import DepositosList from "../depositos-list";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { Input } from "../ui/input";
import { Slider } from "../slider";
import { useCatalogoInciencias } from "@/hooks/useCatalogoIncidencias";
import { PersonaExtraviadaFields } from "./persona-extraviada";
import { RoboDeCableado } from "./robo-de-cableado";
import { RoboDeVehiculo } from "./robo-de-vehiculo";
import DepositosList from "../depositos-list";

interface AddIncidenciaModalProps {
  	title: string;
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
	onClose: ()=> void;
}

export const categoriasConIconos = [
	{
	  nombre: "Fraude y extorsión",
	  icon: <CircleDollarSign />,
	  id: 1
	},
	{
	  nombre: "Intrusión y seguridad",
	  icon: <VenetianMask />,
	  id: 2
	},
	{
	  nombre: "Incidentes de tránsito",
	  icon: <Car />,
	  id: 3
	},
	{
	  nombre: "Accidentes",
	  icon: <TriangleAlert />,
	  id: 4
	},
	{
	  nombre: "Emergencias médicas",
	  icon: <HeartPulse />,
	  id: 5
	},
	{
	  nombre: "Delitos contra la propiedad",
	  icon: <Cctv />,
	  id: 6
	},
	{
	  nombre: "Daños y fallas operativas",
	  icon: <Drill />,
	  id: 7
	},
	{
	  nombre: "Delitos contra las personas",
	  icon: <UserRoundMinus />,
	  id: 8
	},
	{
	  nombre: "Emergencias e incendios",
	  icon: <BrickWall />,
	  id: 9
	},
	{
	  nombre: "Operaciones Internas y Logística",
	  icon: <Boxes />,
	  id: 10
	},
	{
	  nombre: "Otros",
	  icon: <CircleHelp />,
	  id: 11
	},
	{
	  nombre: "Borrar",
	  icon: <Cctv />, 
	  id: 12
	}
  ];
export const subCategoriasConIconos = [
	{
	  nombre: "Vandalismo",
	  icon: <SprayCan />,
	  id: 2
	},
	{
	  nombre: "Asalto",
	  icon: <Grab />,
	  id: 3
	},
	{
	  nombre: "Agresiones y altercados",
	  icon: <UserX />,
	  id: 4
	},
	{
	  nombre: "Seguridad",
	  icon: <LockKeyholeOpen />,
	  id: 5
	},
	{
	  nombre: "Intrusión",
	  icon: <DoorOpen />,
	  id: 6
	},
	{
	  nombre: "Sospechosos",
	  icon: <Siren />,
	  id: 7
	},
	{
	  nombre: "Alteración del orden",
	  icon: <MegaphoneOff />,
	  id: 8
	},
	{
	  nombre: "Robo",
	  icon: <PackageMinus />,
	  id: 9
	},
	{
	  nombre: "Acoso/discriminación",
	  icon: <TriangleAlert />,
	  id: 10
	},
	{
	  nombre: "Homicidio",
	  icon: <Skull />,
	  id: 11
	},
	{
	  nombre: "Operativos varios",
	  icon: <Shield />,
	  id: 12
	}
  ];
  
export const formSchema = z.object({
	reporta_incidencia: z.string().optional(),
	fecha_hora_incidencia: z.string().optional(),
	ubicacion_incidencia: z.string().optional(),
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
	notificacion_incidencia: z.string().optional(),
	prioridad_incidencia: z.string().optional(),
	dano_incidencia: z.string().optional(),
	tipo_dano_incidencia: z.string().optional(),
	comentario_incidencia: z.string().min(1, { message: "Este campo es requerido" }),
	incidencia: z.string().optional(),
	tags: z.array(z.string()).optional(),

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

export const AddIncidenciaModal: React.FC<AddIncidenciaModalProps> = ({
  	title,
	isSuccess,
	setIsSuccess,
}) => {
	const { location, isLoading } = useShiftStore();
	const [evidencia , setEvidencia] = useState<Imagen[]>([]);
	const [documento , setDocumento] = useState<Imagen[]>([]);
	const [date, setDate] = useState<Date|"">("");

	// const [incidencia, setIncidencia] = useState("")
	const[ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location)
	const { dataAreas:areas, dataLocations:ubicaciones,isLoadingAreas:loadingAreas, isLoadingLocations:loadingUbicaciones} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, isSuccess,  location?true:false);
	// const [catAreas, setCatAreas] = useState<any| string[]>(areas);
	const [personasInvolucradas, setPersonasInvolucradas] = useState<PersonasInvolucradas[]>([])
	const [accionesTomadas, setAccionesTomadas] = useState<AccionesTomadas[]>([])
	const [depositos, setDepositos] = useState<Depositos[]>([])
	const { data:dataAreaEmpleado, isLoading:loadingAreaEmpleado } = useCatalogoAreaEmpleado(isSuccess, location, "Incidencias");
	const { createIncidenciaMutation , loading} = useInciencias("","",[], "", "", "");
	
	const [search, setSearch]= useState("")
	const [catSubCategorias, setSubCatCategorias] = useState<any>([])
	const [catSubIncidences, setCatSubIncidences] = useState<any>([])

	const [subCategoria, setSubCategoria]= useState("")
	const [categoria, setCategoria]= useState("")
	const [selectedIncidencia, setSelectedIncidencia]= useState("")
	const { catIncidencias, isLoadingCatIncidencias } = useCatalogoInciencias(isSuccess, categoria, subCategoria);
	const [catCategorias, setCatCategorias] = useState<any[]>([])
	
	const [selectedNotificacion, setSelectedNotification] = useState("no")
	const [value, setValue] = useState([50])
	const [inputTag, setInputTag] = useState('');
	const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>([]);



	const resetStates = ()=>{
		setSearch("")
		setSubCategoria("")
		setCategoria("")
		setSelectedIncidencia("")
		console.log("cxatIncidencias", catIncidencias)
		const catIncidenciasIcons = categoriasConIconos?.filter((cat) =>
			catIncidencias?.data.includes(cat.nombre)
			);
		
		setCatCategorias(catIncidenciasIcons)
		setCatSubIncidences([])
		setSubCatCategorias([])
		setDepositos([])
	}
	const agregarTag = () => {
		const nuevoTag = inputTag.trim();
		if (nuevoTag && !tagsSeleccionados.includes(nuevoTag)) {
		setTagsSeleccionados([...tagsSeleccionados, nuevoTag]);
		setInputTag('');
		}
	};
  
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
					setSubCatCategorias([])
					setCatSubIncidences(formattedSubIncidentes)
				}else if (catIncidencias.type == "sub_catalog"){
					const subCatIncidenciasIcons = subCategoriasConIconos.filter((cat) =>
						catIncidencias.data.includes(cat.nombre)
					);
					setSearch("cat")
					setSubCatCategorias(subCatIncidenciasIcons)
				}
			}
		}
	},[catIncidencias] )

	const quitarTag = (tag: string) => {
		setTagsSeleccionados(tagsSeleccionados.filter((t) => t !== tag));
	};
	

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			reporta_incidencia: "",
			fecha_hora_incidencia:"",
			ubicacion_incidencia:"",
			area_incidencia: "",
			incidencia:"",
			comentario_incidencia: "",
			tipo_dano_incidencia: "",
			dano_incidencia:"",
			personas_involucradas_incidencia:personasInvolucradas,
			acciones_tomadas_incidencia: accionesTomadas,
			evidencia_incidencia: evidencia,
			documento_incidencia:documento,
			prioridad_incidencia:"",
			notificacion_incidencia:"",
			datos_deposito_incidencia: depositos,
			tags:[],
			categoria:"",
			sub_categoria:"",
			incidente:"",

			nombre_completo_persona_extraviada:"",
			edad:"",
			color_piel:"",
			color_cabello:"",
			estatura_aproximada:"",
			descripcion_fisica_vestimenta:"",
			nombre_completo_responsable:"",
			parentesco:"",
			num_doc_identidad:"",
			telefono:"",
			info_coincide_con_videos:"",
			responsable_que_entrega:"",
			responsable_que_recibe:"",
		
			//Robo de cableado
			valor_estimado:"",
			pertenencias_sustraidas:"",
			//robo de vehiculo
			placas:"",
			tipo:"",
			marca:"",
			modelo:"",
			color:"",

		},
	});

	const { reset } = form;

	useEffect(()=>{
		if(!isSuccess)
			resetStates()
			reset()
			setDate(new Date())
			setEvidencia([])
			setDocumento([])
			console.log("ubicacion seleccionada", location)
			setUbicacionSeleccionada(location)
	},[isSuccess]);	

	useEffect(()=>{
		if(form.formState.errors){
			console.log("console log", form.formState.errors)
		}
	},[form.formState.errors])

	useEffect(()=>{
		if(!loading){
			handleClose()			
		}
	},[loading])

	const handleToggleNotifications = (value:string)=>{
		setSelectedNotification(value);
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
					incidencia:selectedIncidencia||"",
					comentario_incidencia: values.comentario_incidencia||"",
					tipo_dano_incidencia: values.tipo_dano_incidencia||"",
					dano_incidencia:values.dano_incidencia||"",
					personas_involucradas_incidencia: personasInvolucradas||[],
					acciones_tomadas_incidencia: accionesTomadas||[],
					evidencia_incidencia:evidencia||[],
					documento_incidencia:documento||[],
					prioridad_incidencia:getNivel(value[0])||"",
					notificacion_incidencia:selectedNotificacion||"",
					datos_deposito_incidencia: depositos,
					tags:tagsSeleccionados,
					categoria:categoria,
					sub_categoria:subCategoria,
					incidente:selectedIncidencia,

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
				createIncidenciaMutation.mutate({ data_incidencia: formatData });
		}else{
			form.setError("fecha_hora_incidencia", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleClose = () => {
		setIsSuccess(false); 
	};

	const getNivel = (val: number) => {
		if (val < 35) return "Baja"
		if (val < 70) return "Media"
		return "Alta"
	}

  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogContent className="max-w-4xl overflow-y-auto max-h-[80vh] min-h-[80vh]  flex flex-col overflow-hidden" aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

			{isLoadingCatIncidencias? (
				<div className="flex justify-center items-center h-screen">
				 	<div className="w-24 h-24 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
		   		</div>
			): (
				<div className="flex-grow overflow-y-auto">
					{!selectedIncidencia && search =="" &&
						<>
							
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
								{catCategorias.map((cat:any) => (
									<div
									key={cat.id}
									onClick={() => { 
										setSearch("cat")
										setCategoria(cat.nombre)
									}}
									className="p-4 bg-white rounded shadow hover:bg-gray-100 cursor-pointer flex flex-col  items-center text-center"
									>
									<div className="text-3xl mb-2 text-blue-600">
										{cat.icon}
									</div>
									<div className="text-sm font-medium">{cat.nombre}</div>
									</div>
								))}
							</div>
						</>
					}

					{ !selectedIncidencia && search == "cat" &&
						<>
							<button
							onClick={() => {
								setSearch("");  
								setSelectedIncidencia("")
								}
							}
							className="flex items-center gap-1 mb-2 text-blue-600 hover:text-blue-800"
							>
								<ChevronLeft className="w-5 h-5" />
								<span>Atrás</span>
							</button>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{catSubCategorias?.map((cat:any) => (
									<div
									key={cat.id}
									onClick={() => { 
										setSearch("subCat")
										setSubCategoria(cat.nombre)
									}}
									className="p-4 bg-white rounded shadow hover:bg-gray-100 cursor-pointer flex flex-col  items-center text-center"
									>
									<div className="text-3xl mb-2 text-blue-600">
										{cat.icon}
									</div>
									<div className="text-sm font-medium">{cat.nombre}</div>
									</div>
								))}
							</div>
						</>
					}

					{!selectedIncidencia &&  search == "subCat" &&
						<>
							<button
							onClick={() => {
								if(catSubCategorias.length==0){
									setSearch("");
								}else{
									setSearch("cat");
								}
								setSubCategoria("")

								setSelectedIncidencia("")
								}
							}
							className="flex items-center gap-1 mb-2 text-blue-600 hover:text-blue-800"
							>
								<ChevronLeft className="w-5 h-5" />
								<span>Atrás</span>
							</button>
							<div className="flex flex-col w-full">
								{catSubIncidences?.map((cat:any) => (
									<div
									key={cat.id}
									onClick={() => { 
										setSearch("incidencia")
										setSelectedIncidencia(cat.nombre)
									}}
									className="p-1 bg-white rounded hover:bg-gray-100 cursor-pointer flex justify-between"
									>
									<div className="text-sm font-medium">{cat.nombre}</div>
									<ChevronRight className="w-4 h-4 text-gray-500" />

									</div>
								))}
							</div>
						</>
					}
				</div>
			)}
			{selectedIncidencia && (
				<>
					<div className="flex-grow overflow-y-auto p-1">
						<div className="flex gap-2 mb-4">
							<CircleAlert />
							Incidente: <span className="font-bold"> {selectedIncidencia}</span>
						</div>
						<Form {...form} >
							<form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">

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
									name="ubicacion_incidencia"
									render={({ field }:any) => (
										<FormItem>
											<FormLabel>Ubicacion:</FormLabel>
											<FormControl>
											<Select {...field} className="input"
												onValueChange={(value:string) => {
												field.onChange(value); 
												setUbicacionSeleccionada(value); 
											}}
											value={ubicacionSeleccionada} 
										>
											<SelectTrigger className="w-full">
												{loadingUbicaciones?
												<SelectValue placeholder="Cargando ubicaciones..." />:<SelectValue placeholder="Selecciona una ubicación" />}
											</SelectTrigger>
											<SelectContent>
											{ubicaciones?.map((vehiculo:string, index:number) => (
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
									name="area_incidencia"
									render={({ field }:any) => (
										<FormItem className="w-full">
											<FormLabel>Area de la incidencia: *</FormLabel>
											<FormControl>
											<Select {...field} className="input"
												onValueChange={(value:string) => {
												field.onChange(value); 
											}}
											value={field.value} 
										>
											<SelectTrigger className="w-full">
												{loadingAreas ? (
													<SelectValue placeholder="Cargando áreas..." />
												):(
													<SelectValue placeholder="Selecciona una opción" />
												)}
											</SelectTrigger>
											<SelectContent>
											{areas? (
												<>
												{areas?.map((vehiculo:string, index:number) => (
													<SelectItem key={index} value={vehiculo}>
														{vehiculo}
													</SelectItem>
												))}
												</>
											):(
												<>
												<SelectItem key={0} value={"0"} disabled>
													No hay opciones disponibles
												</SelectItem>
												</>
											)}
											
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
									defaultValue="media"
									render={() => (
										<FormItem className="w-full">
												<div className="text-sm font-medium mb-7">
													Importancia: <span className="font-bold">{getNivel(value[0])}</span>
												</div> 
											<FormControl>
												<Slider
													defaultValue={[50]}
													value={value}
													onValueChange={setValue}
													max={100}
													step={1}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>	
								
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


								<div className="space-y-3">
									<div className="text-sm font-medium ">
										Tags: 
									</div> 
								<div className="flex items-center gap-2">
									<Input
									placeholder="Escribe un tag... (ej: #Urgente)"
									value={inputTag}
									onChange={(e) => setInputTag(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
										e.preventDefault();
										agregarTag();
										}
									}}
									/>
									<Button type="button" onClick={agregarTag}>Agregar</Button>
								</div>
									<div className="flex flex-wrap gap-2">
										{tagsSeleccionados.map((tag, index) => (
										<div
											key={index}
											className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
										>
											{tag}
											<button
											onClick={() => quitarTag(tag)}
											className="ml-2 text-blue-500 hover:text-blue-700 font-bold"
											>
											&times;
											</button>
										</div>
										))}
									</div>
								</div>

							
								<div className="flex items-center flex-wrap gap-5">
									<FormLabel>Notificaciones: {`(No/Correo)`}:  </FormLabel>
										<Switch
											defaultChecked={false}
											onCheckedChange={()=>{handleToggleNotifications("no")}}
											aria-readonly
										/>
								</div>
      
								{selectedIncidencia =="Persona extraviada" && (
									<div className="col-span-2 w-full">
										<PersonaExtraviadaFields control={form.control}></PersonaExtraviadaFields>
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
								{selectedIncidencia=="Depósitos y retiros de valores" && 
								<div className="col-span-1 md:col-span-2">
									<DepositosList depositos={depositos} setDepositos={setDepositos} ></DepositosList>
								</div>
								}
							</form>
						</Form>
				
						<div className="col-span-1 md:col-span-2">
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
								<Loader2 className="animate-spin"/> {"Creando incidencia..."}
							</>
						):("Crear incidencia")}
						</Button>
					</div>
				</>
			)}
		
          
      </DialogContent>
    </Dialog>
  );
};
