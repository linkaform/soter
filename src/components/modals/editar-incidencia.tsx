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
// import { Select ,SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import LoadImage from "../upload-Image";
import { Imagen } from "@/lib/update-pass";
import { useCatalogoAreaEmpleado } from "@/hooks/useCatalogoAreaEmpleado";
import { format } from 'date-fns';
import DateTime from "../dateTime";
import LoadFile from "../upload-file";
import { CircleAlert, Edit, Eye, Loader2, Trash2 } from "lucide-react";
import { AccionesTomadas, AfectacionPatrimonial, Depositos, PersonasInvolucradas } from "@/lib/incidencias";
import { useShiftStore } from "@/store/useShiftStore";
import { useInciencias } from "@/hooks/Incidencias/useIncidencias";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { PersonaExtraviadaFields } from "./persona-extraviada";
import { RoboDeCableado } from "./robo-de-cableado";
import { RoboDeVehiculo } from "./robo-de-vehiculo";
import { categoriasConIconos } from "./add-incidencia";
import { useCatalogoInciencias } from "@/hooks/useCatalogoIncidencias";
import { Slider } from "../slider";
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import SeccionPersonasInvolucradas from "../personas-involucradas";
import SeccionAccionesTomadas from "../acciones-tomadas";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Image from "next/image";
import { SeguimientoIncidenciaLista } from "./add-seguimientos";
import { AfectacionPatrimonialModal } from "./add-afectacion-patrimonial";
import { convertirDateToISO, formatCurrency, formatForMultiselect } from "@/lib/utils";
import { SeccionDepositos } from "../depositos-section";
import Select from 'react-select';
import { ViewSeg } from "./view-seguimiento";

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
	datos_deposito_incidencia: z.array(
		z.object({
		  cantidad: z.number().optional(),
		  tipo_deposito: z.string().optional(),
		})
	  ).optional(),
	notificacion_incidencia: z.string().min(1, { message: "Este campo es requerido" }),
	prioridad_incidencia: z.string().min(1, { message: "Este campo es requerido" }),
	dano_incidencia: z.string().optional(),
	// tipo_dano_incidencia: z.string().optional(),
	comentario_incidencia: z.string().min(1, { message: "Este campo es requerido" }),
	incidencia: z.string().min(1, { message: "La ubicación es obligatoria" }),
	tags: z.array(z.string()).optional(),
	estatus: z.string().optional(),

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
	const [ubicacionSeleccionada, setUbicacionSeleccionada ] = useState(data.ubicacion_incidencia);
	const { dataAreas:areas, dataLocations:ubicaciones,} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, modalEditarAbierto,  location?true:false);
	// const { dataAreas:areas} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true,  ubicacionSeleccionada?true:false);
	const [personasInvolucradas, setPersonasInvolucradas] = useState<PersonasInvolucradas[]>(data.personas_involucradas_incidencia)
	const [accionesTomadas, setAccionesTomadas] = useState<AccionesTomadas[]>(data.acciones_tomadas_incidencia)
	const [depositos, setDepositos] = useState<Depositos[]>([])
	const { data:dataAreaEmpleado} = useCatalogoAreaEmpleado(modalEditarAbierto, location, "Incidencias" );
	const { editarIncidenciaMutation} = useInciencias("", "",[], "", "", "");
	const [openModal, setOpenModal] = useState(false)

	const [search, setSearch]= useState("")
	// const [catSubCategorias, setSubCatCategorias] = useState<any>([])
	// const [catSubIncidences, setCatSubIncidences] = useState<any>([])
	const [subCategoria, setSubCategoria]= useState("")
	const [categoria, setCategoria]= useState(data.categoria)
	const [selectedIncidencia, setSelectedIncidencia]= useState("")
	// const [catCategorias, setCatCategorias] = useState<any[]>([])
	const [loadingCatalogos, setLoadingCatalogos]= useState(false)

	const { catIncidencias } = useCatalogoInciencias(modalEditarAbierto, categoria, subCategoria);
	const [selectedNotificacion, setSelectedNotification] = useState(data.notificacion_incidencia == "no" ? false:true);

	const [tagsSeleccionados, setTagsSeleccionados] = useState<string[]>(data.tags);
	const [seguimientos, setSeguimientos] = useState<any>(data.seguimientos_incidencia);
	const [indiceSeleccionado, setIndiceSeleccionado] = useState<number | null>(null);
	const [editarSeguimiento, setEditarSeguimiento] = useState(false);
	const [seguimientoSeleccionado, setSeguimientoSeleccionado] = useState(null);

	const [afectacionPatrimonialSeleccionada, setAfectacionPatrimonialSeleccionada] = useState<AfectacionPatrimonial | null>(null);
	const [afectacionPatrimonial,setAfectacionPatrimonial] = useState<AfectacionPatrimonial []>(data.afectacion_patrimonial_incidencia)
	const [openAfectacionPatrimonialModal,setOpenAfectacionPatrimonialModal] = useState(false)
	const [editarAfectacionPatrimonial, setEditarAfectacionPatrimonial] = useState(false)
	const [ openVerSeg, setOpenVerSeg] = useState(false)


	const getNivelNumber = (val:string) => {
		if (val =="Critica") return 100
		if (val =="Moderada") return 50
		if (val =="Leve") return 0
	}

	const [value, setValue] = useState<number[]>([getNivelNumber(data.prioridad_incidencia) ?? 0]);
	const [inputTag, setInputTag] = useState('');

	const getNivel = (val: number) => {
		if (val < 35) return "Leve"
		if (val > 34 && val < 70) return "Moderada"
		if (val > 70) return "Critica"
	}

	const openModalAgregarSeg = () =>{
		setSeguimientoSeleccionado(data)
		setOpenModal(!openModal)
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			reporta_incidencia: data.reporta_incidencia||"",
			fecha_hora_incidencia: data.fecha_hora_incidencia||"",
			ubicacion_incidencia: data.ubicacion_incidencia||"",
			area_incidencia:  data.area_incidencia||"",
			incidencia: data.incidencia||"",
			comentario_incidencia: data.comentario_incidencia||"",
			// tipo_dano_incidencia: data.tipo_dano_incidencia ||"",
			dano_incidencia: data.dano_incidencia||"",
			evidencia_incidencia: evidencia,
			documento_incidencia:documento,
			prioridad_incidencia:getNivel(value[0])||"",
			notificacion_incidencia: selectedNotificacion? "sí":"no",
			datos_deposito_incidencia: depositos,
			tags:tagsSeleccionados,
			estatus: data.estatus,
			//Categoria
			categoria:data.categoria||"",
			sub_categoria:data.sub_categoria||"",
			incidente:data.incidencia||"",

			//Grupos repetitivos
			personas_involucradas_incidencia:personasInvolucradas,
			acciones_tomadas_incidencia:accionesTomadas,
			seguimientos_incidencia: seguimientos,
			afectacion_patrimonial_incidencia: afectacionPatrimonial,

			//Persona extraviada
			nombre_completo_persona_extraviada:data.nombre_completo_persona_extraviada||"",
			edad:data.edad||0,
			color_piel:data.color_piel||"",
			color_cabello:data.color_cabello||"",
			estatura_aproximada:data.estatura_aproximada||0,
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
		// const catIncidenciasIcons = categoriasConIconos?.filter((cat) =>
		// 	catIncidencias?.includes(cat.nombre)
		// 	);
		// setCatCategorias(catIncidenciasIcons)
		// setCatSubIncidences([])
		// setSubCatCategorias([])
		setDepositos([])

		setEditarSeguimiento(false)
		setSeguimientos([])
		setSeguimientoSeleccionado(null)

		setAfectacionPatrimonial([])
		setEditarAfectacionPatrimonial(false)
		setAfectacionPatrimonialSeleccionada(null)

		setPersonasInvolucradas([])
		setAccionesTomadas([])

		setIndiceSeleccionado(null)
		setTagsSeleccionados([])
	}

	useEffect(()=>{
		if(catIncidencias){
			if(search==""){
				const catIncidenciasIcons = categoriasConIconos.filter((cat) =>
					catIncidencias.data.includes(cat.nombre)
					);
				if(catIncidenciasIcons.length>0){
					console.log("catIncidenciasIcons",catIncidenciasIcons)
					// setCatCategorias(catIncidenciasIcons)
				}
			}else if(search=="cat" || search=="subCat"){
					if(catIncidencias.type=="incidence"){
						// const formattedSubIncidentes = catIncidencias.data.map((nombre:string) => ({
						// 	id: nombre,
						// 	nombre,
						// 	icono: ""
						// }));
						setSearch("subCat")
						if(categoria && !subCategoria){
							// setSubCatCategorias([])
						}
						// setCatSubIncidences(formattedSubIncidentes)
					} else if (catIncidencias.type=="sub_catalog"){
						// const subCatIncidenciasIcons = subCategoriasConIconos.filter((cat) =>
						// 	catIncidencias.data.includes(cat.nombre)
						// );
						// setSubCatCategorias(subCatIncidenciasIcons)
					}
			}
		}
	},[catIncidencias] )


	useEffect(()=>{
		if(modalEditarAbierto){
			setEvidencia(data.evidencia_incidencia)
			setDocumento(data.documento_incidencia)
			setDate(new Date(data.fecha_hora_incidencia))
			console.log("data.categoria", data.categoria)
			setCategoria(data.categoria)
			setSubCategoria(data.sub_categoria)
			setSelectedIncidencia(data.incidente)
			setDepositos(data.datos_deposito_incidencia	)
			handleOpenModal()
		}
	},[modalEditarAbierto])


	useEffect(()=>{
		console.log("personasInvolucradas", personasInvolucradas)
	},[personasInvolucradas])

	const handleOpenModal = async () =>{
		setLoadingCatalogos(true)
		// const {catSubIncidenciasIcons, subCategories}= await LoadCategories()
		// if (catSubIncidenciasIcons.length>0) {
			//Si me regresa el mismo catalogo de categorias, entonces rellenamos directo el cat Incidencias
			// const subCatSubIncidenciasIcons = subCategoriasConIconos.filter((cat) =>
			// 	subCategories.response.data.data.includes(cat.nombre)
			// );
			// setCatSubIncidences(subCatSubIncidenciasIcons)
		// } else {
			//Si en caso de ser diferentes, reviso en las sub categorias, si existen las muestro y si no, muestro las lista de incidencias de esa sub categoria
			// const subCatIcons = subCategoriasConIconos.filter((cat) =>
			// 	subCategories.response.data.data.includes(cat.nombre)
			// );
			// if(subCatIcons.length > 0){
			// 	setSubCatCategorias(subCatIcons)
			// }
			// await LoadIncidences();
		// }
		setLoadingCatalogos(false)
	}

	// const LoadCategories = async ()=>{
	// 	try{
	// 		// const incidenciasRes = await getCatIncidencias("", "");
	// 		// const catIncidenciasIcons = categoriasConIconos.filter((cat) =>
	// 		// 	incidenciasRes.response.data.data.includes(cat.nombre)
	// 		// );
	// 		// setCatCategorias(catIncidenciasIcons);
	// 		const subCategories = await getCatIncidencias(data.categoria,"");
	// 		const catSubIncidenciasIcons = categoriasConIconos.filter((cat) =>
	// 			subCategories.response.data.data.includes(cat.nombre)
	// 		);
	// 		return { catSubIncidenciasIcons, subCategories }
	// 	}  catch {
	// 		toast.error("Error al cargar catálogo de categorias, intenta de nuevo.");
	// 		return { catSubIncidenciasIcons: [], subCategories: [] }
	// 	}
	// }

	// const LoadIncidences = async ()=>{
	// 	try{
	// 		// const subIncidentes = await getCatIncidencias(data.categoria,data.sub_categoria);
	// 		// const formattedSubIncidentes = subIncidentes.response.data.data.map((nombre:string) => ({
	// 		// 	id: nombre,
	// 		// 	nombre,
	// 		// 	icono: ""
	// 		//   }));
	// 		// setCatSubIncidences(formattedSubIncidentes)
	// 	}  catch {
	// 		toast.error("Error al cargar catálogo de incidencias, intenta de nuevo.");
	// 		// setCatSubIncidences([])
	// 	}
	// }

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
					// tipo_dano_incidencia: values.tipo_dano_incidencia||"",
					dano_incidencia:values.dano_incidencia||"",
					evidencia_incidencia:evidencia||[],
					documento_incidencia:documento||[],
					prioridad_incidencia:getNivel(value[0])||"",
					notificacion_incidencia:selectedNotificacion ? "sí": "no",
					datos_deposito_incidencia: depositos||[],
					tags:tagsSeleccionados,
					estatus: values.estatus,

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
					// responsable_que_recibe: values.responsable_que_recibe,
				
					//Grupos repetitivos
					afectacion_patrimonial_incidencia:afectacionPatrimonial||[],
					personas_involucradas_incidencia:personasInvolucradas||[],
					acciones_tomadas_incidencia:accionesTomadas||[],
					seguimientos_incidencia:seguimientos||[],

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
				console.log("incidencias update", formatData)
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

	useEffect(()=>{
		if(form.formState.errors){
			console.log("ERROR", form.formState.errors)
		}
	},[form.formState.errors]);	

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
	  
	const agregarTag = () => {
		const nuevoTag = inputTag.trim();
		if (nuevoTag && !tagsSeleccionados.includes(nuevoTag)) {
		setTagsSeleccionados([...tagsSeleccionados, nuevoTag]);
		setInputTag('');
		}
	};


	const quitarTag = (tag: string) => {
		setTagsSeleccionados(tagsSeleccionados.filter((t) => t !== tag));
	};

	const handleVerSeg = (item: any) => {
		setSeguimientoSeleccionado(item)
		setOpenVerSeg(true);
	};
	

	return (
    <Dialog open={modalEditarAbierto} onOpenChange={setModalEditarAbierto} modal>
  <DialogContent className="max-w-5xl overflow-y-auto max-h-[80vh] min-h-[80vh]  flex flex-col overflow-hidden" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
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
									Incidente:  <span className="font-bold">{categoria} / {subCategoria} / {selectedIncidencia} </span> 
								</div>
								
								<Form {...form} >
									<form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">

									{/* <FormField
										control={form.control}
										name="categoria"
										render={({ field }:any) => (
											<FormItem className="w-full">
												<FormLabel>Categoría: * </FormLabel>
												 <FormControl>
												 <Select
												 	placeholder={"Categoría"}
													inputId="select-categorias"
  													name="categoria"
													aria-labelledby="aria-label"
													value ={categoria ? formatForMultiselect([categoria]):[]}
													options={catCategorias && catCategorias.length>0 ? formatToValueLabel( catCategorias):[]} 
													onChange={(selectedOption) => {
														field.onChange(selectedOption?.value ??"");
														setSearch("cat")
														setCategoria(selectedOption?.value ??"")
														setSubCategoria("")
													}}
													isClearable
													styles={{
													  menuPortal: (base) => ({...base, zIndex: 9999, pointerEvents: "auto" }),
													  menu: (base) => ({...base, overflowY: "auto"}),
													}}
												/>
												</FormControl>
											
												<FormMessage />
											</FormItem>
										)}
									/>	 */}
										<>
											{/* <FormField
												control={form.control}
												name="sub_categoria"
												render={({ field }:any) => (
													<FormItem className="w-full">
														<FormLabel>Sub categoria: *</FormLabel>
														<FormControl>

														<Select
															placeholder={"Categoría"}
															inputId="select-categorias"
															name="sub_categoria"
															aria-labelledby="aria-label"
															value={formatForMultiselect([subCategoria])}
															options={catSubCategorias && catSubCategorias.length>0 ? formatToValueLabel( catSubCategorias):[]} 
															onChange={(selectedOption:any) => {
																field.onChange(selectedOption ? selectedOption.value :""); 
																setSubCategoria(selectedOption ? selectedOption.value :"");
															}}
															isClearable
															styles={{
																menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
																menu: (base) => ({...base, overflowY: "auto", }),
															}}
															isDisabled={catSubCategorias.length==0}
														/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>	 */}
										</>
									{/* {catSubIncidences.length > 0 ? (
										<>
											<FormField
											control={form.control}
											name="incidente"
											render={({field}:any) => (
												<FormItem className="w-full">
													<FormLabel>Incidente: *</FormLabel>
													<FormControl>


													<Select
															placeholder={"incidente"}
															inputId="select-incidente"
															name="incidente"
															aria-labelledby="aria-label"
															value={formatForMultiselect([selectedIncidencia])}
															options={catSubIncidences && catSubIncidences.length>0 ? formatToValueLabel( catSubIncidences):[]} 
															onChange={(selectedOption:any) => {
																field.onChange(selectedOption ? selectedOption.value :""); 
																setSearch("subCat")
																setSelectedIncidencia(selectedOption ? selectedOption.value :"")
															}}
															isClearable
															styles={{
																menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
																menu: (base) => ({...base, overflowY: "auto", }),
															}}
															isDisabled={catSubIncidences.length==0}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
											/>	
										</>
									):null} */}

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
														{/* <Select
															aria-labelledby="aria-label"
															inputId="select-categorias"
  															name="reporta_incidencia"
															options={formatValueLabel(dataAreaEmpleado)}
															onChange={(value:any) =>{
																field.onChange(value.value);
																setSearch("subCat")
																setSelectedIncidencia(value.value)
															}}
															value={formatValueLabel(catSubIncidences).find(opt => opt.value === selectedIncidencia) || null} 
														/> */}

															<Select
																placeholder={"Reporta"}
																inputId="select-categorias"
																name="reporta_incidencia"
																aria-labelledby="aria-label"
																value= {formatForMultiselect(dataAreaEmpleado).find(opt => opt.value === field.value) || ""} 
																options={dataAreaEmpleado && dataAreaEmpleado.length>0 ? formatForMultiselect( dataAreaEmpleado):[]} 
																onChange={(selectedOption:any) => {
																	field.onChange(selectedOption ? selectedOption.value :""); 
																}}
																isClearable
																styles={{
																	menuPortal: (base) => ({...base, zIndex: 9999, pointerEvents: "auto" }),
																	menu: (base) => ({...base, overflowY: "auto"}),
																}}
																// isDisabled={dataAreaEmpleado.length==0}
															/>
														{/* <Select {...field} className="input"
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
													</Select> */}
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
													<FormLabel>Ubicación:</FormLabel>

													<Select 
														placeholder="Ubicación"
														name="ubicacion_incidencia"
														aria-labelledby="aria-label"
														className="border border-slate-100 rounded-2xl"
														options={ ubicaciones && ubicaciones.length > 0 ? formatForMultiselect(ubicaciones):[]} 
														value={formatForMultiselect([ubicacionSeleccionada])}
														onChange={(selectedOption:any) => {
															field.onChange(selectedOption?.value ?? ""); 
															setUbicacionSeleccionada(selectedOption?.value ?? ""); 
														}}
														isClearable
														styles={{
															menuPortal: (base) => ({...base, zIndex: 9999, pointerEvents: "auto" }),
															menu: (base) => ({...base, overflowY: "auto"}),
														}}
													/>

													{/* <FormControl>
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
													</FormControl> */}
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name="area_incidencia"
											render={({ field }:any) => (
												<FormItem className="w-full">
													<FormLabel>Área de la incidencia: *</FormLabel>
													<Select
														placeholder={"Reporta"}
														inputId="select-categorias"
														name="reporta_incidencia"
														aria-labelledby="aria-label"
														value= {formatForMultiselect(areas).find(opt => opt.value === field.value) || ""} 
														options={areas && areas.length>0 ? formatForMultiselect( areas):[]} 
														onChange={(selectedOption:any) => {
															field.onChange(selectedOption ? selectedOption.value :""); 
														}}
														isClearable
														styles={{
															menuPortal: (base) => ({...base, zIndex: 9999, pointerEvents: "auto" }),
															menu: (base) => ({...base, overflowY: "auto"}),
														}}
													/>

													
													{/* <FormControl>
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
													</FormControl> */}
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
											name="estatus"
											render={({ field }) => (
												<FormItem>
													<FormLabel>Estatus de la incidencia: *</FormLabel>
													<FormControl>
														<div className="flex gap-2">
															<button
																type="button"
																onClick={() => field.onChange("Abierto")}
																className={`px-6 py-2 rounded ${
																	(field.value ?? data.estatus) === "Abierto"
																		? "bg-blue-600 text-white"
																		: "bg-white text-blue-600 border border-blue-500"
																}`}
															>
																Abierto
															</button>
															<button
																type="button"
																onClick={() => field.onChange("Cerrado")}
																className={`px-6 py-2 rounded ${
																	(field.value ?? data.estatus) === "Cerrado"
																		? "bg-blue-600 text-white"
																		: "bg-white text-blue-600 border border-blue-500"
																}`}
															>
																Cerrado
															</button>
														</div>
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
											limit={10}
											showTakePhoto={true}
											/>

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
													defaultChecked={selectedNotificacion}
													onCheckedChange={()=>{ setSelectedNotification(!selectedNotificacion);}}
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
											Agregar seguimiento 
										</div>
									</div>
								</div>
								
							</div>


							<div className="max-h-[600px] overflow-y-auto border">
								<table className="min-w-full table-auto border-collapse">
									<thead className="sticky top-0 bg-gray-100 z-10">
									<tr className="bg-gray-100">
										<th className="px-4 py-2 text-left border-b border-gray-300">Fecha y hora</th>
										<th className="px-4 py-2 text-left border-b border-gray-300">Tiempo transcurrido</th>
										<th className="px-4 py-2 text-left border-b border-gray-300">Acción realizada</th>
										{/* <th className="px-4 py-2 text-left border-b border-gray-300">Personas involucradas</th>
										<th className="px-4 py-2 text-left border-b border-gray-300">Evidencia</th>
										<th className="px-4 py-2 text-left border-b border-gray-300">Documentos</th> */}
										<th className="px-4 py-2 text-left border-b border-gray-300"></th>
									</tr>
									</thead>
									<tbody>
									{seguimientos && seguimientos.length > 0 ? (
										seguimientos.map((item: any, index: number) => (
										<tr key={index} className="border-t border-gray-200">
										<td className="px-4 py-2">{item?.fecha_inicio_seg ||"-"}</td>
										<td className="px-4 py-2">{item?.tiempo_transcurrido || "-"}</td>
										<td className="px-4 py-2 max-w-[400px] truncate" title={item?.accion_correctiva_incidencia || "-"}> {item?.accion_correctiva_incidencia || "-"} </td>
										{/* <td className="px-4 py-2">{item?.incidencia_personas_involucradas ||"-"}</td> */}

										{/* <td className="px-4 py-2">
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
															className="w-42 h-42 object-contain bg-gray-200 rounded-lg"
															/>
														</CardContent>
														</Card>
													</CarouselItem>
													))}
												</CarouselContent>
												{item?.incidencia_evidencia_solucion.length > 1 &&
													<><CarouselPrevious /><CarouselNext /></>
												}
												</Carousel>
											</div>
											) :( <div className="text-center">-</div> )}
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
											) : ( <div className="text-center">-</div> )}
										</td> */}

										<td className="flex items-center justify-center gap-2 mt-2 pr-2">
											<div
											title="Editar"
											className="hover:cursor-pointer text-blue-500 hover:text-blue-600"
											onClick={() => handleVerSeg(item)}
											>
												<Eye/>
											</div>
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
											{/* <th className="px-4 py-2 text-left border-b border-gray-300">Descripción de la Afectación</th> */}
											<th className="px-4 py-2 text-left border-b border-gray-300">Monto Estimado de Daño ($)</th>
											<th className="px-4 py-2 text-left border-b border-gray-300">Duración Estimada Afectación</th>
											<th className="px-4 py-2 text-left border-b border-gray-300">Evidencia</th>
											<th className="px-4 py-2 text-left border-b border-gray-300">Documento</th>
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
											<td className="px-4 py-2">
												{item?.evidencia?.length > 0 ? (
												<div className="w-full flex justify-center">
													<Carousel className="w-16">
													<CarouselContent>
														{item.evidencia.map((a: any, i: number) => (
														<CarouselItem key={i}>
															<Card>
															<CardContent className="flex aspect-square items-center justify-center p-0">
																<Image
																width={280}
																height={280}
																src={a?.file_url || "/nouser.svg"}
																alt="Imagen"
																className="w-42 h-42 object-contain bg-gray-200 rounded-lg"
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
												{item?.documento?.length > 0 ? (
												<ul className="ms-2">
													{item.documento.map((file: any, i: number) => (
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
											<td className="flex items-center justify-center gap-2 mt-2 ">
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


				<ViewSeg
					title="Ver Seguimiento"
					data={seguimientoSeleccionado}
					isSuccess={openVerSeg}
					setIsSuccess={setOpenVerSeg}
					>
					<div></div>
				</ViewSeg>

					<div className="flex gap-2">
						<DialogClose asChild>
							<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 sm:w-2/3 md:w-1/2 lg:w-1/2 mb-2" onClick={onClose}>
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
								<Loader2 className="animate-spin"/> {"Guardando cambios..."}
							</>
						):("Guardar incidencia")}
						</Button>
					</div>
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
					folioIncidencia={""}	
					estatusIncidencia = { data.estatus} >
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
