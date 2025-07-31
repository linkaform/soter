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
import { format,  } from 'date-fns';

import { useCatalogoAreaEmpleadoApoyo } from "@/hooks/useCatalogoAreaEmpleadoApoyo";
import { useCatalogoFallas } from "@/hooks/Fallas/useCatalogoFallas";
import DateTime from "../dateTime";
import LoadFile from "../upload-file";
import { Loader2 } from "lucide-react";
import { getCatalogoFallas } from "@/lib/fallas";
import { useFallas } from "@/hooks/Fallas/useFallas";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { useShiftStore } from "@/store/useShiftStore";
import { toast } from "sonner";

interface EditarFallaModalProps {
  	title: string;
	data: any;
	setModalEditarAbierto:Dispatch<SetStateAction<boolean>>; 
	modalEditarAbierto:boolean;
	onClose: () => void; 
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
});

export const EditarFallaModal: React.FC<EditarFallaModalProps> = ({
  	title,
	data,
	modalEditarAbierto,
	setModalEditarAbierto,
	onClose
}) => { 
	const [subconcepto, setSubConcepto] = useState<string>("");
	const [useSelects, setUseSelects] = useState(false);
	const [catalagoSub, setCatalogoSub] = useState<string[]>([]);
	const [catalagoFallas, setFallas] = useState<string[]>([]);
	// const [isSuccess, setIsSuccess] =useState(false)
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(data.falla_ubicacion);
	const { location } = useShiftStore();
	const { dataAreas:areas, dataLocations:ubicaciones, isLoadingAreas:loadingAreas} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true,  ubicacionSeleccionada?true:false);
	const { data:dataAreaEmpleado, isLoading:loadingAreaEmpleado} = useCatalogoAreaEmpleado(modalEditarAbierto, location, "Incidencias");
	const { data:dataAreaEmpleadoApoyo, isLoading:loadingAreaEmpleadoApoyo} = useCatalogoAreaEmpleadoApoyo(modalEditarAbierto);
	const { data:dataFallas, isLoading:isLoadingFallas } = useCatalogoFallas(subconcepto, modalEditarAbierto);
	const { editarFallaMutation, isLoading} = useFallas("","", "abierto", false, "", "", "")
	const [evidencia , setEvidencia] = useState<Imagen[]>([]);
	const [documento , setDocumento] = useState<Imagen[]>([]);
	const [date, setDate] = useState<Date|"">("");
	const [loadingCatalogos, setLoadingCatalogos]= useState(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
		falla: data.falla,
		falla_caseta: data.falla_caseta,
		falla_comentarios: data.falla_comentarios,
		falla_documento:documento,
		falla_estatus: data.falla_estatus,
		falla_evidencia:evidencia,
		falla_fecha_hora: data.falla_fecha_hora,
		falla_objeto_afectado: data.falla_objeto_afectado,
		falla_reporta_nombre: data.falla_reporta_nombre,
		falla_responsable_solucionar_nombre: data.falla_responsable_solucionar_nombre,
		falla_ubicacion:data.falla_ubicacion,
		},
	});

	const { reset } = form;
	
	useEffect(()=>{
		if(modalEditarAbierto){
			reset()
			setEvidencia(data.falla_evidencia)
			setDocumento(data.falla_documento)
			setDate(new Date(data.falla_fecha_hora))
			handleOpenModal()
		}
	},[modalEditarAbierto])

	useEffect(()=>{
		if(dataFallas && subconcepto && useSelects){
			if (dataFallas.length == 1 && dataFallas[0] === null) {
				setCatalogoSub([])
			  }else{
				setCatalogoSub(dataFallas)
			  }
		}
		if(dataFallas && !subconcepto && useSelects){
			setFallas(dataFallas)
		}
	},[dataFallas, ubicaciones])

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
				}
				 editarFallaMutation.mutate({data_failure_update: formatData, folio: data.folio}, {
					onSuccess: () => {
					  handleClose();
					},
					onError: () => {
						handleClose()
					},
				  })
		}else{
			form.setError("falla_fecha_hora", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleClose = () => {
		reset()
		setModalEditarAbierto(false); 
		onClose()
	};

	const handleOpenModal = async () => {
		setLoadingCatalogos(true)
		const fallasCat= await loadCatalogoFallas()
		setFallas(fallasCat.response.data);

		const fallasObjetoAfectado = await loadCatalogoSubFallas()
		setCatalogoSub(fallasObjetoAfectado.response.data);

		setSubConcepto(data.falla)
		setLoadingCatalogos(false)
	};

	const loadCatalogoFallas = async () => {
		try{
			const fallasCat = await getCatalogoFallas("");
			return fallasCat
		}  catch {
			toast.error("Error al cargar catálogo de fallas, intenta de nuevo.");
			return []
		}
	}

	const loadCatalogoSubFallas = async () => {
		try{
			const fallasObjetoAfectado = await getCatalogoFallas(data.falla);
			return fallasObjetoAfectado
		}  catch {
			toast.error("Error al cargar catálogo de sub concepto, intenta de nuevo.");
			return []
		}
	}

  return (
	<Dialog open={modalEditarAbierto} onOpenChange={setModalEditarAbierto} modal>
	<DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] min-h-[80vh] flex flex-col" aria-describedby="">
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
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<FormField
								control={form.control}
								name="falla_ubicacion"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>Ubicacion:</FormLabel>
										<FormControl>
											<Select {...field} className="input"
												onValueChange={(value: string) => {
													field.onChange(value);
													setUbicacionSeleccionada(value)
												} }
												value={ubicacionSeleccionada} 
											>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Selecciona una ubicación" />
												</SelectTrigger>
												<SelectContent>
												{ubicaciones?.length >0 ? (
													<>
													{ubicaciones?.map((vehiculo: string, index: number) => (
														<SelectItem key={index} value={vehiculo}>
															{vehiculo}
														</SelectItem>
													))}
													</>
												):<SelectItem key={"1"} value={"1"} disabled>No hay opciones disponibles.</SelectItem>}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)} />
							<FormField
								control={form.control}
								name="falla_caseta"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>Area:</FormLabel>
										<FormControl>
											<Select {...field} className="input"
												onValueChange={(value: string) => {
													field.onChange(value);
												} }
												value={field.value}
											>
												<SelectTrigger className="w-full">
													{loadingAreas ? 
														<SelectValue placeholder="Cargando áreas..." />
													: <SelectValue placeholder="Selecciona una opción..." />
													}
												</SelectTrigger>
												<SelectContent>
												{areas?.length>0 ? (
													<>
													{areas?.map((area:string, index:number) => {
													return(
														<SelectItem key={index} value={area}>
														{area}
														</SelectItem>
													)})} 
													</>
												):<SelectItem key={"1"} value={"1"} disabled>No hay opciones disponibles.</SelectItem>}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)} />
							<FormField
								control={form.control}
								name="falla_fecha_hora"
								render={() => (
									<FormItem>
										<FormLabel>* Fecha</FormLabel>
										<FormControl>
											<DateTime date={date} setDate={setDate} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)} />
							<FormField
								control={form.control}
								name="falla"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>Concepto:</FormLabel>
										<FormControl>
											<Select {...field} className="input"
												onValueChange={(value: string) => {
													field.onChange(value);
													setSubConcepto(value);
													setCatalogoSub([])
													setUseSelects(true)
												} }
												value={subconcepto}
											>
												<SelectTrigger className="w-full">
												{isLoadingFallas && subconcepto ==""? (  
													<SelectValue placeholder="Cargando subconcepto..." /> 
													
												) : (
													<SelectValue placeholder="Selecciona una falla" />
												)}
												</SelectTrigger>
												<SelectContent>
													{catalagoFallas?.map((vehiculo: string, index: number) => (
														<SelectItem key={index} value={vehiculo}>
															{vehiculo}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)} />
							<FormField
								control={form.control}
								name="falla_objeto_afectado"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>Subconcepto:</FormLabel>
										<FormControl>
											<Select {...field} className="input"
												onValueChange={(value: string) => {
													field.onChange(value);
												} }
												value={field.value}
											>
												<SelectTrigger className="w-full">
													{isLoadingFallas && subconcepto !== "" ? (
														<>
														<div >Cargando subconcepto...</div>
														</>
													) : (
														<SelectValue placeholder="Selecciona una opción..." />
													)}
												</SelectTrigger>
												<SelectContent>
													{catalagoSub.length > 0 ? (
														catalagoSub?.map((item: string, index: number) => {
															return (
																<SelectItem key={index} value={item}>
																	{item}
																</SelectItem>
															);
														})
													) : (
														<><SelectItem disabled value={"no opciones"}>No hay opciones disponibles</SelectItem></>
													)}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)} />
							<FormField
								control={form.control}
								name="falla_comentarios"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>* Comentarios</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Texto"
												className="resize-none"
												{...field} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)} />
							<FormField
								control={form.control}
								name="falla_reporta_nombre"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>Reporta:</FormLabel>
										<FormControl>
											<Select {...field} className="input"
												onValueChange={(value: string) => {
													field.onChange(value);
												} }
												value={field.value}
											>
												<SelectTrigger className="w-full">
													{loadingAreaEmpleado ? (<>
														<SelectValue placeholder="Cargando opciones..." />
													</>) : (<>
														<SelectValue placeholder="Selecciona una opcion" />
													</>)}
												</SelectTrigger>
												<SelectContent>
													{dataAreaEmpleado?.map((vehiculo: string, index: number) => (
														<SelectItem key={index} value={vehiculo}>
															{vehiculo}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)} />
							<FormField
								control={form.control}
								name="falla_responsable_solucionar_nombre"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>Responsable asignado de solucionar:</FormLabel>
										<FormControl>
											<Select {...field} className="input"
												onValueChange={(value: string) => {
													field.onChange(value);
												} }
												value={field.value}
											>
												<SelectTrigger className="w-full">
													{loadingAreaEmpleadoApoyo ? (<>
														<SelectValue placeholder="Cargando opciones..." />
													</>) : (<>
														<SelectValue placeholder="Selecciona una opcion" />
													</>)}
												</SelectTrigger>
												<SelectContent>
													{dataAreaEmpleadoApoyo?.map((vehiculo: string, index: number) => (
														<SelectItem key={index} value={vehiculo}>
															{vehiculo}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)} />
							<div className="flex justify-between">
								<LoadImage
									id="evidencia"
									titulo={"Evidencia"}
									setImg={setEvidencia}
									showWebcamOption={true}
									facingMode="user"
									imgArray={evidencia}
									showArray={true}
									limit={10} />
							</div>
							<div className="flex justify-between">
								<LoadFile
									id="doc"
									titulo={"Documento"}
									setDocs={setDocumento}
									docArray={documento}
									limit={10} />
							</div>
							
						</form>
					</Form>
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
							{isLoading ? (
								<>
									<Loader2 className="animate-spin" /> {"Editando falla..."}
								</>
							) : ("Editar falla")}
						</Button>
				</div>
			</>
		)}
		</DialogContent>
	</Dialog>
  );
};
