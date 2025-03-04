/* eslint-disable react-hooks/exhaustive-deps */
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
import { useEffect, useState } from "react";
import LoadImage from "../upload-Image";
import { Imagen } from "@/lib/update-pass";
import { toast } from "sonner";
// import DateTime from "../dateTime";
import { Loader2 } from "lucide-react";
import { useCreateSeguimientoFalla } from "@/hooks/useCreateSeguimientoFalla";
import { Input } from "../ui/input";
import { inputSeguimientoFalla } from "@/lib/create-seguimiento-falla";
import LoadFile from "../upload-file";
import { formatFecha } from "@/lib/utils";
// import { format } from "date-fns";

interface AddFallaModalProps {
  	title: string;
	data: any;
	refetchTableFallas: ()=> void;
	children: React.ReactNode;
}

const formSchema = z.object({
	falla_folio_accion_correctiva: z.string().min(1, { message: "Este campo es oblicatorio" }),
	falla_comentario_solucion: z.string().optional(),
	fechaInicioFallaCompleta: z.string().min(1, { message: "Fecha de inicio es obligatoria" }), 
	fechaFinFallaCompleta: z.string().optional(),
	falla_documento_solucion: z.array(
        z.object({
          file_url: z.string(),
          file_name: z.string(),
        })
      ).optional(),
	falla_evidencia_solucion: z.array(
	  z.object({
		file_url: z.string(),
		file_name: z.string(),
	  })
	).optional(),
});

export const SeguimientoFallaModal: React.FC<AddFallaModalProps> = ({
  	title,
	data,
	refetchTableFallas,
	children
}) => {
	const [modalData, setModalData] = useState<inputSeguimientoFalla | null>(null);

	const { data:responseSeguimientoFalla, isLoading , refetch, error} = useCreateSeguimientoFalla("", modalData, data.folio ,"", data.falla_estatus)
	const [isSuccess, setIsSuccess] =useState(false)
	const [evidencia , setEvidencia] = useState<Imagen[]>([]);
	const [documento , setDocumento] = useState<Imagen[]>([]);
	// const [date, setDate] = useState<Date|"">("");
	// const [dateFin, setDateFin] = useState<Date|"">("");
	const [errorEvidencia, setErrorEvidencia] = useState("")
	const [errorDocumento, setErrorDocumento] = useState("")

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			falla_folio_accion_correctiva: "",
			falla_comentario_solucion: "",
			fechaInicioFallaCompleta: "",
			fechaFinFallaCompleta: "",
			falla_documento_solucion:documento,
			falla_evidencia_solucion:evidencia,
		},
	});

	const { reset } = form;

	useEffect(()=>{
		if(isSuccess){
			reset()
			// setDate("")
			setEvidencia([])
			setDocumento([])
		}
	},[isSuccess, reset])

	useEffect(()=>{
		console.log("QUE PASA", responseSeguimientoFalla)
		if(responseSeguimientoFalla?.status_code == 202){
			handleClose()
			refetchTableFallas()
			console.log("responseSeguimientoFalla",responseSeguimientoFalla)
			toast.success("Seguimiento actualizado correctamente!")
		}
	},[responseSeguimientoFalla])

	useEffect(()=>{
		if(error){
			toast.error(error.message)
			handleClose()
		}
		if(errorEvidencia || errorDocumento){
			toast.error("Error al cargar imagenes o documentos")
			handleClose()
		}
	},[error, errorEvidencia , errorDocumento])


	useEffect(()=>{
		if(modalData){
			refetch()
		}
	},[modalData])

	// useEffect(()=>{
	// 	if(form.formState.errors){
	// 		console.log("	ERRORESS DEL FORMULARIO   ", form.formState.errors)
	// 	}
	// },[form.formState.errors])

	function onSubmit(values: z.infer<typeof formSchema>) {
		// const formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
		// const formattedDateFin = format( new Date(dateFin), 'yyyy-MM-dd HH:mm:ss');
        const formatData ={
            falla_folio_accion_correctiva:values.falla_folio_accion_correctiva||"",
            falla_comentario_solucion: values.falla_comentario_solucion||"",
            fechaInicioFallaCompleta: formatFecha(values.fechaInicioFallaCompleta)+":00",
            fechaFinFallaCompleta:formatFecha(values.fechaFinFallaCompleta)+":00",
            falla_documento_solucion:documento,
            falla_evidencia_solucion:evidencia,
            }
            setModalData(formatData);
	}

	const handleClose = () => {
		setIsSuccess(false); 
	};


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
          <form onSubmit={form.handleSubmit(onSubmit)} >
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
				<FormField
				control={form.control}
				name="falla_folio_accion_correctiva"
				render={({ field }:any) => (
					<FormItem>
					<FormLabel>Acción realizada:</FormLabel>
					<FormControl>
						<Input placeholder="Acción realizada..." {...field} 
						onChange={(e) => {
							field.onChange(e); // Actualiza el valor en react-hook-form
							// handleSelectChange("placas", e.target.value); // Acción adicional
						}}
						value={field.value || ""}
						/>
					</FormControl>
					<FormMessage />
					</FormItem>
				)}
				/>
				<FormField
				control={form.control}
				name="falla_comentario_solucion"
				render={({ field }:any) => (
					<FormItem>
					<FormLabel>Comentario:</FormLabel>
					<FormControl>
						<Input placeholder="Comentario..." {...field} 
						onChange={(e) => {
							field.onChange(e); // Actualiza el valor en react-hook-form
							// handleSelectChange("placas", e.target.value); // Acción adicional
						}}
						value={field.value || ""}
						/>
					</FormControl>
					<FormMessage />
					</FormItem>
				)}
				/>
				<FormField
				control={form.control}
				name="fechaInicioFallaCompleta"
				render={({ field }:any) => (
					<FormItem>
					<FormLabel>* Fecha</FormLabel>
					<FormControl>
						<Input type="datetime-local" placeholder="Fecha" {...field} />
						{/* <DateTime date={date} setDate={setDate} /> */}
					</FormControl>

					<FormMessage />
					</FormItem>
				)}
				/>
				<FormField
				control={form.control}
				name="fechaFinFallaCompleta"
				render={({ field }:any) => (
					<FormItem>
					<FormLabel>* Fecha</FormLabel>
					<FormControl>
						<Input type="datetime-local" placeholder="Fecha" {...field} />
						{/* <DateTime date={dateFin} setDate={setDateFin}/> */}
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
						/>
				</div>

				<div className="flex justify-between">
					<LoadFile
						id="documento" 
						titulo={"Documento"} 
						setDocs={setDocumento}
						showWebcamOption={true}
						setErrorImagen={setErrorDocumento}
						facingMode="user"
						docArray={documento}
						/>
				</div>
			</div>

			<div className="flex gap-2">
				<DialogClose asChild>
					<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
					Cancelar
					</Button>
				</DialogClose>

				
				<Button
					type="submit"
					className="w-full  bg-blue-500 hover:bg-blue-600 text-white " disabled={isLoading}
				>
					{ !isLoading ? (<>
					{("Actualizar seguimiento")}
					</>) :(<> <Loader2 className="animate-spin"/> {"Actualizando seguimiento..."} </>)}
				</Button>
			</div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
