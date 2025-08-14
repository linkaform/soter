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
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface IncidenciaModalProps {
	title: string;
	children: React.ReactNode;
	openAfectacionPatrimonialModal: boolean;
	setOpenAfectacionPatrimonialModal: Dispatch<SetStateAction<boolean>>;
    setAfectacionPatrimonial: Dispatch<SetStateAction<any>>;
    indice:number| null;
    editarAfectacionPatrimonial:boolean;
    setEditarAfectacionPatrimonial: Dispatch<SetStateAction<any>>;
    afectacionPatrimonialSeleccionada:any;
}

const formSchema = z.object({
	tipo_afectacion: z.string().min(1, { message: "Este campo es oblicatorio" }),
	monto_estimado: z.string().min(1, { message: "Este campo es oblicatorio" }),
	duracion_estimada: z.string().optional(),
});

export const AfectacionPatrimonialModal: React.FC<IncidenciaModalProps> = ({
	title,
	children,
	openAfectacionPatrimonialModal,
	setOpenAfectacionPatrimonialModal,
    setAfectacionPatrimonial,
    indice,
    editarAfectacionPatrimonial,
    setEditarAfectacionPatrimonial,
    afectacionPatrimonialSeleccionada
}) => {
	const { isLoading} = useShiftStore();

    console.log("openAfectacionPatrimonialModal",openAfectacionPatrimonialModal)
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
            tipo_afectacion:"",
            monto_estimado:"",
            duracion_estimada:""
		},
	});

	const { reset } = form;

	useEffect(() => {
        if (openAfectacionPatrimonialModal){
            reset({
                tipo_afectacion:"",
                monto_estimado:"",
                duracion_estimada:""
              });
        }

		if (editarAfectacionPatrimonial && afectacionPatrimonialSeleccionada) {
			reset({
                tipo_afectacion:afectacionPatrimonialSeleccionada.tipo_afectacion,
                monto_estimado:afectacionPatrimonialSeleccionada.monto_estimado,
                duracion_estimada:afectacionPatrimonialSeleccionada.duracion_estimada
              });
		}
	}, [openAfectacionPatrimonialModal, reset])

	function onSubmit(values: z.infer<typeof formSchema>) {
        const formatData = {
            tipo_afectacion: values.tipo_afectacion,
            monto_estimado: values.monto_estimado,
            duracion_estimada: values.duracion_estimada,
        }
        if(editarAfectacionPatrimonial){
            setEditarAfectacionPatrimonial(false)
            setAfectacionPatrimonial((prev: any[]) =>
                prev.map((item, i) => (i === indice ? formatData : item))
                );
            toast.success("Seguimiento editado correctamente.")
        }else{
            setAfectacionPatrimonial((prev: any) => [...prev, formatData]);
            console.log("format data", formatData)
            toast.success("Seguimiento agregado correctamente.")
        }
        setOpenAfectacionPatrimonialModal(false)
	}

	const handleClose = () => {
		setOpenAfectacionPatrimonialModal(false);
        setEditarAfectacionPatrimonial(false);
	};

    useEffect(() => {
        if(form.formState.errors){
            console.log("Errores:", form.formState.errors)
        }
    }, [form.formState.errors])

	return (
		<Dialog onOpenChange={setOpenAfectacionPatrimonialModal} open={openAfectacionPatrimonialModal}>
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
                                name="tipo_afectacion"
                                render={({ field }: any) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Tipo de afectación: *</FormLabel>
                                        <FormControl>
                                        <Select {...field} className="input"
                                            onValueChange={(value:string) => {
                                            field.onChange(value); 
                                        }}
                                        value={field.value} 
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona una opción..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem key={"Daño a infraestructura"} value={"Daño a infraestructura"}> Daño a infraestructura</SelectItem>
                                            <SelectItem key={"Suspensión de actividades"} value={"Suspensión de actividades"}> Suspensión de actividades</SelectItem>
                                            <SelectItem key={"Paro de producción"} value={"Paro de producción"}> Paro de producción</SelectItem>
                                            <SelectItem key={"Impacto económico estimado"} value={"Impacto económico estimado"}> Impacto económico estimado</SelectItem>
                                            <SelectItem key={"Otro"} value={"Otro"}> Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
								control={form.control}
								name="monto_estimado"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>Monto estimado del daño: *</FormLabel>
										<FormControl>
											<Input placeholder="Monto estimado del daño..." {...field}
												onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*\.?\d*$/.test(value)) {
                                                      field.onChange(e); // Solo si es número válido (entero o decimal)
                                                    }
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
                                name="duracion_estimada"
                                render={({ field }: any) => (
                                    <FormItem>
                                        <FormLabel>Duración estimada de la afectación: *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Duración estimada de la afectación..." {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
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
							    {editarAfectacionPatrimonial? ("Editar"):(("Agregar"))}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
