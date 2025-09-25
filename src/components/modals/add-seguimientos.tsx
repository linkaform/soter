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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Imagen } from "@/lib/update-pass";
import { calcularTiempoDesdeIncidencia, convertirDateToISO, formatDateToString } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { Textarea } from "../ui/textarea";
import DateTime from "../dateTime";
import { Input } from "../ui/input";
import LoadImage from "../upload-Image";
import LoadFile from "../upload-file";
import { toast } from "sonner";
import { useSeguimientoIncidencia } from "@/hooks/Incidencias/useSeguimientoIncidencia";
import { Loader2 } from "lucide-react";

interface IncidenciaModalProps {
	title: string;
	children: React.ReactNode;
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
    setSeguimientos: Dispatch<SetStateAction<any[]>>;
    indice:number| null;
    editarSeguimiento:boolean;
    setEditarSeguimiento: Dispatch<SetStateAction<any>>;
    seguimientoSeleccionado:any;
	dateIncidencia:string;
	enviarSeguimiento?:boolean;
	folioIncidencia:string;
	estatusIncidencia:string;
}

const formSchema = z.object({
	accion_correctiva_incidencia: z.string().min(1, { message: "Este campo es oblicatorio" }),
	incidencia_personas_involucradas: z.string().optional(),
	fecha_inicio_seg: z.string().optional(),
	// fechaFinIncidenciaCompleta: z.string().optional(),
	incidencia_documento_solucion: z.array(
		z.object({
			file_url: z.string(),
			file_name: z.string(),
		})
	).optional(),
	incidencia_evidencia_solucion: z.array(
		z.object({
			file_url: z.string(),
			file_name: z.string(),
		})
	).optional(),
	tiempo_transcurrido: z.string().optional(),
	estatus:z.string().optional()
});

export const SeguimientoIncidenciaLista: React.FC<IncidenciaModalProps> = ({
	title,
	children,
	isSuccess,
	setIsSuccess,
    setSeguimientos,
    indice,
    editarSeguimiento,
    setEditarSeguimiento,
    seguimientoSeleccionado,
	dateIncidencia,
	enviarSeguimiento = false,
	folioIncidencia,
	estatusIncidencia
}) => {
	// const [isSuccess, setIsSuccess] = useState(false)
	const [evidencia, setEvidencia] = useState<Imagen[]>([]);
	const [documento, setDocumento] = useState<Imagen[]>([]);
	const [date, setDate] = useState<Date | "">("");
	const { isLoading} = useShiftStore();
	const seguimientoIncidenciaMutation = useSeguimientoIncidencia()

	console.log("estatusIncidencia",estatusIncidencia)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			accion_correctiva_incidencia: "",
			incidencia_personas_involucradas: "",
			fecha_inicio_seg: "",
			incidencia_documento_solucion: [],
			incidencia_evidencia_solucion: [],
			tiempo_transcurrido:"",
			estatus:estatusIncidencia
		},
	});

	const { reset } = form;


	useEffect(() => {
        if (isSuccess){
            reset({
                accion_correctiva_incidencia: "",
                incidencia_personas_involucradas:  "",
				tiempo_transcurrido:"",
				estatus:estatusIncidencia
              });
			setDate(new Date())
			setEvidencia([])
			setDocumento([])
        }

		if (editarSeguimiento && seguimientoSeleccionado) {
			reset({
                accion_correctiva_incidencia: seguimientoSeleccionado.accion_correctiva_incidencia || "",
                incidencia_personas_involucradas: seguimientoSeleccionado.incidencia_personas_involucradas || "",
              });
            setEvidencia(seguimientoSeleccionado.incidencia_evidencia_solucion)
            setDocumento(seguimientoSeleccionado.incidencia_documento_solucion)
            setDate(new Date(seguimientoSeleccionado.fecha_inicio_seg))
		}
	}, [isSuccess, reset])

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (date) {
            if(editarSeguimiento){
				const fecha2 = convertirDateToISO(date)
				const formatData = {
					accion_correctiva_incidencia: values.accion_correctiva_incidencia || "",
					incidencia_personas_involucradas: values.incidencia_personas_involucradas || "",
					fecha_inicio_seg: date ? formatDateToString(date) : "",
					incidencia_documento_solucion: documento,
					incidencia_evidencia_solucion: evidencia,
					tiempo_transcurrido: calcularTiempoDesdeIncidencia( dateIncidencia, fecha2)
				}

                setEditarSeguimiento(false)
                setSeguimientos((prev: any[]) =>
                    prev.map((item, i) => (i === indice ? formatData : item))
                  );
                toast.success("Seguimiento editado correctamente.")
				handleClose()
            }else{
				const fecha2 = convertirDateToISO(date)
				const formatData = {
					accion_correctiva_incidencia: values.accion_correctiva_incidencia || "",
					incidencia_personas_involucradas: values.incidencia_personas_involucradas || "",
					fecha_inicio_seg: date ? formatDateToString(date) : "",
					incidencia_documento_solucion: documento,
					incidencia_evidencia_solucion: evidencia,
					tiempo_transcurrido: calcularTiempoDesdeIncidencia(dateIncidencia, fecha2)
				}

				if(enviarSeguimiento){
					seguimientoIncidenciaMutation.mutate({ seguimientos_incidencia: formatData, folio: folioIncidencia, estatus: values.estatus ? values.estatus : estatusIncidencia },
						{
							onSuccess: () => {
								handleClose()
							},
							onError: (error) => {
							  console.error("❌ Error en la mutación:", error);
							//   handleClose()
							}
						  }
					);
				}else{
					setSeguimientos((prev: any) => [...prev, formatData]);
					handleClose()
				}
            }
            // setIsSuccess(false)
		} else {
			form.setError("fecha_inicio_seg", { type: "manual", message: "Fecha es un campo requerido." });
		}
	}

	const handleClose = () => {
		setIsSuccess(false);
        setEditarSeguimiento(false);
	};

    useEffect(() => {
        if(form.formState.errors){
            console.log("Errores:", form.formState.errors)
        }
    }, [form.formState.errors])

	return (
		<Dialog onOpenChange={setIsSuccess} open={isSuccess}>
			<DialogTrigger>{children}</DialogTrigger>

			<DialogContent className="max-w-xl overflow-y-auto max-h-[80vh] min-h-auto  flex flex-col overflow-hidden" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
				<DialogHeader>
					<DialogTitle className="text-2xl text-center font-bold">
						{title}
					</DialogTitle>
				</DialogHeader>
				<div className="flex-grow overflow-y-auto px-2">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} >
						<div className="grid grid-cols-1 gap-5 mb-6">
						{enviarSeguimiento && (
							<FormField
								control={form.control}
								name="estatus"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Estatus de la incidencia: *</FormLabel>
										<FormControl>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => field.onChange("Abierto")}
													className={`px-6 py-2 rounded ${
														(field.value ?? estatusIncidencia) === "Abierto"
															? "bg-blue-600 text-white"
															: "bg-white text-blue-600 border border-blue-500"
													}`}
												>
													Abierto
												</button>
												<button
													type="button"
													onClick={() => field.onChange("Cerrado")}
													className={`px-6 py-2 rounded ${
														(field.value ?? estatusIncidencia) === "Cerrado"
															? "bg-blue-600 text-white"
															: "bg-white text-blue-600 border border-blue-500"
													}`}
												>
													Cerrado
												</button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

							<FormField
									control={form.control}
									name="fecha_inicio_seg"
									render={() => (
										<FormItem>
											<FormLabel>* Fecha y hora de la accion: *
                                            </FormLabel>
											<FormControl>
												{/* <Input type="datetime-local" placeholder="Fecha"  /> */}
												<DateTime date={date} setDate={setDate} disablePastDates={false}/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
							<FormField
								control={form.control}
								name="accion_correctiva_incidencia"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>Acción realizada: *</FormLabel>
										<FormControl>
											<Textarea placeholder="Acción realizada..." {...field}
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
									name="incidencia_personas_involucradas"
									render={({ field }: any) => (
										<FormItem>
											<FormLabel>Personas Involucradas:</FormLabel>
											<FormControl>
												<Input placeholder="Personas involucradas" {...field}
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
									showTakePhoto={true}
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
						// type="submit"
						onClick={form.handleSubmit(onSubmit)} 
						className="w-full  bg-blue-500 hover:bg-blue-600 text-white " disabled={isLoading}
					>
						{editarSeguimiento? ("Editar"):( !isLoading ? ("Agregar"):
						(<> <Loader2 className="animate-spin"/> {"Creando seguimiento..."} </>)  )}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
