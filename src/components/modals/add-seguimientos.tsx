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
import LoadImage from "../upload-Image";
import { Imagen } from "@/lib/update-pass";
import { Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import LoadFile from "../upload-file";
import { format } from "date-fns";
import DateTime from "../dateTime";
import { formatFecha } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";

interface IncidenciaModalProps {
	title: string;
	children: React.ReactNode;
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
    setSeguimientos: Dispatch<SetStateAction<any>>;
}

const formSchema = z.object({
	incidencia_folio_accion_correctiva: z.string().min(1, { message: "Este campo es oblicatorio" }),
	incidencia_comentario_solucion: z.string().optional(),
	fechaInicioIncidenciaCompleta: z.string().optional(),
	fechaFinIncidenciaCompleta: z.string().optional(),
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
    setSeguimientos
}) => {
	// const [isSuccess, setIsSuccess] = useState(false)
	const [evidencia, setEvidencia] = useState<Imagen[]>([]);
	const [documento, setDocumento] = useState<Imagen[]>([]);
	const [date, setDate] = useState<Date | "">("");
	const [dateFin, setDateFin] = useState<Date | "">("");
	const { isLoading} = useShiftStore();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			incidencia_folio_accion_correctiva: "",
			incidencia_comentario_solucion: "",
			fechaInicioIncidenciaCompleta: date !== "" ? format(new Date(date), 'yyyy-MM-dd HH:mm:ss') : "",
			fechaFinIncidenciaCompleta: dateFin !== "" ? format(new Date(dateFin), 'yyyy-MM-dd HH:mm:ss') : "",
			incidencia_documento_solucion: documento,
			incidencia_evidencia_solucion: evidencia,
		},
	});

	const { reset } = form;

	useEffect(() => {
		if (isSuccess) {
			reset()
			setDate("")
			setDateFin("")
			setEvidencia([])
			setDocumento([])
		}
	}, [isSuccess, reset])

	function onSubmit(values: z.infer<typeof formSchema>) {
		if (date) {
			const formatData = {
				incidencia_folio_accion_correctiva: values.incidencia_folio_accion_correctiva || "",
				incidencia_comentario_solucion: values.incidencia_comentario_solucion || "",
				fechaInicioIncidenciaCompleta: values.fechaInicioIncidenciaCompleta ? formatFecha(values.fechaInicioIncidenciaCompleta) + `:00` : "2024-03-24 11:04:00",
				fechaFinIncidenciaCompleta: values.fechaFinIncidenciaCompleta ? formatFecha(values.fechaFinIncidenciaCompleta) + `:00` : "2024-03-12 09:04:00",
				incidencia_documento_solucion: documento,
				incidencia_evidencia_solucion: evidencia
			}
            console.log("format data", formatData)
            setSeguimientos(formatData)
			// seguimientoIncidenciaMutation.mutate({ incidencia_grupo_seguimiento: formatData });
		} else {
			form.setError("fechaInicioIncidenciaCompleta", { type: "manual", message: "Fecha es un campo requerido." });
		}
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
						<div className="w-full flex gap-2 mb-2">
							<p className="font-bold ">Folio: </p>
							<p  className="font-bold text-blue-500"> </p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
							<FormField
									control={form.control}
									name="fechaInicioIncidenciaCompleta"
									render={() => (
										<FormItem>
											<FormLabel>* Fecha del seguimiento:</FormLabel>
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
								name="incidencia_folio_accion_correctiva"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>Acción realizada: *</FormLabel>
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
							
							<div className="mt-5">
								<FormField
									control={form.control}
									name="incidencia_comentario_solucion"
									render={({ field }: any) => (
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
							</div>
							
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
								{!isLoading ? (<>
									{("Agregar")}
								</>) : (<> <Loader2 className="animate-spin" /> {"Agregando seguimiento..."} </>)}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
