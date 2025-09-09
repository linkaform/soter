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
import { useForm, useWatch } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useShiftStore } from "@/store/useShiftStore";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { toast } from "sonner";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Select from "react-select";
import { formatForMultiselect } from "@/lib/utils";

interface IncidenciaModalProps {
	title: string;
	children: React.ReactNode;
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
    setAccionesTomadas: Dispatch<SetStateAction<any>>;
    indice:number| null;
    editarAccionesTomadas:boolean;
    setEditarAccionesTomadas: Dispatch<SetStateAction<any>>;
    accionesTomadasSeleccion:any;
}

const formSchema = z.object({
	acciones_tomadas: z.string().min(1, { message: "Este campo es oblicatorio" }),
	llamo_a_policia: z.string().min(1, { message: "Este campo es oblicatorio" }),
	autoridad: z.string().optional(),
	numero_folio_referencia:  z.string().optional(),
	responsable:  z.string().optional(),
});

export const AccionesTomadasModal: React.FC<IncidenciaModalProps> = ({
	title,
	children,
	isSuccess,
	setIsSuccess,
    setAccionesTomadas,
    indice,
    editarAccionesTomadas,
    setEditarAccionesTomadas,
    accionesTomadasSeleccion
}) => {
	const { isLoading} = useShiftStore();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			acciones_tomadas: "",
            llamo_a_policia: "",
			autoridad: "",
			numero_folio_referencia: "",
			responsable: "",
		},
	});

	const { reset } = form;

	useEffect(() => {
        if (isSuccess){
            reset({
                acciones_tomadas: "",
                llamo_a_policia: "",
                autoridad: "",
                numero_folio_referencia: "",
                responsable: "",
              });
        }

		if (editarAccionesTomadas && accionesTomadasSeleccion) {
			reset({
                acciones_tomadas: accionesTomadasSeleccion.acciones_tomadas,
                llamo_a_policia: accionesTomadasSeleccion.llamo_a_policia,
                autoridad: accionesTomadasSeleccion.autoridad,
                numero_folio_referencia: accionesTomadasSeleccion.numero_folio_referencia,
                responsable: accionesTomadasSeleccion.responsable,
              });
		}
	}, [isSuccess, reset])

	function onSubmit(values: z.infer<typeof formSchema>) {
        const formatData = {
            acciones_tomadas: values.acciones_tomadas,
            llamo_a_policia: values.llamo_a_policia,
            autoridad: values.autoridad,
            numero_folio_referencia: values.numero_folio_referencia,
            responsable: values.responsable,
        }
        if(editarAccionesTomadas){
            setEditarAccionesTomadas(false)
            setAccionesTomadas((prev: any[]) =>
                prev.map((item, i) => (i === indice ? formatData : item))
                );
            toast.success("Acción editada correctamente.")
        }else{
            setAccionesTomadas((prev: any) => [...prev, formatData]);
            toast.success("Acción agregada correctamente.")
        }
        setIsSuccess(false)
	}

	const handleClose = () => {
		setIsSuccess(false);
        setEditarAccionesTomadas(false);
	};

    useEffect(() => {
        if(form.formState.errors){
            console.log("Errores:", form.formState.errors)
        }
    }, [form.formState.errors])

    const llamo_a_policia = useWatch({
        control: form.control,
        name: "llamo_a_policia"
      });
      
      
	return (
		<Dialog onOpenChange={setIsSuccess} open={isSuccess} modal>
			<DialogTrigger>{children}</DialogTrigger>
            
            <DialogContent className="max-w-lg max-h-[80vh] min-h-auto flex flex-col overflow-auto" onInteractOutside={(e) => e.preventDefault()} aria-describedby="" >
            <DialogHeader>
                <DialogTitle className="text-2xl text-center font-bold">
                {title}
                </DialogTitle>
            </DialogHeader>
                <div className="flex-grow overflow-y-auto px-2">
                <Form {...form}>
					<form  >
						<div className="grid grid-cols-1 gap-5 mb-6 px-2">
							<FormField
								control={form.control}
								name="acciones_tomadas"
								render={({ field }: any) => (
									<FormItem>
										<FormLabel>Acciones Tomadas: *</FormLabel>
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
                                name="llamo_a_policia"
                                defaultValue="si"
                                render={({ field }: any) => (
                                    <FormItem>
                                        <FormLabel>¿Se contactó a las autoridades? *</FormLabel>
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

                        {llamo_a_policia === "sí" && (
                            <>
                            <FormField
                                    control={form.control}
                                    name="autoridad"
                                    render={({ field }:any) => (
                                        <FormItem className="w-full">
                                                <FormLabel>Autoridad ante la que se presentó: *</FormLabel>
                                                <Select 
														className="border border-slate-100 rounded-2xl"
														value={field.value ? formatForMultiselect([field.value]):[]}
                                                        options={formatForMultiselect([
                                                            "911 Emergencias",
                                                            "Bomberos",
                                                            "Cruz Roja Mexicana",
                                                            "DIF Municipal / Estatal (Desarrollo Integral de la Familia)",
                                                            "Policía Municipal / Estatal",
                                                            "Servicios Médicos de Emergencia",
                                                            "Tránsito Municipal / Estatal",
                                                            ])} 
														onChange={(selectedOption:any) => {
															field.onChange(selectedOption ? selectedOption.value :"");
														}}
														isClearable
														styles={{
                                                            menu: (base) => ({
                                                              ...base,
                                                              zIndex: 50,
                                                              maxHeight: "200px",
                                                              overflowY: "auto",
                                                            }),
                                                          }}
														/>
											</FormItem>
                                    )} />
                                    
                                    <FormField
                                        control={form.control}
                                        name="numero_folio_referencia"
                                        render={({ field }: any) => (
                                            <FormItem>
                                                <FormLabel>Número de folio o referencia:</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Número de folio o referencia..." {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                        } }
                                                        value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </>
                            )}
                            <FormField
                                control={form.control}
                                name="responsable"
                                render={({ field }: any) => (
                                    <FormItem>
                                        <FormLabel>Responsable de la acción tomada:</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Responsable..." {...field}
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


                <div className="sticky bottom-0 z-50 bg-white pt-4 px-2 flex gap-2 border-t border-slate-200 mt-4">
                <DialogClose asChild>
                    <Button
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                    onClick={handleClose}
                    >
                    Cancelar
                    </Button>
                </DialogClose>

                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isLoading}
                >
                    {editarAccionesTomadas ? "Editar" : "Agregar"}
                </Button>
                </div>
			</DialogContent>
		</Dialog>
	);
};
