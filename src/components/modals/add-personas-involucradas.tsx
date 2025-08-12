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
												<Input placeholder="Rol..." {...field}
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
									name="sexo"
									render={({ field }: any) => (
										<FormItem>
											<FormLabel>Sexo:</FormLabel>
											<FormControl>
												<Input placeholder="Sexo..." {...field}
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
									name="grupo_etario"
									render={({ field }: any) => (
										<FormItem>
											<FormLabel>Grupo etario:</FormLabel>
											<FormControl>
												<Input placeholder="Grupo etario..." {...field}
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
									name="atencion_medica"
									render={({ field }: any) => (
										<FormItem>
											<FormLabel>¿Requiere atención medica?:</FormLabel>
											<FormControl>
												<Input placeholder="Atención médica..." {...field}
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
								name="retenido"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>¿Persona retenida?: *</FormLabel>
										<FormControl>
											<Input placeholder="Persona retenida..." {...field}
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
									name="comentarios"
									render={({ field }: any) => (
										<FormItem>
											<FormLabel>Comentarios/ Observaciónes:</FormLabel>
											<FormControl>
												<Textarea placeholder="Comentarios/ Observaciónes..." {...field}
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
							    {editarPersonasInvolucradas? ("Editar"):(("Agregar"))}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
