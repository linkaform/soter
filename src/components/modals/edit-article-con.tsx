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

import { format } from 'date-fns';

import { useCatalogoAreaEmpleadoApoyo } from "@/hooks/useCatalogoAreaEmpleadoApoyo";
import DateTime from "../dateTime";
import { Edit, Loader2 } from "lucide-react";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { useArticulosConcesionados } from "@/hooks/useArticulosConcesionados";
import { useCatalogoConcesion } from "@/hooks/useCatalogoConcesion";
import { Articulo_con_record } from "../table/articulos/concecionados/concecionados-columns";
import { useShiftStore } from "@/store/useShiftStore";

interface AddFallaModalProps {
  	title: string;
    data: Articulo_con_record;
    setShowLoadingModal:Dispatch<SetStateAction<boolean>>;
	showLoadingModal:boolean;
}

const formSchema = z.object({
    status_concesion:z.string().optional(),
    persona_nombre_concesion:z.string().optional(),
	ubicacion_concesion: z.string().optional(),
	caseta_concesion: z.string().optional(),
	fecha_concesion: z.string().optional(),
	solicita_concesion: z.string().min(2, {
		message: "Este campo es requerido.",
	}),
	area_concesion: z.string().optional(),
	equipo_concesion: z.string().optional(), 
	observacion_concesion: z.string().optional(), 
});

export const EditArticuloConModal: React.FC<AddFallaModalProps> = ({
  	title,
    data,
    setShowLoadingModal,
    showLoadingModal
}) => {
	const { area } = useShiftStore()
    const [isSuccess, setIsSuccess] =useState(false)
	const [conSelected, setConSelected] = useState<string>(data.solicita_concesion);
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(data.ubicacion_concesion);

	const { dataAreas:areas, dataLocations:ubicaciones, isLoadingAreas:loadingAreas, isLoadingLocations:loadingUbicaciones} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true,  ubicacionSeleccionada?true:false);
	const { data:dataAreaEmpleadoApoyo, isLoading:loadingAreaEmpleadoApoyo,} = useCatalogoAreaEmpleadoApoyo(showLoadingModal|| isSuccess);
	const { editarArticulosConMutation, isLoading} = useArticulosConcesionados(ubicacionSeleccionada, area, "",false, "", "", "")
    const { dataCon, dataConSub, isLoadingCon, isLoadingConSub  } = useCatalogoConcesion(ubicacionSeleccionada, conSelected, showLoadingModal|| isSuccess);
	const [date, setDate] = useState<Date|"">("");

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
            status_concesion:data.status_concesion,
            persona_nombre_concesion:data.persona_nombre_concesion,
            ubicacion_concesion:ubicacionSeleccionada,
            caseta_concesion:data.caseta_concesion,
            fecha_concesion:"",
            solicita_concesion:conSelected,
            area_concesion:data.area_concesion,
            equipo_concesion:"", 
            observacion_concesion:data.observacion_concesion, 
		},
	});

	const { reset } = form;

	useEffect(()=>{
		if(isSuccess){
			reset()
			setShowLoadingModal(false); 
			setDate(new Date(data.fecha_concesion))
		}
	},[isSuccess])

	useEffect(()=>{
		if(!isLoading){
			handleClose()			
		}
	},[isLoading])

    useEffect(()=>{
        if(showLoadingModal){
            setTimeout(() => {
                setIsSuccess(true); 
            }, 2000);
        }
   	},[showLoadingModal])

	function onSubmit(values: z.infer<typeof formSchema>) {
		if(date){
			const formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
			const formatData ={
                    status_concesion: "abierto",
                    persona_nombre_concesion:values.persona_nombre_concesion??"",
                    ubicacion_concesion: values.ubicacion_concesion ?? "",
                    caseta_concesion: values.caseta_concesion ?? "",
                    fecha_concesion: formattedDate?? "",
                    solicita_concesion: values.solicita_concesion ?? "persona",
                    area_concesion: values.area_concesion?? "",
                    equipo_concesion: values.equipo_concesion?? "", 
                    observacion_concesion: values.observacion_concesion?? "", 
				}
				editarArticulosConMutation.mutate({data_article_update: formatData, folio: data.folio})
		}else{
			form.setError("fecha_concesion", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleClose = () => {
		reset()
		setShowLoadingModal(false); 
        setIsSuccess(false); 
	};

	// const handleToggleExterno = () => {
	// 	setIsActiveInterno(!isActiveExterno);
	// };

    const handleOpenModal = async () => {
		setShowLoadingModal(true);
	};


  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
	<div className="cursor-pointer" title="Editar Artículo" onClick={handleOpenModal}>
		<Edit />
	</div>

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
					name="ubicacion_concesion"
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
					name="caseta_concesion"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Area:</FormLabel>
							<FormControl>
							<Select {...field} className="input"
								onValueChange={(value:string) => {
								field.onChange(value); 
							}}
							value={field.value} 
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
					name="fecha_concesion"
					render={() => (
						<FormItem>
						<FormLabel> Fecha de la concesion:</FormLabel>
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
					name="solicita_concesion"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Tipo de concesion:</FormLabel>
							<FormControl>
							<Select {...field} className="input"
								onValueChange={(value:string) => {
								field.onChange(value); 
								setConSelected(value)
							}}
							value={field.value} 
						>
							<SelectTrigger className="w-full">
									<SelectValue placeholder="Seleciona una opcion..." />
							</SelectTrigger>
							<SelectContent>
								<SelectItem key={"persona"} value={"persona"}>Persona</SelectItem>
								<SelectItem key={"área"} value={"área"}>Area</SelectItem>
								<SelectItem key={"compartida"} value={"compartida"}>Compartida</SelectItem>
							</SelectContent>
						</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>	

				<FormField
					control={form.control}
					name="area_concesion"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Nombre del area:</FormLabel>
							<FormControl>
							<Select {...field} className="input"
								onValueChange={(value:string) => {
								field.onChange(value); 
							}}
							value={field.value} 
						>
							<SelectTrigger className="w-full">
								{isLoadingCon && conSelected ? (
									<SelectValue placeholder="Cargando articulos..." />
								):(<>
								{dataCon?.length > 0 ?(<SelectValue placeholder="Selecciona una opción..." />)
								:(<SelectValue placeholder="Selecciona una categoria para ver las opciones..." />)
								}
								</>)}
								
							</SelectTrigger>
							<SelectContent>
							{dataCon?.length>0 ? (
								dataCon?.map((item:string, index:number) => {
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
					name="equipo_concesion"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Nombre del equipo:</FormLabel>
							<FormControl>
							<Select {...field} className="input"
								onValueChange={(value:string) => {
								field.onChange(value); 
							}}
							value={field.value} 
						>
							<SelectTrigger className="w-full">
								{isLoadingConSub && conSelected ? (
									<SelectValue placeholder="Cargando articulos..." />
								):(<>
								{dataConSub?.length > 0 ?(<SelectValue placeholder="Selecciona una opción..." />)
								:(<SelectValue placeholder="Selecciona una categoria para ver las opciones..." />)
								}
								</>)}
								
							</SelectTrigger>
							<SelectContent>
							{dataConSub?.length>0 ? (
								dataConSub?.map((item:string, index:number) => {
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
					name="persona_nombre_concesion"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Persona:</FormLabel>
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
                    name="observacion_concesion"
                    render={({ field }:any) => (
                        <FormItem className="col-span-2">
                        <FormLabel>Observaciones: </FormLabel>
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
