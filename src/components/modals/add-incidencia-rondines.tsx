/* eslint-disable react-hooks/exhaustive-deps */
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
	List,
	Loader2,
  } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Imagen } from "@/lib/update-pass";
import { useShiftStore } from "@/store/useShiftStore";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useIncidenciaRondin } from "@/hooks/Rondines/useRondinIncidencia";
import { Textarea } from "../ui/textarea";
import LoadImage from "../upload-Image";
import LoadFile from "../upload-file";
import { Button } from "../ui/button";

interface AddIncidenciaModalProps {
  	title: string;
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
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
	fecha_hora_incidencia: z.string().optional(), // se puede llenar automáticamente
	ubicacion_incidencia: z.string().optional(),
	area_incidencia: z.string().optional(),
	categoria: z.string().optional(),
	sub_categoria: z.string().optional(),
	incidente: z.string().optional(),
	tipo_incidencia: z.string().optional(),
	comentario_incidencia: z.string().optional(),
	evidencia_incidencia: z.array(z.any()).optional(),
	documento_incidencia: z.array(z.any()).optional(),
	acciones_tomadas_incidencia: z.array(z.any()).optional(),
	prioridad_incidencia: z.string().optional(),
	notificacion_incidencia: z.string().optional(),
  });

export const AddIncidenciaRondinesModal: React.FC<AddIncidenciaModalProps> = ({
  	title,
	isSuccess,
	setIsSuccess,
}) => {
	const { location, isLoading } = useShiftStore();
	const [evidencia , setEvidencia] = useState<Imagen[]>([]);
	const [documento , setDocumento] = useState<Imagen[]>([]);

	const[ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location)
	const { dataAreas:areas, dataLocations:ubicaciones} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, isSuccess,  location?true:false);
	const { createIncidenciaMutation } = useIncidenciaRondin();

	console.log(areas, ubicaciones)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
		  reporta_incidencia: "Emiliano Zapata",
		  fecha_hora_incidencia: "",
		  ubicacion_incidencia: "Planta Monterrey",
		  area_incidencia: "",
		  categoria: "",
		  sub_categoria: "",
		  incidente: "",
		  tipo_incidencia: "",
		  comentario_incidencia: "",
		  evidencia_incidencia: [],
		  documento_incidencia: [],
		  acciones_tomadas_incidencia: [],
		  prioridad_incidencia: "",
		  notificacion_incidencia: "",
		},
	  });
	  

	const { reset } = form;

	useEffect(()=>{
		if(!isSuccess)
			reset()
			setEvidencia([])
			setDocumento([])
			setUbicacionSeleccionada(location)
	},[isSuccess]);	

	useEffect(()=>{
		if(form.formState.errors){
			console.log("console log", form.formState.errors, title)
		}
	},[form.formState.errors])


	function onSubmit(values: z.infer<typeof formSchema>) {
			console.log("que paso ")
			const formatData ={
				'reporta_incidencia': "Emiliano Zapata",
				'fecha_hora_incidencia': "2025-10-24 13:07:16",
				'ubicacion_incidencia':"Planta Monterrey",
				'area_incidencia': "Recursos eléctricos",
				'categoria': "Intrusión y seguridad",
				'sub_categoria':"Alteración del orden",
				'incidente':"Drogadicto",
				"tipo_incidencia": "Otro incidente",
				'comentario_incidencia': values.comentario_incidencia,
				'evidencia_incidencia': [],
				'documento_incidencia':[],
				'acciones_tomadas_incidencia':[],
				"prioridad_incidencia": "leve",
				"notificacion_incidencia": "no",
			}
				
			createIncidenciaMutation.mutate({ data_incidencia: formatData });
	}

	return (
		<Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
		<DialogContent className="max-w-md overflow-y-auto  flex flex-col overflow-hidden"  onInteractOutside={(e) => e.preventDefault()}  aria-describedby="">
			<DialogHeader className="flex-shrink-0">
			<DialogTitle className="text-2xl text-center font-bold">
				{"Crear incidencia"}
			</DialogTitle>
			</DialogHeader>
			
					<div className="flex flex-col">
						<div >
							
							<Form {...form} >
								<form onSubmit={form.handleSubmit(onSubmit)} >

										<FormField
										control={form.control}
										name="categoria"
										render={({ field }: any) => (
											<FormItem className="w-full">
											<FormLabel>Categoría:</FormLabel>
											<FormControl>
												<Select
												onValueChange={(value: string) => field.onChange(value)}
												value={field.value}
												>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Selecciona una categoría" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="seguridad">Seguridad</SelectItem>
													<SelectItem value="mantenimiento">Mantenimiento</SelectItem>
													<SelectItem value="salud">Salud e Higiene</SelectItem>
													<SelectItem value="medio_ambiente">Medio Ambiente</SelectItem>
												</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
											</FormItem>
										)}
										/>

										<FormField
										control={form.control}
										name="sub_categoria"
										render={({ field }) => (
											<FormItem className="w-full">
											<FormLabel>Subcategoría:</FormLabel>
											<FormControl>
												<Select
												onValueChange={field.onChange}
												value={field.value}
												>
												<SelectTrigger className="w-full border border-slate-200 rounded-2xl">
													<SelectValue placeholder="Selecciona una subcategoría" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="acceso_no_autorizado">Acceso no autorizado</SelectItem>
													<SelectItem value="vandalismo">Vandalismo</SelectItem>
													<SelectItem value="robo">Robo</SelectItem>
													<SelectItem value="alteracion_orden">Alteración del orden</SelectItem>
												</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
											</FormItem>
										)}
										/>

									<FormField
										control={form.control}
										name="incidente"
										render={({ field }) => (
											<FormItem className="w-full">
											<FormLabel>Ubicación:</FormLabel>
											<FormControl>
												<Select
												onValueChange={field.onChange}
												value={field.value}
												>
												<SelectTrigger className="w-full border border-slate-200 rounded-2xl">
													<SelectValue placeholder="Selecciona una ubicación" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="oficina">Oficina Central</SelectItem>
													<SelectItem value="almacen">Almacén Principal</SelectItem>
													<SelectItem value="planta">Planta de Producción</SelectItem>
												</SelectContent>
												</Select>
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

								{/* <FormField
								
									control={form.control}
									name="acciones_tomadas_incidencia"
									render={({ field }:any) => (
										<FormItem className="col-span-1 md:col-span-2">
										<FormLabel>Accion: *</FormLabel>
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
									/> */}


								<div className="mt-2 mb-2">
										
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

								</div>

								<div className="flex gap-2">
									<DialogClose asChild>
										<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 sm:w-2/3 md:w-1/2 lg:w-1/2 " onClick={()=>{setIsSuccess(false)}}>
										Cancelar
										</Button>
									</DialogClose>
									
									<Button
										type="submit"
										className="w-full bg-blue-500 hover:bg-blue-600 text-white sm:w-2/3 md:w-1/2 lg:w-1/2" disabled={isLoading}
									>
										{isLoading? (
										<>
											<Loader2 className="animate-spin"/> {"Creando incidencia..."}
										</>
									):("Crear incidencia")}
									</Button>
								</div>

								</form>
							</Form>
						</div>
					</div>

					
		</DialogContent>
		</Dialog>
	);
};
