//eslint-disable react-hooks/exhaustive-deps
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
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import LoadImage from "../upload-Image";
import { Imagen } from "@/lib/update-pass";
import { useCatalogoAreaEmpleado } from "@/hooks/useCatalogoAreaEmpleado";
import { format } from 'date-fns';

import { useCatalogoAreaEmpleadoApoyo } from "@/hooks/useCatalogoAreaEmpleadoApoyo";
import { toast } from "sonner";
import { useCatalogoFallas } from "@/hooks/useCatalogoFallas";
import { inputFalla } from "@/lib/create-falla";
import DateTime from "../dateTime";
import LoadFile from "../upload-file";
import { useUpdateFalla } from "@/hooks/useUpdateFalla";

interface EditarFallaModalProps {
  title: string;
	data: any;
	refetchTableFallas: ()=> void;
    children: React.ReactNode;
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
	refetchTableFallas,
    children
}) => {
	const [modalData, setModalData] = useState<inputFalla | null>(null);
	const [ubicaciones] = useState<any| string[]>(["Planta Monterrey"]);
	const [subconcepto, setSubConcepto] = useState<string>("");
	const [catalagoSub, setCatalogoSub] = useState<string[]>([]);
	const [catalagoFallas, setFallas] = useState<string[]>([]);

	//AGREGAR CATALOGO DE UBICACION YA SEA DESDE CACHE O HACER LA PETICION
	const { data:dataAreaEmpleado, isLoading:loadingAreaEmpleado, refetch: refetchAreaEmpleado, error:errorAreEmpleado } = useCatalogoAreaEmpleado();
	const { data:dataAreaEmpleadoApoyo, isLoading:loadingAreaEmpleadoApoyo, refetch: refetchAreaEmpleadoApoyo, error:errorAEA} = useCatalogoAreaEmpleadoApoyo();
	const { data:dataFallas, isLoading:isLoadingFallas, refetch: refetchFallas, error:errorFallas } = useCatalogoFallas(subconcepto);
	const { data:responseUpdateFalla, isLoading , refetch, error} = useUpdateFalla(modalData, data.folio)

	const [areas] = useState<any| string[]>(["Caseta Principal"]);
	const [evidencia , setEvidencia] = useState<Imagen[]>(data.falla_evidencia);
	const [documento , setDocumento] = useState<Imagen[]>(data.falla_documento);
	const [date, setDate] = useState<Date|"">(new Date(data.falla_fecha_hora));

	const [errorEvidencia, setErrorEvidencia] = useState("")
	const [errorDocumento, setErrorDocumento] = useState("")

	const [isSuccess, setIsSuccess] =useState(false)
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
		falla_ubicacion: data.falla_ubicacion,
		},
	});

	const { reset } = form;

	useEffect(()=>{
		if(isSuccess){
			reset()
			refetchAreaEmpleado()
			refetchAreaEmpleadoApoyo()
			refetchFallas()
		}
	},[isSuccess])

	useEffect(()=>{
		if(responseUpdateFalla?.status_code == 202){
			handleClose()
			toast.success("Falla actualizada correctamente!")
			refetchTableFallas()
		}
	},[responseUpdateFalla])

	useEffect(()=>{
		if(errorAEA){
			toast.error(errorAEA.message)
		}
		if(errorAreEmpleado){
			toast.error(errorAreEmpleado.message)
		}
		if(errorFallas){
			toast.error(errorFallas.message)
		}
		if(error){
			toast.error(error.message)
			handleClose()
		}
		if(errorEvidencia || errorDocumento){
			toast.error("Error al cargar imagenes o documentos")
			handleClose()
		}
	},[errorAEA, errorAreEmpleado, errorFallas, error, errorEvidencia , errorDocumento])

	useEffect(()=>{
		if(subconcepto){
			console.log("QUE PASA",subconcepto)
			refetchFallas()
		}
	},[subconcepto])

	useEffect(()=>{
		if(dataFallas && subconcepto){
			if (dataFallas.length === 1 && dataFallas[0] === null) {
				setCatalogoSub([])
			  }else{
				setCatalogoSub(dataFallas)
			  }
		}
		if(dataFallas && !subconcepto){
			setFallas(dataFallas)
			setSubConcepto(data.falla_objeto_afectado)

		}
	},[dataFallas])

	useEffect(()=>{
		if(modalData){
			refetch()
		}
	},[modalData])

	useEffect(()=>{
		if(form.formState.errors){
			console.log("	ERRORESS DEL FORMULARIO   ", form.formState.errors)
		}
	},[form.formState.errors])

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
				console.log("DATA LISTA PARA ENVIAR",formatData)
				 setModalData(formatData);
		}else{
			form.setError("falla_fecha_hora", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	useEffect(()=>{
		if(modalData){
			console.log(data)
		}
	},[modalData])

	const handleClose = () => {
		setIsSuccess(false); 
	};

	useEffect(()=>{
		if(isLoadingFallas){
			console.log("CARGANDOOOOOO",isLoadingFallas, subconcepto)
		}
	},[isLoadingFallas])

  return (
    <Dialog onOpenChange={setIsSuccess} open={isSuccess}>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="max-w-3xl" aria-describedby="">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <FormField
				control={form.control}
				name="falla_ubicacion"
				render={({ field }:any) => (
					<FormItem>
						<FormLabel>Ubicacion:</FormLabel>
						<FormControl>
						<Select {...field} className="input"
							onValueChange={(value:string) => {
							field.onChange(value); 
						}}
						value={field.value} 
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Selecciona una ubicacion" />
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
				name="falla_caseta"
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
							<SelectValue placeholder="Selecciona una ubicacion" />
						</SelectTrigger>
						<SelectContent>
						{areas?.map((vehiculo:string, index:number) => (
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
              name="falla_fecha_hora"
              render={() => (
                <FormItem>
                  <FormLabel>* Fecha</FormLabel>
                  <FormControl>
					<DateTime date={date} setDate={setDate} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

			<FormField
				control={form.control}
				name="falla"
				render={({ field }:any) => (
					<FormItem>
						<FormLabel>Concepto:</FormLabel>
						<FormControl>
						<Select {...field} className="input"
							onValueChange={(value:string) => {
							field.onChange(value); 
							setCatalogoSub([])
							setSubConcepto(value)
						}}
						value={field.value} 
					>
						<SelectTrigger className="w-full">
							{isLoadingFallas && subconcepto == "" ? (
								<SelectValue placeholder="Cargando fallas..." />
							):
							(
								<SelectValue placeholder="Selecciona una falla" />
							)}
						</SelectTrigger>
						<SelectContent>
						{catalagoFallas?.map((vehiculo:string, index:number) => (
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
				name="falla_objeto_afectado"
				render={({ field }:any) => (
					<FormItem>
						<FormLabel>Subconcepto:</FormLabel>
						<FormControl>
						<Select {...field} className="input"
							onValueChange={(value:string) => {
							field.onChange(value); 
						}}
						value={field.value} 
					>
						<SelectTrigger className="w-full">
							{isLoadingFallas && subconcepto ? (
								<SelectValue placeholder="Cargando subconcepto..." />
							):null}
							{catalagoSub.length > 0 ?(<SelectValue placeholder="Selecciona una opción..." />)
							:(<SelectValue placeholder="Selecciona una falla para ver las opciones..." />)
							}
						</SelectTrigger>
						<SelectContent>
						{catalagoSub.length>0 ? (
							catalagoSub?.map((item:string, index:number) => {
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
              name="falla_comentarios"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>* Comentarios</FormLabel>
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
			<FormField
				control={form.control}
				name="falla_reporta_nombre"
				render={({ field }:any) => (
					<FormItem>
						<FormLabel>Reporta:</FormLabel>
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


			<FormField
				control={form.control}
				name="falla_responsable_solucionar_nombre"
				render={({ field }:any) => (
					<FormItem>
						<FormLabel>Responsable asignado de solucionar:</FormLabel>
						<FormControl>
						<Select {...field} className="input"
							onValueChange={(value:string) => {
							field.onChange(value); 
						}}
						value={field.value} 
					>
						<SelectTrigger className="w-full">
							{loadingAreaEmpleadoApoyo?(<>
								<SelectValue placeholder="Cargando opciones..." />
							</>):(<>
								<SelectValue placeholder="Selecciona una opcion" />
							</>)}
						</SelectTrigger>
						<SelectContent>
						{dataAreaEmpleadoApoyo?.map((vehiculo:string, index:number) => (
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

            <div className="flex justify-between">
				<LoadImage
					id="evidencia" 
					titulo={"Evidencia"} 
					setImg={setEvidencia}
					showWebcamOption={true}
					setErrorImagen={setErrorEvidencia}
					facingMode="user"
					//imgArray={evidencia}
					//showArray={true}
					/>
            </div>

            <div className="flex justify-between">
				<LoadFile
					id="doc" 
					titulo={"Documento"} 
					setDocs={setDocumento}
					showWebcamOption={true}
					setErrorImagen={setErrorDocumento}
					facingMode="user"
					docArray={documento}
					// showArray={true}
					/>
            </div>

			<DialogClose asChild>
				<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
				Cancelar
				</Button>
			</DialogClose>

			
			<Button
				type="submit"
				className="w-full  bg-blue-500 hover:bg-blue-600 text-white " disabled={isLoading}
			>
				{isLoading? ("Editando falla..."):("Editar falla")}
			</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
