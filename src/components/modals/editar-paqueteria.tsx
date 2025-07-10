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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import LoadImage from "../upload-Image";
import { Imagen } from "@/lib/update-pass";
import { useCatalogoAreaEmpleado } from "@/hooks/useCatalogoAreaEmpleado";
import { format,  } from 'date-fns';

import DateTime from "../dateTime";
import { Edit, Loader2 } from "lucide-react";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { useShiftStore } from "@/store/useShiftStore";
import { usePaqueteria } from "@/hooks/usePaqueteria";
import { useGetLockers } from "@/hooks/useGetLockers";
import { Textarea } from "../ui/textarea";
import { useCatalogoProveedores } from "@/hooks/useCatalogoProveedores";

interface EditarFallaModalProps {
  	title: string;
	data: any;
	setShowLoadingModal:Dispatch<SetStateAction<boolean>>;
	showLoadingModal:boolean;
}

const formSchema = z.object({
	ubicacion_paqueteria:z.string().min(2, {
		message: "Ubicación campo es requerido.",
	}),
    area_paqueteria:z.string().min(2, {
		message: "Area es campo requerido.",
	}),
	fotografia_paqueteria: z.array(
        z.object({
          file_url: z.string(),
          file_name: z.string(),
        })
      ).optional(),
	descripcion_paqueteria: z.string().min(2, {
		message: "Este campo es requerido."
	}),
	quien_recibe_paqueteria: z.string().optional(),
	guardado_en_paqueteria: z.string().min(2, {
		message: "Este campo es requerido.",
	}),
    entregado_a_paqueteria:z.string().optional(),
	fecha_recibido_paqueteria:z.string().optional(),
    fecha_entregado_paqueteria:z.string().optional(),
	estatus_paqueteria:z.array(z.string()).optional(),
	proveedor: z.string().optional(),
});

export const EditarPaqueteria: React.FC<EditarFallaModalProps> = ({
  	title,
	data,
	setShowLoadingModal,
}) => {
	const [isSuccess, setIsSuccess] =useState(false)
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(data.ubicacion_paqueteria);
	const { location } = useShiftStore();
	const { dataAreas:areas, dataLocations:ubicaciones, isLoadingAreas:loadingAreas} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true,  ubicacionSeleccionada?true:false);
	const { data:dataAreaEmpleado, isLoading:loadingAreaEmpleado } = useCatalogoAreaEmpleado(isSuccess, location, "Incidencias");
	const { editarPaqueteriaMutation, isLoading} = usePaqueteria("","", "abierto", false,"", "", "")
	const { dataProveedores, isLoadingProveedores} = useCatalogoProveedores(isSuccess)
	const { data:responseGetLockers, isLoading:loadingGetLockers } = useGetLockers(ubicacionSeleccionada ?? false,"", "Disponible", isSuccess);
	const [evidencia , setEvidencia] = useState<Imagen[]>([]);
	const [date, setDate] = useState<Date|"">("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
            ubicacion_paqueteria: data.ubicacion_paqueteria,
			area_paqueteria: data.area_paqueteria,
			fotografia_paqueteria: evidencia,
			descripcion_paqueteria: data.descripcion_paqueteria,
			quien_recibe_paqueteria: data.quien_recibe_paqueteria,
			guardado_en_paqueteria: data.guardado_en_paqueteria,
			fecha_recibido_paqueteria:"",
            entregado_a_paqueteria: data.entregado_a_paqueteria,
			proveedor:  data.proveedor,}
        });

	const { reset } = form;
	

	useEffect(()=>{
		if(isSuccess){
			reset()
			setEvidencia(data.fotografia_paqueteria)
			setDate(new Date(data.fecha_recibido_paqueteria))
			setShowLoadingModal(false)
		}
	},[isSuccess])

	useEffect(()=>{
		if(!isLoading){
			handleClose()			
		}
	},[isLoading])

	function onSubmit(values: z.infer<typeof formSchema>) {
		let formattedDate=""
		if(date){
			formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
			const formatData ={
                ubicacion_paqueteria: values.ubicacion_paqueteria ,
                area_paqueteria:values.area_paqueteria?? "",
                fotografia_paqueteria: evidencia ?? [],
                descripcion_paqueteria: values.descripcion_paqueteria ?? "",
                quien_recibe_paqueteria: values.quien_recibe_paqueteria ?? "",
                guardado_en_paqueteria: values.guardado_en_paqueteria?? "",
                fecha_recibido_paqueteria: formattedDate?? "",
                entregado_a_paqueteria: values.entregado_a_paqueteria ?? "",
                proveedor: values.proveedor?? "",

				}
                editarPaqueteriaMutation.mutate({data_paquete_actualizar: formatData, folio: data.folio})
		}else{
			form.setError("fecha_recibido_paqueteria", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleClose = () => {
		reset()
		setShowLoadingModal(false); 
		setIsSuccess(false); 
	};

	const handleOpenModal = async () => {
		setShowLoadingModal(false);
		setIsSuccess(true);
	};

  return (
	<Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
		<div className="cursor-pointer" title="Editar Paquete" onClick={handleOpenModal}>
			<Edit />
		</div>
	<DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] flex flex-col" aria-describedby="">
		<DialogHeader className="flex-shrink-0">
		<DialogTitle className="text-2xl text-center font-bold">
			{title}
		</DialogTitle>
		</DialogHeader>
				<div className="flex-grow overflow-y-auto p-4">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<FormField
								control={form.control}
								name="ubicacion_paqueteria"
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
								name="area_paqueteria"
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
								name="fecha_recibido_paqueteria"
								render={() => (
									<FormItem>
										<FormLabel>* Fecha de la recepción</FormLabel>
										<FormControl>
											<DateTime date={date} setDate={setDate} />
										</FormControl>

										<FormMessage />
									</FormItem>
								)} />
							<FormField
								control={form.control}
								name="quien_recibe_paqueteria"
								render={({ field }:any) => (
									<FormItem>
										<FormLabel>Quien recibe:</FormLabel>
										<FormControl>
										<Select {...field} className="input"
											onValueChange={(value:string) => {
											field.onChange(value); 
										}}
										value={field.value} 
									>
										<SelectTrigger className="w-full">
											{loadingAreaEmpleado ? (
												<SelectValue placeholder="Cargando articulos..." />
											):(<>
											{dataAreaEmpleado?.length > 0 ?(<SelectValue placeholder="Selecciona una opción..." />)
											:(<SelectValue placeholder="Selecciona una categoria para ver las opciones..." />)
											}
											</>)}
											
										</SelectTrigger>
										<SelectContent>
										{dataAreaEmpleado?.length>0 ? (
											dataAreaEmpleado?.map((item:string, index:number) => {
												return (
													<SelectItem key={index} value={item}>
														{item}
													</SelectItem>
												)
											})
										):(
											<><SelectItem disabled value={"no opciones"}>No hay opciones disponibles</SelectItem></>
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
                    name="descripcion_paqueteria"
                    render={({ field }:any) => (
                        <FormItem>
                        <FormLabel>Descripción: </FormLabel>
                        <FormControl className="col-span-2">
                            <Textarea
                            placeholder="Texto"
                            className="resize-none "
                            {...field}
                            />
                        </FormControl>

                        <FormMessage />
                        </FormItem>
                    )}
                    />

				<div className="flex justify-between">
                    <LoadImage
                        id="evidencia" 
                        titulo={"Fotografia"} 
                        setImg={setEvidencia}
                        showWebcamOption={true}
                        facingMode="environment"
                        imgArray={evidencia}
                        showArray={true}
                        limit={10}
                        />
				</div>

				<FormField
					control={form.control}
					name="proveedor"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Proveedor:</FormLabel>
							<FormControl>
							<Select {...field} className="input"
								onValueChange={(value:string) => {
								field.onChange(value); 
							}}
							value={field.value} 
						>
							<SelectTrigger className="w-full">
								{isLoadingProveedores ? (
									<SelectValue placeholder="Cargando articulos..." />
								):(<>
								{dataProveedores?.length > 0 ?(<SelectValue placeholder="Selecciona una opción..." />)
								:(<SelectValue placeholder="Selecciona una categoria para ver las opciones..." />)
								}
								</>)}
								
							</SelectTrigger>
							<SelectContent>
							{dataProveedores?.length>0 ? (
								dataProveedores?.map((item:string, index:number) => {
									return (
										<SelectItem key={index} value={item}>
											{item}
										</SelectItem>
									)
								})
							):(
								<><SelectItem disabled value={"no opciones"}>No hay opciones disponibles</SelectItem></>
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
					name="guardado_en_paqueteria"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Guardado en:</FormLabel>
							<FormControl>
							<Select {...field} className="input"
								onValueChange={(value:string) => {
								field.onChange(value); 
							}}
							value={field.value} 
						>
							<SelectTrigger className="w-full">
								{loadingGetLockers ? (
									<SelectValue placeholder="Cargando articulos..." />
								):(<>
								{responseGetLockers?.length > 0 ?(<SelectValue placeholder="Selecciona una opción..." />)
								:(<SelectValue placeholder="Selecciona una categoria para ver las opciones..." />)
								}
								</>)}
								
							</SelectTrigger>
							<SelectContent>
							{responseGetLockers?.length>0 ? (
								responseGetLockers?.map((item:any, index:number) => {
									return (
										<SelectItem key={index} value={item.locker_id}>
											{item.locker_id}
										</SelectItem>
									)
								})
							):(
								<><SelectItem disabled value={"no opciones"}>No hay opciones disponibles</SelectItem></>
							)}
							</SelectContent>
						</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>	
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
								<Loader2 className="animate-spin" /> {"Editando paqueteria..."}
							</>
						) : ("Editar paqueteria")}
					</Button>
			</div>
		</DialogContent>
	</Dialog>
  );
};
