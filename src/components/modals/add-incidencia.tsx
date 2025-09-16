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
	Edit,
	Trash2,
	List,
  } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import LoadImage from "../upload-Image";
import { Imagen } from "@/lib/update-pass";
import { useCatalogoAreaEmpleado } from "@/hooks/useCatalogoAreaEmpleado";
import { format } from 'date-fns';
import DateTime from "../dateTime";
import LoadFile from "../upload-file";
import { Loader2 } from "lucide-react";
import { AccionesTomadas, AfectacionPatrimonial, Depositos, PersonasInvolucradas } from "@/lib/incidencias";
import { useShiftStore } from "@/store/useShiftStore";
import { useInciencias } from "@/hooks/Incidencias/useIncidencias";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { Input } from "../ui/input";
import { Slider } from "../slider";
import { useCatalogoInciencias } from "@/hooks/useCatalogoIncidencias";
import { PersonaExtraviadaFields } from "./persona-extraviada";
import { RoboDeCableado } from "./robo-de-cableado";
import { RoboDeVehiculo } from "./robo-de-vehiculo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent} from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { SeguimientoIncidenciaLista } from "./add-seguimientos";
import { toast } from "sonner";
import SeccionPersonasInvolucradas from "../personas-involucradas";
import SeccionAccionesTomadas from "../acciones-tomadas";
import { AfectacionPatrimonialModal } from "./add-afectacion-patrimonial";
import { convertirDateToISO, formatCurrency, formatForMultiselect, formatForSelectString } from "@/lib/utils";
import { SeccionDepositos } from "../depositos-section";
import Select from 'react-select';

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
		nombre: "General",
		icon: <List />,
		id: 2
	},
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
	fecha_hora_incidencia: z.string().min(1, { message: "Este campo es requerido" }),
	ubicacion_incidencia: z.string().min(1, { message: "Este campo es requerido" }),
	area_incidencia: z.string().min(1, { message: "Este campo es requerido" }),
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
	datos_deposito_incidencia: z.array(
		z.object({
		  cantidad: z.number().optional(),
		  tipo_deposito: z.string().optional(),
		})
	  ).optional(),
	notificacion_incidencia: z.string().optional(),
	prioridad_incidencia: z.string().min(1, { message: "Este campo es requerido" }),
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
	edad: z.number().optional(),
	color_piel: z.string().optional(),
	color_cabello: z.string().optional(),
	estatura_aproximada: z.number().optional(),
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

	afectacion_patrimonial_incidencia:z.array(z.any()).optional(),
	personas_involucradas_incidencia: z.array(z.any()).optional(),
	acciones_tomadas_incidencia:z.array(z.any()).optional(),
	seguimientos_incidencia:z.array(z.any()).optional(),

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

	const[ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location)
	const { dataAreas:areas, dataLocations:ubicaciones} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, isSuccess,  location?true:false);
	const [personasInvolucradas, setPersonasInvolucradas] = useState<PersonasInvolucradas[]>([])
	const [accionesTomadas, setAccionesTomadas] = useState<AccionesTomadas[]>([])
	const [depositos, setDepositos] = useState<Depositos[]>([])

	const [seguimientos, setSeguimientos] = useState<any>([]);
	const [openModal, setOpenModal] = useState(false);


	const { data:dataAreaEmpleado } = useCatalogoAreaEmpleado(isSuccess, location, "Incidencias");
	const { createIncidenciaMutation , loading} = useInciencias("","",[], "", "", "");
	
	const [search, setSearch]= useState("")
	const [catSubCategorias, setSubCatCategorias] = useState<any>([])
	const [catSubIncidences, setCatSubIncidences] = useState<any>([])

	const [subCategoria, setSubCategoria]= useState("")
	const [categoria, setCategoria]= useState("")
	const [selectedIncidencia, setSelectedIncidencia]= useState("")
	const {catIncidencias, isLoadingCatIncidencias } = useCatalogoInciencias(isSuccess, categoria, subCategoria);
	const [catCategorias, setCatCategorias] = useState<any[]>([])
	
	const [selectedNotificacion, setSelectedNotification] = useState(false)
	const [value, setValue] = useState([50])
	const [inputTag, setInputTag] = useState('');
	const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>([]);

	const [indiceSeleccionado, setIndiceSeleccionado] = useState<number | null>(null);
	const [editarSeguimiento, setEditarSeguimiento] = useState(false);
	const [seguimientoSeleccionado, setSeguimientoSeleccionado] = useState(null);

	const [afectacionPatrimonialSeleccionada, setAfectacionPatrimonialSeleccionada] = useState<AfectacionPatrimonial | null>(null);
	const [afectacionPatrimonial,setAfectacionPatrimonial] = useState<AfectacionPatrimonial []>([])
	const [openAfectacionPatrimonialModal,setOpenAfectacionPatrimonialModal] = useState(false)
	const [editarAfectacionPatrimonial, setEditarAfectacionPatrimonial] = useState(false)

	const resetStates = ()=>{
		setSearch("")
		setSubCategoria("")
		setCategoria("")
		setSelectedIncidencia("")
		const catIncidenciasIcons = categoriasConIconos?.filter((cat) =>
			catIncidencias?.data.includes(cat.nombre)
			);
		
		setCatCategorias(catIncidenciasIcons)
		setCatSubIncidences([])
		setSubCatCategorias([])

		setEditarSeguimiento(false)
		setSeguimientos([])
		setSeguimientoSeleccionado(null)

		setAfectacionPatrimonial([])
		setEditarAfectacionPatrimonial(false)
		setAfectacionPatrimonialSeleccionada(null)

		setPersonasInvolucradas([])
		setAccionesTomadas([])

		setIndiceSeleccionado(null)
		setDepositos([])
		setTagsSeleccionados([])
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
			edad:0,
			color_piel:"",
			color_cabello:"",
			estatura_aproximada:0,
			descripcion_fisica_vestimenta:"",
			nombre_completo_responsable:"",
			parentesco:"",
			num_doc_identidad:"",
			telefono:"",
			info_coincide_con_videos:"",
			responsable_que_entrega:"",
			responsable_que_recibe:"",
		
			//Grupos repetitivos
			afectacion_patrimonial_incidencia:[],
			personas_involucradas_incidencia: [],
			acciones_tomadas_incidencia:[],
			seguimientos_incidencia:[],

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
			setSeguimientoSeleccionado(null)
			setEditarSeguimiento(false)
			setIndiceSeleccionado(null)
			setSeguimientos([])
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
					evidencia_incidencia:evidencia||[],
					documento_incidencia:documento||[],
					prioridad_incidencia:getNivel(value[0])||"",
					notificacion_incidencia:selectedNotificacion? "sí":"no",
					datos_deposito_incidencia: depositos,
					tags:tagsSeleccionados,
					categoria:categoria,
					sub_categoria:subCategoria,
					incidente:selectedIncidencia,

					//Grupos repetitivos
					afectacion_patrimonial_incidencia:afectacionPatrimonial,
					personas_involucradas_incidencia:personasInvolucradas||[],
					acciones_tomadas_incidencia:accionesTomadas||[],
					seguimientos_incidencia:seguimientos,

					//Perosona extraviada
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
					// responsable_que_recibe: values.responsable_que_recibe,
				
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
		if (val < 35) return "Leve"
		if (val > 34 && val < 70) return "Moderada"
		if (val > 70) return "Critica"
	}

	const openModalAgregarSeg = () =>{
		setOpenModal(!openModal)
	}

	
	const handleEdit = (item: any, index: number) => {
		setEditarSeguimiento(true)
		setSeguimientoSeleccionado(item);
		setIndiceSeleccionado(index);
		setOpenModal(true); // abre el modal
	};
	
	const handleDelete = (index: number) => {
		const nuevosSeguimientos = [...seguimientos];
		nuevosSeguimientos.splice(index, 1); // elimina por índice
		setSeguimientos(nuevosSeguimientos);
		toast.success("Seguimiento eliminado correctamente.")
	  };


	  	
	const handleEditAP = (item: any, index: number) => {
		setEditarAfectacionPatrimonial(true)
		setAfectacionPatrimonialSeleccionada(item);
		setIndiceSeleccionado(index);
		setOpenAfectacionPatrimonialModal(true); // abre el modal
	};
	
	const handleDeleteAP = (index: number) => {
		const nuevoAP = [...afectacionPatrimonial];
		nuevoAP.splice(index, 1); 
		setAfectacionPatrimonial(nuevoAP);
		toast.success("Afectación patrimonial eliminada correctamente.")
	  };

  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogContent className="max-w-5xl overflow-y-auto max-h-[80vh] min-h-[80vh]  flex flex-col overflow-hidden"  onInteractOutside={(e) => e.preventDefault()}  aria-describedby="">
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
									setCategoria("");
									setSubCategoria("");
									setSelectedIncidencia("")
								}else{
									setSearch("cat");
									setCategoria(categoria)
								}
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
				<div className="flex-grow overflow-y-auto ">
					<Tabs defaultValue="datos" >
						<TabsList>
							<TabsTrigger value="datos">Datos</TabsTrigger>
							<TabsTrigger value="afectacion">Afectación Patrimonial</TabsTrigger>
							<TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
						</TabsList>

						<TabsContent value="datos" >
						<Card className="p-3 h-full">
							<div >
								<div className="flex gap-2 mb-4">
									<CircleAlert />
									Incidente: <span className="font-bold">{categoria} / {subCategoria} / {selectedIncidencia} </span> 
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
													<Select 
														placeholder="Reporta"
														className="border border-slate-100 rounded-2xl"
														options={ dataAreaEmpleado && dataAreaEmpleado.length>0? formatForMultiselect(dataAreaEmpleado):[] } 
														value = {
															formatForMultiselect(dataAreaEmpleado).find(option => option.value === field.value) || ""
														  }
														onChange={(selectedOption) => {
															if (selectedOption && typeof selectedOption === 'object' && 'value' in selectedOption) {
																field.onChange(selectedOption.value);
															  } else {
																field.onChange('');
															  }
														  }}
														isClearable
														// value={field.value} 
														styles={{
															menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
														}}
													/>
													<FormMessage />
												</FormItem>
												// <FormItem className="w-full">
												// 	<FormLabel>Reporta:</FormLabel>
												// 	<FormControl>
												// 	<Select {...field} className="input"
												// 		onValueChange={(value:string) => {
												// 		field.onChange(value); 
												// 	}}
												// 	value={field.value} 
												// >
												// 	<SelectTrigger className="w-full">
												// 	{loadingAreaEmpleado?(<>
												// 			<SelectValue placeholder="Cargando opciones..." />
												// 		</>):(<>
												// 			<SelectValue placeholder="Selecciona una opcion" />
												// 		</>)}
												// 	</SelectTrigger>
												// 	<SelectContent>
												// 	{dataAreaEmpleado?.map((vehiculo:string, index:number) => (
												// 		<SelectItem key={index} value={vehiculo}>
												// 			{vehiculo}
												// 		</SelectItem>
												// 	))}
												// 	</SelectContent>
												// </Select>
												// 	</FormControl>
												// 	<FormMessage />
												// </FormItem>
											)}
										/>	
										<FormField
											control={form.control}
											name="ubicacion_incidencia"
											render={({ field }:any) => (
												<FormItem>
													<FormLabel>Ubicación:</FormLabel>
													<Select 
														placeholder="Reporta"
														className="border border-slate-100 rounded-2xl"
														value={formatForSelectString(ubicacionSeleccionada)}
														options={ formatForMultiselect(ubicaciones)} 
														onChange={(selectedOption) => {
															field.onChange(selectedOption ? selectedOption.value :"");
															setUbicacionSeleccionada(selectedOption?.value ?? ""); 
														  }}
														isClearable
														styles={{
															menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
														}}
													/>
													
													{/* <Select 
														placeholder="Ubicación"
														className=" border border-slate-100 rounded-2xl"
														options={ubicaciones && ubicaciones.length>0 ? formatForMultiselect(ubicaciones):[] }  
														value={ubicacionSeleccionada}
														onChange={(selectedOption) => {
															field.onChange(selectedOption?.value ?? "");
															setUbicacionSeleccionada(selectedOption?.value ?? ""); 
														  }}
														isClearable
														menuPortalTarget={document.body}
														styles={{
															menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
														}}
														/> */}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="area_incidencia"
											render={({ field }:any) => (
												<FormItem>
													<FormLabel>Área de la incidencia: *
													</FormLabel>
													<Select 
														placeholder="Área de la incidencia"
														className="border border-slate-100 rounded-2xl"
														options={ areas && areas.length>0 ? formatForMultiselect(areas):[]} 
														onChange={(selectedOption: any) => {
															console.log("valor", selectedOption.value)
															field.onChange(selectedOption ? selectedOption.value :"");
														}}
														isClearable
														value={
															formatForMultiselect(areas).find(option => option.value === field.value) || ""
														  }
														styles={{
															menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
														}}
														/>
													<FormMessage />
												</FormItem>
												// <FormItem className="w-full">
												// 	<FormLabel>Area de la incidencia: *</FormLabel>
												// 	<FormControl>
												// 	<Select {...field} className="input"
												// 		onValueChange={(value:string) => {
												// 		field.onChange(value); 
												// 	}}
												// 	value={field.value} 
												// >
												// 	<SelectTrigger className="w-full">
												// 		{loadingAreas ? (
												// 			<SelectValue placeholder="Cargando áreas..." />
												// 		):(
												// 			<SelectValue placeholder="Selecciona una opción" />
												// 		)}
												// 	</SelectTrigger>
												// 	<SelectContent>
												// 	{areas? (
												// 		<>
												// 		{areas?.map((vehiculo:string, index:number) => (
												// 			<SelectItem key={index} value={vehiculo}>
												// 				{vehiculo}
												// 			</SelectItem>
												// 		))}
												// 		</>
												// 	):(
												// 		<>
												// 		<SelectItem key={0} value={"0"} disabled>
												// 			No hay opciones disponibles
												// 		</SelectItem>
												// 		</>
												// 	)}
													
												// 	</SelectContent>
												// </Select>
												// 	</FormControl>
												// 	<FormMessage />
												// </FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="prioridad_incidencia"
											defaultValue="media"
											render={() => (
												<FormItem className="w-3/4">
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

										<div className="flex items-center flex-wrap gap-5">
											<FormLabel>Notificaciones: {`(No/Correo)`}:  </FormLabel>
												<Switch
													defaultChecked={false}
													onCheckedChange={()=>{setSelectedNotification(!selectedNotificacion)}}
													aria-readonly
												/>
										</div>
										
										<FormField
										control={form.control}
										name="comentario_incidencia"
										render={({ field }:any) => (
											<FormItem className="col-span-1 md:col-span-2">
											<FormLabel>Descripción: *</FormLabel>
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
											<SeccionDepositos depositos={depositos} setDepositos={setDepositos} ></SeccionDepositos>
										</div>
										}
									</form>
								</Form>
						
								<div className="col-span-1 md:col-span-2">
									<SeccionPersonasInvolucradas personasInvolucradas={personasInvolucradas} setPersonasInvolucradas={setPersonasInvolucradas} ></SeccionPersonasInvolucradas>
								</div>
								<div className="col-span-1 md:col-span-2">
									<SeccionAccionesTomadas accionesTomadas={accionesTomadas} setAccionesTomadas={setAccionesTomadas} ></SeccionAccionesTomadas>
								</div>
							</div>
						</Card>
						</TabsContent>

						<TabsContent value="seguimiento" >
						<Card className="p-3 h-screen">
							<div >
								<div className="flex gap-2 mb-4">
									<div className="w-full flex gap-2">
										<CircleAlert />
										Incidente: <span className="font-bold">{categoria} / {subCategoria} / {selectedIncidencia} </span> 
									</div>

									<div className="flex justify-end items-center w-full">
										<div className="cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white mr-5 rounded-md p-2 px-4 text-center text-sm" onClick={()=>{openModalAgregarSeg()}}>
											Agregar 
										</div>
									</div>
								</div>
							</div>
							<div >
								<table className="min-w-full table-auto mb-5 border">
									<thead>
									<tr className="bg-gray-100">
										<th className="px-4 py-2 text-left border-b border-gray-300">Fecha y hora</th>
										<th className="px-4 py-2 text-left border-b border-gray-300">Tiempo transcurrido</th>
										<th className="px-4 py-2 text-left border-b border-gray-300">Acción realizada</th>
										<th className="px-4 py-2 text-left border-b border-gray-300">Personas involucradas</th>
										<th className="px-4 py-2 text-left border-b border-gray-300">Evidencia</th>
										<th className="px-4 py-2 text-left border-b border-gray-300">Documentos</th>
										<th className="px-4 py-2 text-left border-b border-gray-300"></th> 
									</tr>
									</thead>
									<tbody>
									{seguimientos && seguimientos.length > 0 ? (
										seguimientos.map((item: any, index: number) => (
											<tr key={index} className="border-t border-gray-200">
											<td className="px-4 py-2">{item?.fecha_inicio_seg || "-"}</td>
											<td className="px-4 py-2">{item?.tiempo_transcurrido == "La fecha es anterior a la fecha de la incidencia." ? ( <div className="text-red-500"> {item?.tiempo_transcurrido }</div> ): item?.tiempo_transcurrido}</td>
											<td className="px-4 py-2 max-w-[200px] truncate" title={item?.accion_correctiva_incidencia || "-"}> {item?.accion_correctiva_incidencia || "-"} </td>
											<td className="px-4 py-2">{item?.incidencia_personas_involucradas || "-"}</td>

											<td className="px-4 py-2 min-w-[150px] ">
												{item?.incidencia_evidencia_solucion?.length > 0 ? (
												<div className="w-full flex justify-center">
													<Carousel className="w-16">
													<CarouselContent>
														{item.incidencia_evidencia_solucion.map((a: any, i: number) => (
														<CarouselItem key={i}>
															<Card>
															<CardContent className="flex aspect-square items-center justify-center p-0">
																<Image
																width={280}
																height={280}
																src={a?.file_url || "/nouser.svg"}
																alt="Imagen"
																className="w-42 h-42 object-contain bg-gray-200 rounded-lg border"
																/>
															</CardContent>
															</Card>
														</CarouselItem>
														))}
													</CarouselContent>
													<CarouselPrevious />
													<CarouselNext />
													</Carousel>
												</div>
												) : (
													<div className="flex justify-center">-</div>
												)}
											</td>

											<td className="px-4 py-2">
												{item?.incidencia_documento_solucion?.length > 0 ? (
												<ul className="ms-2">
													{item.incidencia_documento_solucion.map((file: any, i: number) => (
													<li key={i}>
														<a
														href={file?.file_url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-600 hover:underline"
														>
														<p>{file.file_name}</p>
														</a>
													</li>
													))}
												</ul>
												) : (
													<div className="flex justify-center">-</div>
													)}
											</td>

											<td className="flex items-center justify-center gap-2 mt-2 px-2">
												<div
												title="Editar"
												className="hover:cursor-pointer text-blue-500 hover:text-blue-600"
												onClick={() => handleEdit(item, index)}
												>
													<Edit/>
												</div>
												<div
												title="Borrar"
												className="hover:cursor-pointer text-red-500 hover:text-red-600"
												onClick={() => handleDelete(index)}
												>
													<Trash2/>
												</div>
											</td>
											</tr>
										))) : (
											<tr>
											<td colSpan={8} className="text-center text-gray-500 py-4">
												No se han agregado seguimientos.
											</td>
											</tr>
											)}
									</tbody>
								</table>
								
							</div>

						</Card>
						</TabsContent>

						<TabsContent value="afectacion">
							<Card className="p-3 h-screen">
							<div >
								<div className="flex gap-2 mb-4">
									<div className="w-full flex gap-2">
										<CircleAlert />
										Incidente: <span className="font-bold">{categoria} / {subCategoria} / {selectedIncidencia} </span> 
									</div>

									<div className="flex justify-end items-center w-full">
										<div className="cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white mr-5 rounded-md p-2 px-4 text-center text-sm" onClick={()=>{setOpenAfectacionPatrimonialModal(!openAfectacionPatrimonialModal)}}>
											Agregar 
										</div>
									</div>
								</div>
								
							</div>

								<div >
								
									<table className="min-w-full table-auto mb-5 border">
										<thead>
										<tr className="bg-gray-100">
											<th className="px-4 py-2 text-left border-b border-gray-300">Tipo de Afectación</th>
											{/* <th className="px-4 py-2 text-left border-b border-gray-300">Descripción de la afectación</th> */}
											<th className="px-4 py-2 text-left border-b border-gray-300">Monto Estimado de Daño ($)</th>
											<th className="px-4 py-2 text-left border-b border-gray-300">Duración Estimada Afectación</th>
											<th className="px-4 py-2 text-left border-b border-gray-300"></th>
										</tr>
										</thead>
										<tbody>
										{afectacionPatrimonial && afectacionPatrimonial.length > 0 ? (
											afectacionPatrimonial.map((item: any, index: number) => (
												<tr key={index} className="border-t border-gray-200">
												<td className="px-4 py-2">{item?.tipo_afectacion || "-"}</td>
												{/* <td className="px-4 py-2 max-w-[200px] truncate" title={item?.descripcion_afectacion || "-"}> {item?.descripcion_afectacion || "-"} </td> */}
												<td className="px-4 py-2 text-right">{formatCurrency(item?.monto_estimado) || "-"}</td>
												<td className="px-4 py-2">{item?.duracion_estimada || "-"}</td>
												<td className="flex items-center justify-center gap-2 mt-4">
													<div
													title="Editar"
													className="hover:cursor-pointer text-blue-500 hover:text-blue-600"
													onClick={() => handleEditAP(item, index)}
													>
														<Edit/>
													</div>
													<div
													title="Borrar"
													className="hover:cursor-pointer text-red-500 hover:text-red-600"
													onClick={() => handleDeleteAP(index)}
													>
														<Trash2/>
													</div>
												</td>
												</tr>
											))) : (
												<tr>
												<td colSpan={8} className="text-center text-gray-500 py-4">
													No se han agregado afectaciones patrimoniales.
												</td>
												</tr>
											)}
										</tbody>
									</table>
									
								</div>
							</Card>
						</TabsContent>
					</Tabs>
				</div>

				<div className="flex gap-2">
					<DialogClose asChild>
						<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 sm:w-2/3 md:w-1/2 lg:w-1/2 " onClick={handleClose}>
						Cancelar
						</Button>
					</DialogClose>

					
					<Button
						type="submit"
						onClick={form.handleSubmit(onSubmit)}
						className="w-full bg-blue-500 hover:bg-blue-600 text-white sm:w-2/3 md:w-1/2 lg:w-1/2" disabled={isLoading}
					>
						{isLoading? (
						<>
							<Loader2 className="animate-spin"/> {"Creando incidencia..."}
						</>
					):("Crear incidencia")}
					</Button>
				</div>

				{Object.keys(form.formState.errors).length > 0 && (
					<div className=" w-full text-red-600 text-sm">
						Completa todos los campos requeridos antes de continuar.
					</div>
				)}
				</>
				
			)}
			<SeguimientoIncidenciaLista
				title="Seguimiento Incidencia"
				isSuccess={openModal}
				setIsSuccess={setOpenModal}
				seguimientoSeleccionado={seguimientoSeleccionado}
				setSeguimientos={setSeguimientos}
				setEditarSeguimiento={setEditarSeguimiento}
				editarSeguimiento={editarSeguimiento}
				indice={indiceSeleccionado}
				dateIncidencia={date ? convertirDateToISO(date) : ""}
				enviarSeguimiento={false}
				folioIncidencia={""}
				estatusIncidencia=""
				>
				<div></div>
			</SeguimientoIncidenciaLista>

			<AfectacionPatrimonialModal
				title="Afectación Patrimonial"
				openAfectacionPatrimonialModal={openAfectacionPatrimonialModal}
				setOpenAfectacionPatrimonialModal={setOpenAfectacionPatrimonialModal}
				afectacionPatrimonialSeleccionada={afectacionPatrimonialSeleccionada}
				setAfectacionPatrimonial={setAfectacionPatrimonial}
				setEditarAfectacionPatrimonial={setEditarAfectacionPatrimonial}
				editarAfectacionPatrimonial={editarAfectacionPatrimonial}
				indice={indiceSeleccionado}
				>
				<div></div>
			</AfectacionPatrimonialModal>

          
      </DialogContent>
    </Dialog>
  );
};
