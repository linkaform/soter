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
import { formatFecha } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { Textarea } from "../ui/textarea";
import DateTime from "../dateTime";
import { Input } from "../ui/input";
import LoadImage from "../upload-Image";
import LoadFile from "../upload-file";
import { toast } from "sonner";

interface IncidenciaModalProps {
	title: string;
	children: React.ReactNode;
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
    setSeguimientos: Dispatch<SetStateAction<any>>;
    indice:number| null;
    editarSeguimiento:boolean;
    setEditarSeguimiento: Dispatch<SetStateAction<any>>;
    seguimientoSeleccionado:any;
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
    seguimientoSeleccionado
}) => {
	// const [isSuccess, setIsSuccess] = useState(false)
	const [evidencia, setEvidencia] = useState<Imagen[]>([]);
	const [documento, setDocumento] = useState<Imagen[]>([]);
	const [date, setDate] = useState<Date | "">("");
	const { isLoading} = useShiftStore();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			accion_correctiva_incidencia: "",
			incidencia_personas_involucradas: "",
			fecha_inicio_seg: "",
			incidencia_documento_solucion: [],
			incidencia_evidencia_solucion: [],
		},
	});

	const { reset } = form;


	useEffect(() => {
        if (isSuccess){
            reset({
                accion_correctiva_incidencia: "",
                incidencia_personas_involucradas:  "",
              });
			setDate("")
			setEvidencia([])
			setDocumento([])
        }
        console.log("seg",editarSeguimiento)

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
			const formatData = {
				accion_correctiva_incidencia: values.accion_correctiva_incidencia || "",
				incidencia_personas_involucradas: values.incidencia_personas_involucradas || "",
				fecha_inicio_seg: values.fecha_inicio_seg ? formatFecha(values.fecha_inicio_seg) + `:00` : "2024-03-24 11:04:00",
				incidencia_documento_solucion: documento,
				incidencia_evidencia_solucion: evidencia
			}
            if(editarSeguimiento){
                setEditarSeguimiento(false)
                setSeguimientos((prev: any[]) =>
                    prev.map((item, i) => (i === indice ? formatData : item))
                  );
                toast.success("Seguimiento editado correctamente.")
            }else{
                setSeguimientos((prev: any) => [...prev, formatData]);
                toast.success("Seguimiento agregado correctamente.")
            }
            setIsSuccess(false)
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

			<DialogContent className="max-w-lg" aria-describedby="">
				<DialogHeader>
					<DialogTitle className="text-2xl text-center font-bold">
						{title}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} >
						<div className="grid grid-cols-1 gap-5 mb-6">
							<FormField
									control={form.control}
									name="fecha_inicio_seg"
									render={() => (
										<FormItem>
											<FormLabel>* Fecha y hora de la accion: *
                                            </FormLabel>
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
							    {editarSeguimiento? ("Editar"):(("Agregar"))}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
