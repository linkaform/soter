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

import { useCatalogoArticulos } from "@/hooks/useCatalogoArticulos";
import { Input } from "../ui/input";
import { capitalizeFirstLetter, catalogoColores } from "@/lib/utils";
import { Articulo_perdido_record } from "../table/articulos/pendientes/pendientes-columns";
import { useGetLockers } from "@/hooks/useGetLockers";
import { Edit, Loader2 } from "lucide-react";
import DateTime from "../dateTime";
import { useArticulosPerdidos } from "@/hooks/useArticulosPerdidos";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";

interface EditarFallaModalProps {
  	title: string;
	data: Articulo_perdido_record;
	setShowLoadingModal:Dispatch<SetStateAction<boolean>>;
	showLoadingModal:boolean;
}

const formSchema = z.object({
	area_perdido: z.string().min(1, { message: "Este campo es obligatorio" }),
	articulo_perdido: z.string().optional(),
	articulo_seleccion: z.string().min(1, { message: "Comentario es obligatorio" }), 
    color_perdido:z.string().min(1, { message: "Comentario es obligatorio" }), 
	comentario_perdido:z.string().optional(),
	date_hallazgo_perdido: z.string().optional(),
	descripcion: z.string().optional(),
	estatus_perdido: z.string().optional(), 
	foto_perdido: z.array(
        z.object({
          file_url: z.string(),
          file_name: z.string(),
        })
      ).optional(),
	locker_perdido: z.string().min(1, { message: "Este campo es obligatorio" }), 
	quien_entrega: z.string().optional(),
    quien_entrega_externo: z.string().optional(),
    quien_entrega_interno: z.string().optional(),
    tipo_articulo_perdido: z.string().min(1, { message: "Este campo es obligatorio" }), 
    ubicacion_perdido: z.string().min(1, { message: "Este campo es obligatorio" }),
});

export const EditarArticuloModal: React.FC<EditarFallaModalProps> = ({
  	title,
	data,
	setShowLoadingModal,
    showLoadingModal
}) => {
	const [isSuccess, setIsSuccess] =useState(false)
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(data.ubicacion_perdido);
	const { dataAreas:areas, dataLocations:ubicaciones, isLoadingLocations, isLoadingAreas} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, showLoadingModal|| isSuccess,  ubicacionSeleccionada?true:false);
	const { data:dataAreaEmpleado, isLoading:loadingAreaEmpleado } = useCatalogoAreaEmpleado(showLoadingModal|| isSuccess, ubicacionSeleccionada, "Objetos Perdidos");
    const [tipoArt, setTipoArt] = useState<string>(data.tipo_articulo_perdido);
	
    const { data: dataArticulos ,dataArticuloSub, isLoading: isLoadingArticles,isLoadingArticuloSub} = useCatalogoArticulos(tipoArt, showLoadingModal|| isSuccess);
	const { editarArticulosPerdidosMutation, isLoading} = useArticulosPerdidos("","", "abierto", false)
	const [evidencia , setEvidencia] = useState<Imagen[]>([]);
	const [date, setDate] = useState<Date|"">("");
    const [isActiveInterno, setIsActiveInterno] = useState< string | null>(data?.quien_entrega ? data?.quien_entrega.toLocaleLowerCase():"");
    const { data:responseGetLockers, isLoading:loadingGetLockers } = useGetLockers(ubicacionSeleccionada ?? null,"", "Disponible", isSuccess);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
            area_perdido: data.area_perdido,
            articulo_perdido: data.articulo_perdido,
            articulo_seleccion: data.articulo_seleccion, 
            color_perdido: capitalizeFirstLetter(data.color_perdido??""), 
            comentario_perdido: data.comentario_perdido,
            date_hallazgo_perdido: data.date_hallazgo_perdido, 
            descripcion: data.descripcion, 
            estatus_perdido: data.estatus_perdido,
            foto_perdido: evidencia,
            locker_perdido: data.locker_perdido,
            quien_entrega: data.quien_entrega,
            quien_entrega_externo: data.quien_entrega_externo,
            quien_entrega_interno: data.quien_entrega_interno, 
            tipo_articulo_perdido: tipoArt,
            ubicacion_perdido: data.ubicacion_perdido,
		},
	});

	const { reset } = form;

	useEffect(()=>{
		if(isSuccess){
			reset()
			setEvidencia(data.foto_perdido)
			setDate(new Date(data.date_hallazgo_perdido))
			setShowLoadingModal(false)
		}
	},[isSuccess, ubicaciones, areas])

    useEffect(()=>{
		if(!isLoading){
			handleClose()			
		}
	},[isLoading])

	function onSubmit(values: z.infer<typeof formSchema>) {
		let formattedDate=""
		if(date){
            console.log("tipoArt", tipoArt )
			formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
			const formatData ={
                area_perdido: values.area_perdido || "",
                articulo_perdido:  values.articulo_perdido|| "",
                articulo_seleccion:  values.articulo_seleccion|| "", 
                color_perdido:  values.color_perdido|| "", 
                comentario_perdido:  values.comentario_perdido|| "",
                date_hallazgo_perdido: formattedDate|| "", 
                descripcion:  values.descripcion|| "", 
                estatus_perdido:  values.estatus_perdido|| "pendiente",
                foto_perdido: evidencia || [],
                locker_perdido:  values.locker_perdido|| "",
                quien_entrega:  values.quien_entrega|| "externo",
                quien_entrega_externo:  values.quien_entrega_externo|| "",
                quien_entrega_interno:  values.quien_entrega_interno|| "", 
                tipo_articulo_perdido: tipoArt|| "",
                ubicacion_perdido:  values.ubicacion_perdido|| "",
				}
                console.log("EDICION INFO",formatData )
				editarArticulosPerdidosMutation.mutate({data_article_update: formatData, folio: data.folio})
		}else{
			form.setError("date_hallazgo_perdido", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleClose = () => {
		reset()
		setShowLoadingModal(false); 
        setIsSuccess(false); 
	};


   useEffect(()=>{
        if(showLoadingModal){
            setTimeout(() => {
                setIsSuccess(true); 
            }, 4000);
        }
   },[showLoadingModal])

	const handleOpenModal = async () => {
		setShowLoadingModal(true);
	};

  return (
	<Dialog open={isSuccess} modal>
	<div className="cursor-pointer" onClick={handleOpenModal}>
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
                <div className="flex justify-between">
                    <LoadImage
                        id="evidencia" 
                        titulo={"Evidencia"} 
                        setImg={setEvidencia}
                        showWebcamOption={true}
                        facingMode="user"
                        imgArray={evidencia}
                        showArray={true}
                        limit={10}
                        />
				</div>

                <FormField
				control={form.control}
				name="date_hallazgo_perdido"
				render={() => (
					<FormItem>
					<FormLabel> Fecha del hallazgo:</FormLabel>
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
					name="ubicacion_perdido"
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
								{isLoadingLocations?
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
					name="area_perdido"
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
							{isLoadingAreas?
								 <>
                                 <div >Cargando areas...</div>
                                 </>:<>
								{areas?.length > 0 ?( <>
                                    <SelectValue placeholder="Selecciona una opcion..." />
                                    </>)
								:( <>
                                    <div >Delecciona una ubicacion para ver las opciones...</div>
                                    </>)
								}
								</>}
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
				name="comentario_perdido"
				render={({ field }:any) => (
					<FormItem>
					<FormLabel>Comentarios</FormLabel>
					<FormControl className="col-span-2">
						<Textarea
						placeholder="Texto"
						className="resize-none w-full"
						{...field}
                        value={field.value}
						/>
					</FormControl>
					<FormMessage />
					</FormItem>
				)}
				/>

				<FormField
					control={form.control}
					name="tipo_articulo_perdido"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Tipo de artículo:</FormLabel>
							<FormControl>
							<Select {...field} className="input"
								onValueChange={(value:string) => {
								field.onChange(value); 
                                setTipoArt(value)
							}}
							value={tipoArt} 
						>
							<SelectTrigger className="w-full">
								{isLoadingArticles && tipoArt == "" ? <SelectValue placeholder="Cargando Articulos..." />:
                                <SelectValue placeholder="Selecciona un articulo" />}
							</SelectTrigger>
							<SelectContent>
							{dataArticulos?.map((vehiculo:string, index:number) => (
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
					name="articulo_seleccion"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Artículo:</FormLabel>
							<FormControl>
							<Select {...field} className="input"
								onValueChange={(value:string) => {
								field.onChange(value); 
							}}
							value={field.value} 
						>
							<SelectTrigger className="w-full">
								{isLoadingArticuloSub && tipoArt ? (
                                    <>
                                    <div >Cargando articulos...</div>
                                    </>
								):(<>
								{dataArticuloSub?.length > 0 ?( <>
                                    <SelectValue placeholder="Selecciona una opcion..." />
                                    </>)
								:( <>
                                    <div >Selecciona una categoria para ver las opciones...</div>
                                    </>)
								}
								</>)}
								
							</SelectTrigger>
							<SelectContent>
							{dataArticuloSub?.length>0 ? (
								dataArticuloSub?.map((item:string, index:number) => {
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
                    name="articulo_perdido"
                    render={({ field}:any)=> (
                        <FormItem>
                            <FormLabel className="">
                                <span className="text-red-500">*</span> Nombre:
                            </FormLabel>{" "}
                            <FormControl>
                                <Input placeholder="Nombre Completo" {...field} value={field.value}
                                />
                            </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="color_perdido"
                    render={({ field }:any) => (
                        <FormItem>
                        <FormLabel>Color:</FormLabel>
                        <FormControl>
                        <Select {...field} className="input"
                                onValueChange={(value:string) => {
                                field.onChange(value); 
                            }}
                            value={field.value} 
                            >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona un color" />
                            </SelectTrigger>
                            <SelectContent>
                            {catalogoColores().map((vehiculo:string) => (
                                <SelectItem key={vehiculo} value={vehiculo}>
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
                    name="descripcion"
                    render={({ field }:any) => (
                        <FormItem>
                        <FormLabel>Descripción: </FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Texto"
                            className="resize-none"
                            {...field}
                            value={field.value}
                            />
                        </FormControl>

                        <FormMessage />
                        </FormItem>
                    )}
                />
        
                <div className="flex gap-2 flex-col ">
						<FormLabel className="mb-2">
                        Quién entrega, Selecciona una opción:
						</FormLabel>
						<div className="flex gap-2">
							<div className="flex gap-2 flex-wrap">
								<Button
								type="button"
								onClick={() => setIsActiveInterno("interno")}
								className={`px-4 py-2 rounded-md transition-all duration-300 ${
                                    isActiveInterno === 'interno'
                                      ? 'bg-blue-600 text-white'
                                      : 'border-2 border-blue-400 bg-transparent'
                                  } hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`} //hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]
								>
								<div className="flex flex-wrap items-center">
									{isActiveInterno == "interno"? (
									<>
										<div>Interno</div>
									</>
									) : (
									<>
										<div className="text-blue-600">Interno</div>
									</>
									)}
								</div>
								</Button>
							</div>
							<div className="flex gap-2 flex-wrap">
								<Button
								type="button"
								onClick={() => setIsActiveInterno("externo")}
								className={`px-4 py-2 rounded-md transition-all duration-300 ${
                                    isActiveInterno === 'externo'
                                      ? 'bg-blue-600 text-white'
                                      : 'border-2 border-blue-400 bg-transparent'
                                  } hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
								>
								<div className="flex flex-wrap items-center">
									{isActiveInterno == "externo"? (
									<>
										<div>Externo</div>
									</>
									) : (
									<>
										<div className="text-blue-600">Externo</div>
									</>
									)}
								</div>
								</Button>
							</div>
						</div>						
				</div>
                <br/>
                {isActiveInterno=="interno"? (
                    <FormField
                        control={form.control}
                            name="quien_entrega_interno"
                            render={({ field }:any) => (
                                <FormItem>
                                    <FormLabel>Quien entrega Interno:</FormLabel>
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
                ):(
                    <FormField
                        control={form.control}
                            name="quien_entrega_externo"
                            render={({ field}:any)=> (
                                <FormItem>
                                    <FormLabel className="">
                                        <span className="text-red-500">*</span> Quien entrega Externo:
                                    </FormLabel>{" "}
                                    <FormControl>
                                        <Input placeholder="Nombre" {...field} value={field.value}
                                        />
                                    </FormControl>
                                <FormMessage />
                                </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                        name="locker_perdido"
                        render={({ field }:any) => (
                            <FormItem>
                                <FormLabel>Área de resguardo:</FormLabel>
                                <FormControl>
                                <Select {...field} className="input"
                                    onValueChange={(value:string) => {
                                    field.onChange(value); 
                                }}
                                value={field.value} 
                            >
                                <SelectTrigger className="w-full">
                                    {loadingGetLockers?(<>
                                        <SelectValue placeholder="Cargando opciones..." />
                                    </>):(<>
                                        <SelectValue placeholder="Selecciona una opcion" />
                                    </>)}
                                </SelectTrigger>
                                <SelectContent>
                                {responseGetLockers ? <>
                                    {responseGetLockers?.map((locker:any, index:number) => (
                                        <SelectItem key={index} value={locker.locker_id}>
                                            {locker.locker_id}
                                        </SelectItem>
                                    ))}
                                </>: 
                                    <SelectItem key={"0"} value={"0"} disabled>
                                        Selecciona una ubicación
                                    </SelectItem>
                                }
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
								<Loader2 className="animate-spin" /> {"Editando falla..."}
							</>
						) : ("Editar falla")}
					</Button>
			</div>
            </DialogContent>
        </Dialog>
  );
};
