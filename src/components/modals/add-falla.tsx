/* eslint-disable react-hooks/exhaustive-deps */
//eslint-disable react-hooks/exhaustive-deps
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
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import LoadImage from "../upload-Image";
import { Imagen } from "@/lib/update-pass";
import { useCatalogoAreaEmpleado } from "@/hooks/useCatalogoAreaEmpleado";
import { format } from 'date-fns';

import { useCatalogoAreaEmpleadoApoyo } from "@/hooks/useCatalogoAreaEmpleadoApoyo";
import { useCatalogoFallas } from "@/hooks/Fallas/useCatalogoFallas";
import DateTime from "../dateTime";
import LoadFile from "../upload-file";
import { CircleAlert, Edit, Loader2, Trash2 } from "lucide-react";
import { useFallas } from "@/hooks/Fallas/useFallas";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { useShiftStore } from "@/store/useShiftStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Image from "next/image";
import { SeguimientoIncidenciaLista } from "./add-seguimientos";
import { toast } from "sonner";
import { convertirDateToISO, formatForMultiselect } from "@/lib/utils";
// import Select from "multiselect-react-dropdown";
import Select from 'react-select';

interface AddFallaModalProps {
  	title: string;
	data: any;
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
	onClose: ()=> void;
}

const formSchema = z.object({
	falla: z.string().optional(),
	falla_caseta: z.string().optional(),
	falla_comentarios: z.string().min(1, { message: "Comentario es obligatorio" }), 
	falla_documento: z.array(
	  z.object({
		file_url: z.string(),
		file_name: z.string(),
	  })
	).optional(),
	falla_estatus: z.string().optional(),
	falla_evidencia: z.array(
	  z.object({
		file_url: z.string(),
		file_name: z.string(),
	  })
	).optional(),
	falla_fecha_hora: z.string().optional(), 
	falla_objeto_afectado: z.string().optional(),
	falla_reporta_nombre: z.string().min(1, { message: "El nombre del reportante es obligatorio" }), 
	falla_responsable_solucionar_nombre: z.string().optional(),
	falla_ubicacion: z.string().min(1, { message: "La ubicación es obligatoria" }),
	falla_grupo_seguimiento: z.array(z.any()).optional(),
});

export const AddFallaModal: React.FC<AddFallaModalProps> = ({
  	title,
	isSuccess,
	setIsSuccess,
}) => {
	const [subconcepto, setSubConcepto] = useState<string>("");
	const [catalagoSub, setCatalogoSub] = useState<string[]>([]);
	const [catalagoFallas, setFallas] = useState<string[]>([]);
	const { location } = useShiftStore();
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location);
	const { dataAreas:areas, dataLocations:ubicaciones} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, isSuccess,  ubicacionSeleccionada?true:false);
	const { data:dataAreaEmpleado, refetch: refetchAreaEmpleado,  } = useCatalogoAreaEmpleado(isSuccess, location, "Incidencias");
	const { data:dataAreaEmpleadoApoyo,  refetch: refetchAreaEmpleadoApoyo, } = useCatalogoAreaEmpleadoApoyo(isSuccess);
	const { data:dataFallas, refetch: refetchFallas} = useCatalogoFallas(subconcepto, isSuccess);
	const { createFallaMutation, isLoading} = useFallas("","", "abierto", false, "", "", "")

	const [indiceSeleccionado, setIndiceSeleccionado] = useState<number | null>(null);
	const [editarSeguimiento, setEditarSeguimiento] = useState(false);
	const [seguimientoSeleccionado, setSeguimientoSeleccionado] = useState(null);
	const [openModal, setOpenModal] = useState(false)
	const [seguimientos, setSeguimientos]= useState<any>([])

	const [evidencia , setEvidencia] = useState<Imagen[]>([]);
	const [documento , setDocumento] = useState<Imagen[]>([]);
	const [date, setDate] = useState<Date|"">("");
	const [selectedFalla, setSelectedFalla] = useState("")


	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
		falla: "",
		falla_caseta: "",
		falla_comentarios: "",
		falla_documento:[],
		falla_estatus: "abierto",
		falla_evidencia:[],
		falla_fecha_hora:date.toString(),
		falla_objeto_afectado: "",
		falla_reporta_nombre: "",
		falla_responsable_solucionar_nombre: "",
		falla_ubicacion: ubicacionSeleccionada,
		falla_grupo_seguimiento:[]
		},
	});

	const { reset } = form;

	useEffect(()=>{
		if(isSuccess){
			reset()
			setDate(new Date())
			setEvidencia([])
			setDocumento([])
			setSelectedFalla("")
			refetchAreaEmpleado()
			refetchAreaEmpleadoApoyo()
			refetchFallas()
			setUbicacionSeleccionada(location)
			setSeguimientos([])
			form.setValue("falla_ubicacion", location);
		}
	},[isSuccess])

	useEffect(()=>{
		if(!isLoading){
			handleClose()			
		}
	},[isLoading])


	useEffect(()=>{
		if(dataFallas && subconcepto){
			setCatalogoSub(dataFallas)
		}
		if(dataFallas && !subconcepto){
			setFallas(dataFallas)
		}
	},[dataFallas])

	function onSubmit(values: z.infer<typeof formSchema>) {
		let formattedDate=""
		if(date){
			formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
			const formatData ={
				falla:values.falla||"",
				falla_caseta: values.falla_caseta||"",
				falla_comentarios:values.falla_comentarios||"",
				falla_documento:documento,
				falla_estatus:"abierto",
				falla_evidencia:evidencia,
				falla_fecha_hora: formattedDate||"",
				falla_objeto_afectado: values.falla_objeto_afectado||"",
				falla_reporta_nombre:values.falla_reporta_nombre||"",
				falla_responsable_solucionar_nombre: values.falla_responsable_solucionar_nombre||"",
				falla_ubicacion:values.falla_ubicacion||"",
				falla_grupo_seguimiento:seguimientos
				}
				createFallaMutation.mutate({data_failure: formatData})
		}else{
			form.setError("falla_fecha_hora", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleClose = () => {
		setIsSuccess(false); 
	};

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


	useEffect(() => {
        if(form.formState.errors){
            console.log("Errores:", form.formState.errors)
        }
    }, [form.formState.errors])

  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      {/* <DialogTrigger></DialogTrigger> */}

      <DialogContent className="max-w-5xl  overflow-y-auto max-h-[80vh] flex flex-col overflow-hidden" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>


		<div className="flex-grow overflow-y-auto ">
			<Tabs defaultValue="datos" >
				<TabsList>
					<TabsTrigger value="datos">Datos</TabsTrigger>
					<TabsTrigger value="seguimiento">Seguimiento</TabsTrigger>
				</TabsList>

				<TabsContent value="datos" >
				<Card className="p-3 h-full">
					<div className="flex-grow overflow-y-auto p-4">
						<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<FormField
								control={form.control}
								name="falla_fecha_hora"
								render={() => (
									<FormItem>
									<FormLabel>* Fecha</FormLabel>
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
								name="falla_ubicacion"
								render={({ field }:any) => (
									<FormItem className="w-full">
										<FormLabel>Ubicación:</FormLabel>
										<Select 
											placeholder="Ubicación"
											className="border border-slate-100 rounded-2xl"
											// selectedValues={afectacionPatrimonialSeleccionada? formatForMultiselect([afectacionPatrimonialSeleccionada?.tipo_afectacion]):[]}
											options={ubicaciones && ubicaciones.length>0 ?formatForMultiselect( ubicaciones):[]} 
											onChange={(selectedOption) => {
												field.onChange(selectedOption ? selectedOption.value : "");
											  }}
											  isClearable
											  menuPortalTarget={document.body}
											  styles={{
												  menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
											  }}
											/>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="falla_caseta"
								render={({ field }:any) => (
									<FormItem className="w-full">
										<FormLabel>Área:</FormLabel>
										<Select 
											placeholder="Area"
											className="border border-slate-100 rounded-2xl"
											
											// selectedValues={afectacionPatrimonialSeleccionada? formatForMultiselect([afectacionPatrimonialSeleccionada?.tipo_afectacion]):[]}
											options={areas && areas.length>0 ?formatForMultiselect( areas):[]} 
											onChange={(selectedOption) => {
												field.onChange(selectedOption ? selectedOption.value : "");
											  }}
											  isClearable
											  menuPortalTarget={document.body}
											  styles={{
												  menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
											  }}
											/>
									</FormItem>
								)}
							/>
							

							<FormField
								control={form.control}
								name="falla"
								render={({ field }:any) => (
									<FormItem className="w-full">
										<FormLabel>Concepto:</FormLabel>
										<Select 
										placeholder="Concepto"
											className="border border-slate-100"
											
											// selectedValues={afectacionPatrimonialSeleccionada? formatForMultiselect([afectacionPatrimonialSeleccionada?.tipo_afectacion]):[]}
											options={catalagoFallas && catalagoFallas.length>0 ?formatForMultiselect( catalagoFallas):[]} 
											onChange={(selectedOption) => {
												field.onChange(selectedOption ? selectedOption.value :"");
												setCatalogoSub([])
												setSubConcepto(selectedOption? selectedOption.value:"")
											  }}
											  isClearable
											  menuPortalTarget={document.body}
											  styles={{
												  menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
											  }}
											/>
									</FormItem>
									// <FormItem>
									// 	<FormLabel>Concepto:</FormLabel>
									// 	<FormControl>
									// 	<Select {...field} className="input"
									// 		onValueChange={(value:string) => {
									// 		field.onChange(value); 
									// 		setCatalogoSub([])
									// 		setSubConcepto(value)
									// 	}}
									// 	value={field.value} 
									// >
									// 	<SelectTrigger className="w-full">
									// 		{isLoadingFallas && subconcepto == "" ? (
									// 			<SelectValue placeholder="Cargando fallas..." />
									// 		):
									// 		(
									// 			<SelectValue placeholder="Selecciona una falla" />
									// 		)}
									// 	</SelectTrigger>
									// 	<SelectContent>
									// 	{catalagoFallas?.map((vehiculo:string, index:number) => (
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
								name="falla_objeto_afectado"
								render={({ field }:any) => (
									<FormItem className="w-full">
										<FormLabel>Sub concepto:</FormLabel>
										<Select 
											className="border border-slate-100"
											placeholder="Sub concepto"
											// selectedValues={afectacionPatrimonialSeleccionada? formatForMultiselect([afectacionPatrimonialSeleccionada?.tipo_afectacion]):[]}
											options={catalagoSub && catalagoSub.length>0 ?formatForMultiselect( catalagoSub):[]} 
											onChange={(selectedOption: any) => {
												field.onChange(selectedOption ? selectedOption.value :"");
											}}
											isClearable
											menuPortalTarget={document.body}
											styles={{
												menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
											}}
											/>
									</FormItem>
									// <FormItem>
									// 	<FormLabel>Subconcepto:</FormLabel>
									// 	<FormControl>
									// 	<Select {...field} className="input"
									// 		onValueChange={(value:string) => {
									// 		field.onChange(value); 
									// 	}}
									// 	value={field.value} 
									// >
									// 	<SelectTrigger className="w-full">
									// 		{isLoadingFallas && subconcepto ? (
									// 			<SelectValue placeholder="Cargando subconcepto..." />
									// 		):(<>
									// 		{catalagoSub.length > 0 ?(<SelectValue placeholder="Selecciona una opción..." />)
									// 		:(<SelectValue placeholder="Selecciona una falla para ver las opciones..." />)
									// 		}
									// 		</>)}
											
									// 	</SelectTrigger>
									// 	<SelectContent>
									// 	{catalagoSub.length>0 ? (
									// 		catalagoSub?.map((item:string, index:number) => {
									// 			return (
									// 				<SelectItem key={index} value={item}>
									// 					{item}
									// 				</SelectItem>
									// 			)
									// 		})
									// 	):(
									// 		<><SelectItem disabled value={"no opciones"}>No hay opciones disponibles</SelectItem></>
									// 	)}
									// 	</SelectContent>
									// </Select>
									// 	</FormControl>
									// 	<FormMessage />
									// </FormItem>
								)}
							/>	

							<div className="col-span-2">
								<FormField
								control={form.control}
								name="falla_comentarios"
								render={({ field }:any) => (
									<FormItem>
									<FormLabel>* Descripción</FormLabel>
									<FormControl>
										<Textarea
										placeholder="Texto"
										className="resize-none"
										{...field}
										/>
									</FormControl>

									<FormMessage />
									</FormItem>
								)}
								/>
							</div>
							<FormField
								control={form.control}
								name="falla_reporta_nombre"
								render={({ field }:any) => (
									<FormItem className="w-full">
										<FormLabel>Reporta:</FormLabel>
										<Select 
											className="border border-slate-100"
											placeholder="Reporta"
											options={dataAreaEmpleadoApoyo && dataAreaEmpleadoApoyo.length>0 ?formatForMultiselect( dataAreaEmpleadoApoyo):[]} 
											onChange={(selectedOption: any) => {
												field.onChange(selectedOption ? selectedOption.value :"");
											}}
											isClearable
											menuPortalTarget={document.body}
											styles={{
												menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
											}}
											/>
									</FormItem>
									// <FormItem>
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
								name="falla_responsable_solucionar_nombre"
								render={({ field }:any) => (
									<FormItem className="w-full">
										<FormLabel>Responsable asignado de solucionar:</FormLabel>
										<Select 
											className="border border-slate-100"
											placeholder="Responsable asignado"
											
											// selectedValues={afectacionPatrimonialSeleccionada? formatForMultiselect([afectacionPatrimonialSeleccionada?.tipo_afectacion]):[]}
											options={dataAreaEmpleado && dataAreaEmpleado.length>0 ?formatForMultiselect( dataAreaEmpleado):[]} 
											onChange={(selectedOption: any) => {
												field.onChange(selectedOption ? selectedOption.value :"");
											}}
											isClearable
											menuPortalTarget={document.body}
											styles={{
												menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
											}}
											/>
									</FormItem>
									// <FormItem>
									// 	<FormLabel>Responsable asignado de solucionar:</FormLabel>
									// 	<FormControl>
									// 	<Select {...field} className="input"
									// 		onValueChange={(value:string) => {
									// 		field.onChange(value); 
									// 	}}
									// 	value={field.value} 
									// >
									// 	<SelectTrigger className="w-full">
									// 		{loadingAreaEmpleadoApoyo?(<>
									// 			<SelectValue placeholder="Cargando opciones..." />
									// 		</>):(<>
									// 			<SelectValue placeholder="Selecciona una opcion" />
									// 		</>)}
									// 	</SelectTrigger>
									// 	<SelectContent>
									// 	{dataAreaEmpleadoApoyo?.map((vehiculo:string, index:number) => (
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

							<div className="flex justify-between">
								<LoadImage
									id="evidencia" 
									titulo={"Evidencia"} 
									setImg={setEvidencia}
									showWebcamOption={true}
									// setErrorImagen={setErrorEvidencia}
									facingMode="user"
									imgArray={evidencia}
									showArray={true}
									limit={10}
									/>
							</div>

							<div className="flex justify-between">
								<LoadFile
									id="documento"
									titulo={"Documento"}
									setDocs={setDocumento}
									// setErrorImagen={setErrorDocumento}
									docArray={documento}
									limit={10}/>
							</div>
{/* 
							<Select  options={options}
						
							/> */}

						</form>
						</Form>
					</div>
				</Card>
				</TabsContent>
				
				<TabsContent value="seguimiento" >
					<Card className="p-3 h-screen">
						<div >
							<div className="flex gap-2 mb-4">
								<div className="w-full flex gap-2">
									<CircleAlert />
									Falla: <span className="font-bold"> {selectedFalla?  <div className="text-end">{selectedFalla}</div> : ( <div className="text-gray-400 text-sm text-end font-normal">No se ha seleccionado una falla.</div> )}</span>
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
										<td className="px-4 py-2">{item?.fecha_inicio_seg || "N/A"}</td>
										<td className="px-4 py-2">{item?.tiempo_transcurrido}</td>
										<td className="px-4 py-2">{item?.accion_correctiva_incidencia || "N/A"}</td>
										<td className="px-4 py-2">{item?.incidencia_personas_involucradas || "N/A"}</td>

										<td className="px-4 py-2 min-w-[150px]">
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
												<div className="flex justify-center items-center">-</div>
											)}
										</td>

										<td className="px-4 py-2">
											{item?.incidencia_documento_solucion?.length > 0 ? (
											<ul className="ms-2">
												{item?.incidencia_documento_solucion.map((file: any, i: number) => (
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
												<div className="flex justify-center items-center	">-</div>
												)}
										</td>

										<td className=" gap-2 mt-2 px-2">
											<div
											title="Editar"
											className="hover:cursor-pointer text-blue-500 hover:text-blue-600 mb-2"
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
			</Tabs>
		</div>
		<div className="flex gap-2">
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
					<Loader2 className="animate-spin"/> {"Creando falla..."}
				</>
			):("Crear falla")}
			</Button>
		</div>
		
		<SeguimientoIncidenciaLista
				title="Seguimiento Falla"
				isSuccess={openModal}
				setIsSuccess={setOpenModal}
				seguimientoSeleccionado={seguimientoSeleccionado}
				setSeguimientos={setSeguimientos}
				setEditarSeguimiento={setEditarSeguimiento}
				editarSeguimiento={editarSeguimiento}
				indice={indiceSeleccionado}
				dateIncidencia={date ? convertirDateToISO(date) : ""}
				folioIncidencia={""}>
			<div></div>
		</SeguimientoIncidenciaLista>

      </DialogContent>
    </Dialog>
  );
};
