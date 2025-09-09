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
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Select from 'react-select';
import { formatForMultiselect } from "@/lib/utils";

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
	nombre_completo: z.string().min(1, { message: "Este campo es obligatorio" }),
	rol: z.string().min(1, { message: "Este campo es oblicatorio" }),
	sexo: z.string().optional(),
	grupo_etario: z.string().optional(),
	atencion_medica: z.string().optional(),
    retenido: z.string().optional(),
    comentarios: z.string().optional(),
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
		const ensureString = (value: string | string[] | undefined): string =>
			Array.isArray(value) ? value[0] || '' : value || '';

        const formatData = {
            nombre_completo: ensureString(values.nombre_completo),
            rol: ensureString(values.rol) ,
            sexo:ensureString(values.sexo) ,
            grupo_etario: ensureString(values.grupo_etario) ,
            atencion_medica:ensureString(values.atencion_medica),
            retenido:ensureString(values.retenido) ,
            comentarios:ensureString(values.comentarios) ,
        }
        if(editarPersonasInvolucradas){
            setEditarPersonasInvolucradas(false)
            setPersonasInvolucradas((prev: any[]) =>
                prev.map((item, i) => (i === indice ? formatData : item))
                );
            toast.success("Registro editado correctamente.")
        }else{
            setPersonasInvolucradas((prev: any) => [...prev, formatData]);
			console.log("formatData",formatData)
            toast.success("Registro agregado correctamente.")
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

			<DialogContent className="max-w-lg overflow-y-auto max-h-[80vh] min-h-auto  flex flex-col overflow-hidden" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
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
											<FormItem className="w-full">
												 	<FormLabel>Rol en el incidente:</FormLabel>
													<Select 
														placeholder={"Rol en el incidente"}
														inputId="select-rol"
														name="rol"
														aria-labelledby="aria-label"
														value={
															formatForMultiselect([
																"Testigo",
																"Afectado",
																"Agresor",
																"Sospechoso",
																"Responsable",
																"Otro"
															]).find(option => option.value === field.value) || null
														  }
														options={formatForMultiselect([
															"Testigo",
															"Afectado",
															"Agresor",
															"Sospechoso",
															"Responsable",
															"Otro"
														  ])} 
														onChange={(selectedOption:any) => {
															field.onChange(selectedOption ? selectedOption.value :"");
														}}
														isClearable
														styles={{
															menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
														}}
													/>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="sexo"
										render={({ field }: any) => (
											<FormItem className="w-full">
												<FormLabel>Sexo:</FormLabel>
												<Select 
													placeholder={"Sexo"}
													inputId="select-sexo"
													name="sexo"
													aria-labelledby="aria-label"
													className="border border-slate-100 rounded-2xl"
													value={
														formatForMultiselect([
															"Masculino",
															"Femenino",
														]).find(option => option.value === field.value) || null
													  }
													options={formatForMultiselect([
														"Masculino",
														"Femenino",
														])} 
													onChange={(selectedOption:any) => {
														field.onChange(selectedOption ? selectedOption.value :"");
													}}
													isClearable
													styles={{
														menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
													}}
													/>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="grupo_etario"
										render={({ field }: any) => (
											<FormItem className="w-full">
												 	<FormLabel>Grupo etario:</FormLabel>
													<Select 
														placeholder={"Grupo Etario"}
														className="border border-slate-100 rounded-2xl"
														value={
															formatForMultiselect([
															 	"Infancia",
																"Adolescencia",
																"Juventud",
																"Adultez temprana",
																"Adultez media",
																"Adultez mayor"
															]).find(option => option.value === field.value) || null
														  }
														options={formatForMultiselect([
															"Infancia",
															"Adolescencia",
															"Juventud",
															"Adultez temprana",
															"Adultez media",
															"Adultez mayor"
														  ])} 
														onChange={(selectedOption:any) => {
															field.onChange(selectedOption ? selectedOption.value :"");
														}}
														isClearable
														menuPortalTarget={document.body}
														styles={{
															menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
														}}
														/>
											</FormItem>
											// <FormItem>
											// 	<FormLabel>Grupo etario:</FormLabel>
											// 	<FormControl>
											// 		<Select {...field} className="input"t
											// 			onValueChange={(value:string) => {
											// 			field.onChange(value); 
											// 			}}
											// 			value={field.value}
											// 		>
											// 			<SelectTrigger className="w-full">
											// 				<SelectValue placeholder="Selecciona una opcion" />
											// 			</SelectTrigger>
											// 			<SelectContent>
											// 				<SelectItem key={"infancia"} value={"infancia"}>Infancia</SelectItem>
											// 				<SelectItem key={"adolescencia"} value={"adolescencia"}>Adolescencia</SelectItem>
											// 				<SelectItem key={"juventud"} value={"juventud"}>Juventud</SelectItem>
											// 				<SelectItem key={"adultez temprana"} value={"adultez temprana"}>Adultez temprana</SelectItem>
											// 				<SelectItem key={"adultez media"} value={"adultez media"}>Adultez media</SelectItem>
											// 				<SelectItem key={"adultez mayor"} value={"adultez mayor"}>Adultez mayor</SelectItem>
											// 			</SelectContent>
											// 		</Select>
											// 	</FormControl>
											// 	<FormMessage />
											// </FormItem>
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
