/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "../ui/form";

import { Input } from "../ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";


import { Equipo, Imagen, Vehiculo } from "@/lib/update-pass-full";
import LoadImage from "../upload-Image";
import { useUpdateAccessPass } from "@/hooks/useUpdatePass";
import { EqipmentLocalPassModal } from "./add-local-equipo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import useAuthStore from "@/store/useAuthStore";
import { Car, Laptop } from "lucide-react";
import { VehiclePassModal } from "./add-local-vehicule";
import { toast } from "sonner";

interface Props {
  title: string;
  children: React.ReactNode;
  id:string;
  dataCatalogos:any;
}
const formSchema = z.object({
  foto: z.array(
	  z.object({
		file_url: z.string(),
		file_name: z.string(),
	  })
	).optional(),
  identificacion:  z.array(
	  z.object({
		file_url: z.string(),
		file_name: z.string(),
	  })
	).optional(),
  area: z.string().optional(),
  status_pase: z.string().optional(),
  fecha_desde_visita: z.string().optional(),
  fecha_desde_hasta: z.string().optional(),
  config_limitar_acceso: z.number().optional(),
});

export const UpdatePassModal: React.FC<Props> = ({ title, children, id , dataCatalogos}) => {
    console.log("Infomracion",dataCatalogos)
    const { userIdSoter} = useAuthStore()
    const [openModal, setOpenModal] = useState(false);
    const [fotografia, setFotografia] = useState<Imagen[]>([]);
    const [identificacion, setIdentificacion] = useState<Imagen[]>([]);
    const { updatePassMutation } = useUpdateAccessPass();

	const [agregarEquiposActive, setAgregarEquiposActive] = useState(false);
	const [agregarVehiculosActive, setAgregarVehiculosActive] = useState(false);

    const [fechaDesde, setFechaDesde] = useState("")
    const [showIneIden] = useState("iden-foto")
    const [equipos, setEquipos] = useState<Equipo[]>([])
    const [vehicles, setVehicles] = useState<Vehiculo[]>([])

    const [errorFotografia, setErrorFotografia] = useState("")
	const [errorIdentificacion, setErrorIdentificacion] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        foto: [],
        identificacion: [],
        area: "",
        status_pase:"activo",
        fecha_desde_visita:"",
        fecha_desde_hasta:"",
        config_limitar_acceso:0
        },
    });

    const handleCheckboxChange = (name:string) => {
        if (name === "agregar-equipos") {
                setAgregarEquiposActive(!agregarEquiposActive);
        } else if (name === "agregar-vehiculos") {
                setAgregarVehiculosActive(!agregarVehiculosActive);
        }
        };

    function onSubmit(data: z.infer<typeof formSchema>) {
        const access_pass = {
            foto: fotografia ,
            identificacion: identificacion,
            status_pase:"activo",
            fecha_desde_visita:fechaDesde,
            fecha_desde_hasta:"",
            config_limitar_acceso: data.config_limitar_acceso,
        };
        if (showIneIden?.includes("foto") && fotografia.length<=0) {
            setErrorFotografia("Este campo es requerido.");
        }else{
            setErrorFotografia("-")
        }

        if (showIneIden?.includes("iden") && identificacion.length<=0) {
                setErrorIdentificacion("Este campo es requerido.")
        }else{
            setErrorIdentificacion("-")
        }
        if(errorFotografia || errorIdentificacion){
            toast.error("Faltan campos llenar")
        }else{
            updatePassMutation.mutate({access_pass, id, account_id:userIdSoter})
        }
        // updatePassMutation.mutate({access_pass, id, account_id:userIdSoter})
        //   registerNewVisit.mutate({ location, access_pass });
    }

    useEffect(()=>{
        console.log("errores", form.formState.errors)
    },[form.formState.errors])


    const handleRemove = (index: number) => {
        setVehicles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleRemoveEq = (index: number) => {
        setEquipos((prev) => prev.filter((_, i) => i !== index))
    }


	const handleFechaDesdeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFechaDesde(e.target.value);
		form.setValue('fecha_desde_hasta', '');
	};

    useEffect(()=>{
		if (errorFotografia === "-" && errorIdentificacion === "-") {
			setOpenModal(true); 
	} else {
            setOpenModal(false); 
	}
	},[errorFotografia,errorIdentificacion ])

    function getNextDay(date: string | number | Date) {
		const currentDate = new Date(date);
		currentDate.setDate(currentDate.getDate() + 1); 
		return currentDate.toISOString().split('T')[0]; 
	}

    return (
        <Dialog open={openModal} onOpenChange={setOpenModal} modal>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-scroll">
            <DialogHeader>
            <DialogTitle className="text-2xl	 text-center  font-bold my-5">
                {title}
            </DialogTitle>
            </DialogHeader>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <>
                <div className="flex flex-col flex-wrap space-y-5 max-w-5xl mx-auto">
                    <div className="flex flex-col space-y-5">
                        {/* Nombre */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="w-full flex gap-2">
                            <p className="font-bold whitespace-nowrap">Nombre:</p>
                            <p>{dataCatalogos?.nombre}</p>
                            </div>
                        </div>

                        {/* Email y Teléfono */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="w-full flex gap-2">
                            <p className="font-bold whitespace-nowrap">Email:</p>
                            <p className="w-full break-words">{dataCatalogos?.email}</p>
                            </div>

                            <div className="w-full flex gap-2">
                            <p className="font-bold whitespace-nowrap">Teléfono:</p>
                            <p className="text-sm">{dataCatalogos?.telefono}</p>
                            </div>
                        </div>

                        {/* Visita y Ubicación */}
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                            <div className="w-full flex gap-2">
                            <p className="font-bold whitespace-nowrap">Visita a:</p>
                            <p className="w-full break-words">
                                {dataCatalogos?.visita_a?.[0]?.nombre || ""}
                            </p>
                            </div>

                            <div className="w-full flex gap-2">
                            <p className="font-bold whitespace-nowrap">Ubicación:</p>
                            <p className="w-full break-words">
                                {dataCatalogos?.ubicacion}
                            </p>
                            </div>
                        </div>
                        

                        <div className="flex justify-between gap-3">
                            {showIneIden?.includes("foto")&& 
                                <div className="w-full md:w-1/2 pr-2">
                                        <LoadImage
                                            id="fotografia"
                                            titulo={"Fotografía"}
                                            setImg={setFotografia}
                                            showWebcamOption={true}
                                            facingMode="user" 
                                            imgArray={fotografia} 
                                            showArray={true} 
                                            limit={1}/>
                                        {errorFotografia !=="" && <span className="text-red-500 text-sm">{errorFotografia}</span>}
                                </div>}
                                {showIneIden?.includes("iden")&& <div className="w-full md:w-1/2">
                                        <LoadImage
                                        id="identificacion"
                                        titulo={"Identificación"}
                                        setImg={setIdentificacion}
                                        showWebcamOption={true}
                                        facingMode="environment" 
                                        imgArray={identificacion} 
                                        showArray={true} 
                                        limit={1}
                                        />
                                        {errorIdentificacion !=="" && <span className="text-red-500 text-sm">{errorIdentificacion}</span>}
                                </div>}
                        </div> 
                        <div className="flex flex-col gap-y-6">
                            <div>
                                <div className="flex items-center gap-x-10">
                                <span className="font-bold text-xl">Lista de Vehículos</span>
                                <VehiclePassModal title="Nuevo Vehiculo" vehicles={vehicles} setVehicles={setVehicles}>
                                    <button
                                    type="button"
                                    onClick={() => handleCheckboxChange("agregar-vehiculos")}
                                    className="px-4 py-2 rounded-md transition-all duration-300 border-2 border-blue-400 bg-transparent hover:bg-slate-100"
                                    >
                                    <div className="flex items-center gap-2">
                                        <div className="text-blue-600 sm:hidden text-xl font-bold">+</div>
                                        <Car className="text-blue-600" />
                                        <div className="text-blue-600 hidden sm:block">Agregar Vehículos</div>
                                    </div>
                                    </button>
                                </VehiclePassModal>
                                </div>
                                <div className="mt-2 text-gray-600">
                                    
                                <Accordion type="multiple" className="w-full">
                                    {vehicles.map((vehiculo, index) => (
                                        <AccordionItem key={index} value={`vehiculo-${index}`}>
                                        <AccordionTrigger>
                                            {vehiculo.tipo}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-sm">
                                            <p><strong>Tipo:</strong> {vehiculo.tipo}</p>
                                            <p><strong>Marca:</strong> {vehiculo.marca}</p>
                                            <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
                                            <p><strong>Placas:</strong> {vehiculo.placas}</p>
                                            <p><strong>Estado:</strong> {vehiculo.estado}</p>
                                            <p><strong>Color:</strong> {vehiculo.color}</p>
                                            </div>
                                
                                            <div className="flex justify-end px-4 pb-4">
                                            <Button variant="destructive" size="sm" onClick={() => handleRemove(index)}>
                                                Eliminar
                                            </Button>
                                            </div>
                                        </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                    {vehicles.length==0?(
                                    <div>No se han agregado vehiculos.</div>):null}
                                </Accordion>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-x-10">
                                <span className="font-bold text-xl">Lista de Equipos</span>
                                <EqipmentLocalPassModal title="Nuevo Equipo" equipos={equipos} setEquipos={setEquipos}>
                                    <button
                                    type="button"
                                    onClick={() => handleCheckboxChange("agregar-equipos")}
                                    className="px-4 py-2 rounded-md transition-all duration-300 border-2 border-blue-400 bg-transparent hover:bg-slate-100"
                                    >
                                    <div className="flex items-center gap-2">
                                        <div className="text-blue-600 sm:hidden text-xl font-bold">+</div>
                                        <Laptop className="text-blue-600" />
                                        <div className="text-blue-600 hidden sm:block">Agregar Equipos</div>
                                    </div>
                                    </button>
                                </EqipmentLocalPassModal>
                                </div>
                                <div className="mt-2 text-gray-600">
                                <Accordion type="multiple" className="w-full">
                                    {equipos.map((equipo, index) => (
                                        <AccordionItem key={index} value={`equipo-${index}`}>
                                        <AccordionTrigger>
                                            {equipo.tipo}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 text-sm">
                                            <p><strong>Tipo:</strong> {equipo.tipo}</p>
                                            <p><strong>Nombre:</strong> {equipo.nombre}</p>
                                            <p><strong>Marca:</strong> {equipo.marca}</p>
                                            <p><strong>Modelo:</strong> {equipo.modelo}</p>
                                            <p><strong>No. Serie:</strong> {equipo.serie}</p>
                                            <p><strong>Color:</strong> {equipo.color}</p>
                                            </div>
                                
                                            <div className="flex justify-end px-4 pb-4">
                                            <Button variant="destructive" size="sm" onClick={() => handleRemoveEq(index)}>
                                                Eliminar
                                            </Button>
                                            </div>
                                        </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                    {equipos.length==0?(
                                    <div>No se han agregado equipos.</div>):null}
                                </Accordion>
                                </div>
                            </div>
                        </div>
                    </div>
                        {/* <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> 
                                <div className="text-center mt-10 flex justify-center">
                                    <Button
                                        className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-1/2"
                                        variant="secondary"
                                        type="submit"
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            </form>
                        </Form>  */}
                </div>
                </>
     
                <><div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                    <FormField
                        control={form.control}
                        name="fecha_desde_visita"
                        render={({ field }:any) => (
                        <FormItem>
                            <FormLabel>
                            <span className="text-red-500">*</span> Fecha y Hora
                            de Visita:
                            </FormLabel>
                            <FormControl>
                            <Input
                                type="date"
                                {...field}
                                min={new Date().toISOString().split('T')[0]} // Corta el exceso de datos
                                onChange={(e) => {
                                field.onChange(e); // Propagar el valor a react-hook-form
                                handleFechaDesdeChange(e); // Guardar la fecha seleccionada en el estado

                                }}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />

                    <FormField
                        control={form.control}
                        name="fecha_desde_hasta"
                        render={({ field }:any) => (
                        <FormItem>
                            <FormLabel>
                            <span className="text-red-500">*</span> Fecha y Hora
                            Hasta:
                            </FormLabel>
                            <FormControl>
                            <Input
                                type="date"
                                {...field}
                                min={fechaDesde ? getNextDay(fechaDesde) : new Date().toISOString().split('T')[0]}
                                disabled={!fechaDesde}
                                onChange={(e) => {
                                field.onChange(e); 
                                }}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                </div></>
                    
                <FormField
                    control={form.control}
                    name="config_limitar_acceso"
                    render={({ field }:any) => (
                        <FormItem>
                            <FormLabel>Limitar número de accesos:</FormLabel>
                                <FormControl>
                                    <Input
                                    placeholder="Ejemplo: 5"
                                    type="number"
                                    min={0} 
                                    step={1} 
                                    {...field} 
                                    value={field.value ? Number(field.value) : 0}
                                    onChange={(e) => {
                                        const newValue = e.target.value ? Number(e.target.value) : 0;
                                        field.onChange(newValue); 
                                    }}/>  
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} 
                />

                <p className="text-gray-400">**Campos requeridos </p>
                <div className="flex gap-5">
                <DialogClose asChild>
                    <Button
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                    onClick={() => form.reset()}
                    >
                    Cancelar
                    </Button>
                </DialogClose>

                <Button
                    type="submit"
                    className="w-full  bg-blue-500 hover:bg-blue-600 text-white "
                >
                    Actualizar
                </Button>
                </div>
            </form>
            </Form>
        </DialogContent>
        </Dialog>
    );
};
	
    
  