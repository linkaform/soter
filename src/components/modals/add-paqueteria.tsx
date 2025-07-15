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
import { Textarea } from "../ui/textarea";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { format } from 'date-fns';

import { useCatalogoAreaEmpleadoApoyo } from "@/hooks/useCatalogoAreaEmpleadoApoyo";
import DateTime from "../dateTime";
import { Loader2 } from "lucide-react";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { useShiftStore } from "@/store/useShiftStore";
import { usePaqueteria } from "@/hooks/usePaqueteria";
import LoadImage from "../upload-Image";
import { Imagen } from "@/lib/update-pass";
import { useCatalogoProveedores } from "@/hooks/useCatalogoProveedores";
import { useGetLockers } from "@/hooks/useGetLockers";

interface AddFallaModalProps {
  	title: string;
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
	onClose: ()=> void;
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
	fecha_recibido_paqueteria:z.string().optional(),
	estatus_paqueteria: z.array(z.string()).optional(),
	proveedor: z.string().optional(),
});

export const AddPaqueteriaModal: React.FC<AddFallaModalProps> = ({
  	title,
	isSuccess,
	setIsSuccess,
}) => {
	const [conSelected, setConSelected] = useState<string>("");
	const {location, area} = useShiftStore()
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location);
	const { dataAreas:areas, dataLocations:ubicaciones, isLoadingAreas:loadingAreas, isLoadingLocations:loadingUbicaciones} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true,  ubicacionSeleccionada?true:false);
	const { data:dataAreaEmpleadoApoyo, isLoading:loadingAreaEmpleadoApoyo,} = useCatalogoAreaEmpleadoApoyo(isSuccess);
	const { dataProveedores, isLoadingProveedores} = useCatalogoProveedores(isSuccess)
	const { createPaqueteriaMutation, isLoading} = usePaqueteria(ubicacionSeleccionada, area, "", false, "", "", "")
	const { data:responseGetLockers, isLoading:loadingGetLockers } = useGetLockers(ubicacionSeleccionada ?? false,"", "Disponible", isSuccess);
	const [date, setDate] = useState<Date|"">("");
	const [evidencia, setEvidencia] = useState<Imagen[]>([])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			ubicacion_paqueteria: "Guardado",
			area_paqueteria:"",
			fotografia_paqueteria: [],
			descripcion_paqueteria:"",
			quien_recibe_paqueteria:"",
			guardado_en_paqueteria: "",
			fecha_recibido_paqueteria: "",
			estatus_paqueteria:["guardado"],
			proveedor:  "",
		},
	});

	const { reset } = form;

	useEffect(()=>{
		if(isSuccess){
			reset()
			setDate(new Date())
			setUbicacionSeleccionada(location)
		}
	},[isSuccess])

	useEffect(()=>{
		if(!isLoading){
			handleClose()			
		}
	},[isLoading])

	function onSubmit(values: z.infer<typeof formSchema>) {
		if(date){
			const formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
			const formatData ={
					ubicacion_paqueteria: ubicacionSeleccionada,
					area_paqueteria:values.area_paqueteria??"",
					fotografia_paqueteria: evidencia ?? [],
                    descripcion_paqueteria: values.descripcion_paqueteria ?? "",
					quien_recibe_paqueteria: values.quien_recibe_paqueteria??"",
					guardado_en_paqueteria: values.guardado_en_paqueteria??"",
                    fecha_recibido_paqueteria: formattedDate?? "",
					fecha_entregado_paqueteria: "",
					entregado_a_paqueteria:"",
                    estatus_paqueteria:["guardado"],
                    proveedor: values.proveedor?? "",
				}
				createPaqueteriaMutation.mutate({data_paquete: formatData})
		}else{
			form.setError("fecha_recibido_paqueteria", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleClose = () => {
		setIsSuccess(false); 
	};

  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogTrigger></DialogTrigger>

      <DialogContent className="max-w-3xl  overflow-y-auto max-h-[80vh] flex flex-col" aria-describedby="">
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
					name="area_paqueteria"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Area:</FormLabel>
							<FormControl>
							<Select {...field} className="input"
								onValueChange={(value:string) => {
								field.onChange(value); 
								// setAreaSeleccionada(value)
								setConSelected(value)
							}}
							value={conSelected} 
						>
							<SelectTrigger className="w-full">
							{loadingAreas?
								<SelectValue placeholder="Cargando areas..." />:<SelectValue placeholder="Selecciona una ubicación" />}
							</SelectTrigger>
							<SelectContent>
							{areas?.length >0 ? (
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
					)}
				/>

				<FormField
					control={form.control}
					name="fecha_recibido_paqueteria"
					render={() => (
						<FormItem>
						<FormLabel> Fecha de la recepcion:</FormLabel>
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
					name="quien_recibe_paqueteria"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Destinatario:</FormLabel>
							<FormControl>
							<Select {...field} className="input"
								onValueChange={(value:string) => {
								field.onChange(value); 
							}}
							value={field.value} 
						>
							<SelectTrigger className="w-full">
								{loadingAreaEmpleadoApoyo ? (
									<SelectValue placeholder="Cargando articulos..." />
								):(<>
								{dataAreaEmpleadoApoyo?.length > 0 ?(<SelectValue placeholder="Selecciona una opción..." />)
								:(<SelectValue placeholder="Selecciona una categoria para ver las opciones..." />)
								}
								</>)}
								
							</SelectTrigger>
							<SelectContent>
							{dataAreaEmpleadoApoyo?.length>0 ? (
								dataAreaEmpleadoApoyo?.map((item:string, index:number) => {
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
				{isLoading? (
				<>
					<Loader2 className="animate-spin"/> {"Creando Articulo..."}
				</>
			):("Crear Articulo")}
			</Button>
		</div>
		
      </DialogContent>
    </Dialog>
  );
};
