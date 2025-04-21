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
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import LoadFile from "../upload-file";
import { format } from "date-fns";
import DateTime from "../dateTime";
import { formatFecha } from "@/lib/utils";
import { useFallas } from "@/hooks/useFallas";
import { useShiftStore } from "@/store/useShiftStore";

interface AddFallaModalProps {
  	title: string;
	data: any;
	children: React.ReactNode;
}

const formSchema = z.object({
	falla_folio_accion_correctiva: z.string().min(1, { message: "Este campo es oblicatorio" }),
	falla_comentario_solucion: z.string().optional(),
	fechaInicioFallaCompleta: z.string().optional(), 
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
	children
}) => {
	const { area, location } = useShiftStore();
	const [isSuccess, setIsSuccess] =useState(false)
	const [evidencia , setEvidencia] = useState<Imagen[]>([]);
	const [documento , setDocumento] = useState<Imagen[]>([]);
	const [date, setDate] = useState<Date|"">("");
	const [dateFin, setDateFin] = useState<Date|"">("");
	const { seguimientoFallaMutation, isLoading} = useFallas("","", "abierto", false, "", "", "")


	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			falla_folio_accion_correctiva: "",
			falla_comentario_solucion: "",
			fechaInicioFallaCompleta: date !=="" ? format( new Date(date), 'yyyy-MM-dd HH:mm:ss'):"",
			fechaFinFallaCompleta: dateFin !==""  ? format( new Date(dateFin), 'yyyy-MM-dd HH:mm:ss'):"",
			falla_documento_solucion:documento,
			falla_evidencia_solucion:evidencia,
		},
	});

	const { reset } = form;

	useEffect(()=>{
		if(isSuccess){
			reset()
			setDate("")
			setDateFin("")
			setEvidencia([])
			setDocumento([])
		}
	},[isSuccess, reset])

	// useEffect(()=>{
	// 	if(responseSeguimientoFalla?.status_code == 202){
	// 		handleClose()
	// 		refetchTableFallas()
	// 		toast.success("Seguimiento actualizado correctamente!")
	// 	}
	// },[responseSeguimientoFalla])


	useEffect(()=>{
		if(!isLoading){
			handleClose()			
		}
	},[isLoading])

	// useEffect(()=>{
	// 	if(modalData){
			
	// 	}
	// },[modalData])

	function onSubmit(values: z.infer<typeof formSchema>) {
		if(date){
			const formattedDate = format( new Date(date), 'yyyy-MM-dd HH:mm:ss');
			const formattedDateFin = format( new Date(dateFin), 'yyyy-MM-dd HH:mm:ss');
			console.log("FORMATED", formattedDate, formattedDateFin)
		console.log("QUE PASA",values.fechaInicioFallaCompleta)
			const formatData ={
				falla_folio_accion_correctiva:values.falla_folio_accion_correctiva||"",
				falla_comentario_solucion: values.falla_comentario_solucion||"",
				fechaInicioFallaCompleta:values.fechaInicioFallaCompleta? formatFecha(values.fechaInicioFallaCompleta)+`:00`:"2024-03-24 11:04:00",// values.fechaInicioFallaCompleta,//date?format( new Date(date), 'yyyy-MM-dd HH:mm:ss'):"", // formattedDate, //formatFecha(values.fechaInicioFallaCompleta)+":00",
				fechaFinFallaCompleta:values.fechaFinFallaCompleta? formatFecha(values.fechaFinFallaCompleta)+`:00`:"2024-03-12 09:04:00",// values.fechaFinFallaCompleta,//dateFin?format( new Date(dateFin), 'yyyy-MM-dd HH:mm:ss'):"",//formattedDateFin,//formatFecha(values.fechaFinFallaCompleta)+":00",
				falla_documento_solucion:documento,
				falla_evidencia_solucion:evidencia,
			}
			seguimientoFallaMutation.mutate({falla_grupo_seguimiento:formatData, folio:data.folio, location,area , status:"abierto"})
		}else{
			form.setError("fechaInicioFallaCompleta", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleClose = () => {
		setIsSuccess(false); 
	};

	useEffect(()=>{
		if(!isLoading){
			handleClose()			
		}
	},[isLoading])

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
				render={() => (
					<FormItem>
					<FormLabel>* Fecha</FormLabel>
					<FormControl>
						{/* <Input type="datetime-local" placeholder="Fecha"  /> */}
						<DateTime date={date} setDate={setDate} />
					</FormControl>

					<FormMessage />
					</FormItem>
				)}
				/>
				<FormField
				control={form.control}
				name="fechaFinFallaCompleta"
				render={() => (
					<FormItem>
					<FormLabel>* Fecha</FormLabel>
					<FormControl>
						{/* <Input type="datetime-local" placeholder="Fecha" /> */}
						<DateTime date={dateFin} setDate={setDateFin}/>
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
						docArray={documento}
						limit={10}
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
