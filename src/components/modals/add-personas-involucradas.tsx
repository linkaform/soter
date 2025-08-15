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
import { Dispatch, SetStateAction, useEffect } from "react";
import { useShiftStore } from "@/store/useShiftStore";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface IncidenciaModalProps {
	title: string;
	children: React.ReactNode;
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
    setPersonasInvolucradas: Dispatch<SetStateAction<any>>;
    indice:number| null;
    editarPersonasInvolucradas:boolean;
    setEditarPersonasInvolucradas: Dispatch<SetStateAction<any>>;
    personasInvolucradasSeleccion:any;
    setPersonasInvolucradasSeleccion:Dispatch<SetStateAction<any>>;
}

const formSchema = z.object({
	nombre_completo: z.string().min(1, { message: "Este campo es oblicatorio" }),
	rol: z.string().min(1, { message: "Este campo es oblicatorio" }),
	sexo: z.string().min(1, { message: "Este campo es oblicatorio" }),
	grupo_etario: z.string().min(1, { message: "Este campo es oblicatorio" }),
	atencion_medica: z.string().min(1, { message: "Este campo es oblicatorio" }),
    retenido: z.string().min(1, { message: "Este campo es oblicatorio" }),
    comentarios: z.string().min(1, { message: "Este campo es oblicatorio" }),
});

export const PersonasInvolucradasModal: React.FC<IncidenciaModalProps> = ({
	title,
	children,
	isSuccess,
	setIsSuccess,
    setPersonasInvolucradas,
    indice,
    editarPersonasInvolucradas,
    setEditarPersonasInvolucradas,
    personasInvolucradasSeleccion,
    setPersonasInvolucradasSeleccion
}) => {
	const { isLoading} = useShiftStore();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre_completo: personasInvolucradasSeleccion.nombre_completo,
			rol: personasInvolucradasSeleccion.rol,
			sexo: personasInvolucradasSeleccion.sexo,
			grupo_etario: personasInvolucradasSeleccion.grupo_etario,
            atencion_medica: personasInvolucradasSeleccion.atencion_medica,
			retenido: personasInvolucradasSeleccion.retenido,
            comentarios: personasInvolucradasSeleccion.comentarios,
		},
	});


	function onSubmit(values: z.infer<typeof formSchema>) {
        const formatData = {
            nombre_completo: values.nombre_completo,
            rol: values.rol,
            sexo: values.sexo,
            grupo_etario: values.grupo_etario,
            atencion_medica: values.atencion_medica,
            retenido: values.retenido,
            comentarios: values.comentarios,
        }
        if(editarPersonasInvolucradas){
            setEditarPersonasInvolucradas(false)
            setPersonasInvolucradas((prev: any[]) =>
                prev.map((item, i) => (i === indice ? formatData : item))
                );
            toast.success("Seguimiento editado correctamente.")
        }else{
            setPersonasInvolucradas((prev: any) => [...prev, formatData]);
            toast.success("Seguimiento agregado correctamente.")
        }
        setIsSuccess(false)
	}

	const handleClose = () => {
		setIsSuccess(false);
        setEditarPersonasInvolucradas(false);
        setPersonasInvolucradasSeleccion({})
	};

    useEffect(() => {
        if(form.formState.errors){
            console.log("Errores:", form.formState.errors)
        }
    }, [form.formState.errors])

    const { reset } = form;


	useEffect(() => {
        if (isSuccess){
            reset({
                nombre_completo: "",
                rol: "",
                sexo: "",
                grupo_etario: "",
                atencion_medica: "",
                retenido: "",
                comentarios: "",
              });
        }

		if (editarPersonasInvolucradas && personasInvolucradasSeleccion) {
			reset({
                nombre_completo: personasInvolucradasSeleccion.nombre_completo,
                rol: personasInvolucradasSeleccion.rol,
                sexo: personasInvolucradasSeleccion.sexo,
                grupo_etario: personasInvolucradasSeleccion.grupo_etario,
                atencion_medica: personasInvolucradasSeleccion.atencion_medica,
                retenido: personasInvolucradasSeleccion.retenido,
                comentarios: personasInvolucradasSeleccion.comentarios,
              });
		}
	}, [isSuccess, reset])

	return (
		<Dialog onOpenChange={setIsSuccess} open={isSuccess}>
			<DialogTrigger>{children}</DialogTrigger>

			<DialogContent className="max-w-lg overflow-y-auto max-h-[80vh] min-h-[80vh]  flex flex-col overflow-hidden"  aria-describedby="">
				<DialogHeader>
					<DialogTitle className="text-2xl text-center font-bold">
						{title}
					</DialogTitle>
				</DialogHeader>
				<div className="flex-grow overflow-y-auto">
				<Form {...form}  >
						<form onSubmit={form.handleSubmit(onSubmit)} >
							<div className="grid grid-cols-1 gap-5 mb-6 px-3">
									<FormField
										control={form.control}
										name="nombre_completo"
										render={({ field }: any) => (
											<FormItem>
												<FormLabel>Nombre completo:</FormLabel>
												<FormControl>
													<Input placeholder="Nombre completo..." {...field}
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
										name="rol"
										render={({ field }: any) => (
											<FormItem>
												<FormLabel>Rol en el incidente:</FormLabel>
												<FormControl>
													<Select {...field} className="input"t
														onValueChange={(value:string) => {
														field.onChange(value); 
														}}
														value={field.value}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Selecciona una opcion" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem key={"Testigo"} value={"Testigo"}>Testigo</SelectItem>
															<SelectItem key={"Afectado"} value={"Afectado"}>Afectado</SelectItem>
															<SelectItem key={"Agresor"} value={"Agresor"}>Agresor</SelectItem>
															<SelectItem key={"Sospechoso"} value={"Sospechoso"}>Sospechoso</SelectItem>
															<SelectItem key={"Responsable"} value={"Responsable"}>Responsable</SelectItem>
															<SelectItem key={"Otro"} value={"Otro"}>Otro</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sexo"
										render={({ field }: any) => (
											<FormItem>
												<FormLabel>Sexo:</FormLabel>
												<FormControl>
												<Select {...field} className="input"t
													onValueChange={(value:string) => {
													field.onChange(value); 
													}}
													value={field.value}
												>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Selecciona una opcion" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem key={"Masculino"} value={"Masculino"}>Masculino</SelectItem>
														<SelectItem key={"Femenino"} value={"Femenino"}>Femenino</SelectItem>
														<SelectItem key={"Prefiere no decirlo"} value={"Prefiere no decirlo"}>Prefiere no decirlo</SelectItem>
													</SelectContent>
												</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="grupo_etario"
										render={({ field }: any) => (
											<FormItem>
												<FormLabel>Grupo etario:</FormLabel>
												<FormControl>
													<Select {...field} className="input"t
														onValueChange={(value:string) => {
														field.onChange(value); 
														}}
														value={field.value}
													>
														<SelectTrigger className="w-full">
															<SelectValue placeholder="Selecciona una opcion" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem key={"Infancia"} value={"Infancia"}>Infancia</SelectItem>
															<SelectItem key={"Adolescencia"} value={"Adolescencia"}>Adolescencia</SelectItem>
															<SelectItem key={"Juventud"} value={"Juventud"}>Juventud</SelectItem>
															<SelectItem key={"Adultez temprana"} value={"Adultez temprana"}>Adultez temprana</SelectItem>
															<SelectItem key={"Adultez media"} value={"Adultez media"}>Adultez media</SelectItem>
															<SelectItem key={"Adultez mayor"} value={"Adultez mayor"}>Adultez mayor</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="atencion_medica"
										render={({ field }: any) => (
											<FormItem>
												<FormLabel>¿Requiere atención medica?:</FormLabel>
												<FormControl>
												<div className="flex gap-2 ">
													<button
													type="button"
													onClick={() => field.onChange("sí")}
													className={`px-6 py-2 rounded ${
														field.value === "sí"
														? "bg-blue-600 text-white "
														: "bg-white-200 text-blue-600 border border-blue-500 "
													}`}
													>
													Sí
													</button>
													<button
													type="button"
													onClick={() => field.onChange("no")}
													className={`px-6 py-2 rounded ${
														field.value === "no"
														? "bg-blue-600 text-white"
														: "bg-white-200 text-blue-600 border border-blue-500"
													}`}
													>
													No
													</button>
												</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								<FormField
									control={form.control}
									name="retenido"
									render={({ field }: any) => (
										<FormItem>
											<FormLabel>¿Persona retenida?: *</FormLabel>
											<FormControl>
											<div className="flex gap-2 ">
													<button
													type="button"
													onClick={() => field.onChange("sí")}
													className={`px-6 py-2 rounded ${
														field.value === "sí"
														? "bg-blue-600 text-white "
														: "bg-white-200 text-blue-600 border border-blue-500 "
													}`}
													>
													Sí
													</button>
													<button
													type="button"
													onClick={() => field.onChange("no")}
													className={`px-6 py-2 rounded ${
														field.value === "no"
														? "bg-blue-600 text-white"
														: "bg-white-200 text-blue-600 border border-blue-500"
													}`}
													>
													No
													</button>
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="comentarios"
									render={({ field }: any) => (
										<FormItem>
											<FormLabel>Comentarios/ Observaciónes:</FormLabel>
											<FormControl>
												<Textarea placeholder="Comentarios/ Observaciónes..." {...field}
													onChange={(e) => {
														field.onChange(e); // Actualiza el valor en react-hook-form
													}}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
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
						{editarPersonasInvolucradas? ("Editar"):(("Agregar"))}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
