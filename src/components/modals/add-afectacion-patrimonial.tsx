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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useShiftStore } from "@/store/useShiftStore";
import { Input } from "../ui/input";
import { toast } from "sonner";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { formatCurrencyString, formatForMultiselect } from "@/lib/utils";
import Select from "react-select";
import { Textarea } from "../ui/textarea";

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
    descripcion: z.string().min(1, { message: "Este campo es oblicatorio" }),
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
    const [inputValue, setInputValue] = useState(""); // texto visible
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
            tipo_afectacion:"",
            descripcion:"",
            monto_estimado:"",
            duracion_estimada:""
		},
	});

	const { reset } = form;

	useEffect(() => {
        if (openAfectacionPatrimonialModal){
            reset({
                tipo_afectacion:"",
                descripcion:"",
                monto_estimado:"",
                duracion_estimada:""
              });
        }

		if (editarAfectacionPatrimonial && afectacionPatrimonialSeleccionada) {
            console.log("monto", afectacionPatrimonialSeleccionada)
            setInputValue(afectacionPatrimonialSeleccionada.monto_estimado)
			reset({
                tipo_afectacion:afectacionPatrimonialSeleccionada.tipo_afectacion,
                descripcion:afectacionPatrimonialSeleccionada.descripcion,
                monto_estimado:afectacionPatrimonialSeleccionada.monto_estimado,
                duracion_estimada:afectacionPatrimonialSeleccionada.duracion_estimada
              });
		}
	}, [openAfectacionPatrimonialModal, reset])

	function onSubmit(values: z.infer<typeof formSchema>) {
        const formatData = {
            tipo_afectacion: values.tipo_afectacion,
            descripcion:values.descripcion,
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

			<DialogContent className="max-w-lg overflow-y-auto max-h-[60vh] min-h-auto flex flex-col overflow-hidden" aria-describedby="">
				<DialogHeader>
					<DialogTitle className="text-2xl text-center font-bold">
						{title}
					</DialogTitle>
				</DialogHeader>
                <div className="flex-grow overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} >
                            <div className="grid grid-cols-1 gap-5 mb-6 px-3">

                                <FormField
                                    control={form.control}
                                    name="tipo_afectacion"
                                    render={({ field }: any) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Tipo de afectación: *</FormLabel>
                                                <Select 
                                                    placeholder={"Tipo de afectación"}
                                                    inputId="select-rol"
                                                    name="rol"
                                                    aria-labelledby="aria-label"
                                                    value ={field.value ? formatForMultiselect([field.value]):[]}
                                                    options={formatForMultiselect([
                                                        "Daño a infraestructura",
                                                        "Suspensión de actividades",
                                                        "Paro de producción",
                                                        "Impacto económico estimado",
                                                        "Otro",
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
								name="descripcion"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>Descripcion de la afectación: *</FormLabel>
										<FormControl>
											<Textarea placeholder="Acciones Tomadas..." {...field}
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

                                <FormField
                                    control={form.control}
                                    name="monto_estimado"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Monto estimado del daño: *</FormLabel>
                                        <FormControl>
                                            <Input
                                            placeholder="Monto estimado del daño..."
                                            value={inputValue}
                                            onChange={(e) => {
                                                const rawInput = e.target.value;
                                                const numeric = rawInput.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
                                                setInputValue(numeric);
                                                field.onChange(numeric);
                                                if (debounceRef.current) clearTimeout(debounceRef.current);
                                                debounceRef.current = setTimeout(() => {
                                                setInputValue(formatCurrencyString(numeric));
                                                }, 500);
                                            }}
                                            onBlur={field.onBlur}
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
                        {editarAfectacionPatrimonial? ("Editar"):(("Agregar"))}
                    </Button>
                </div>
			</DialogContent>
		</Dialog>
	);
};

