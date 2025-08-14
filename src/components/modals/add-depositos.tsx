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
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
    setDepositos: Dispatch<SetStateAction<any>>;
    indice:number| null;
    editarDepositos:boolean;
    setEditarDepositos: Dispatch<SetStateAction<any>>;
    depositosSeleccion:any;
}

const formSchema = z.object({
	tipo_deposito: z.string().min(1, { message: "Este campo es oblicatorio" }),
	origen: z.string().min(1, { message: "Este campo es oblicatorio" }),
	cantidad: z.number().min(1, { message: "Este campo es oblicatorio" }),
});

export const DepositosModal: React.FC<IncidenciaModalProps> = ({
	title,
	children,
	isSuccess,
	setIsSuccess,
    setDepositos,
    indice,
    editarDepositos,
    setEditarDepositos,
    depositosSeleccion
}) => {
	const { isLoading} = useShiftStore();

    console.log("conf", depositosSeleccion)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			tipo_deposito: "",
            origen: "",
			cantidad: 0,
		},
	});

	const { reset } = form;

	useEffect(() => {
        if (isSuccess){
            reset({
                tipo_deposito: "",
                origen: "",
                cantidad: 0,
              });
        }

		if (editarDepositos && depositosSeleccion) {
			reset({
                tipo_deposito: depositosSeleccion.tipo_deposito,
                origen: depositosSeleccion.origen,
                cantidad: depositosSeleccion.cantidad,
              });
		}
	}, [isSuccess, reset])

	function onSubmit(values: z.infer<typeof formSchema>) {
        const formatData = {
            tipo_deposito: values.tipo_deposito,
            origen: values.origen,
            cantidad: values.cantidad,
        }
        if(editarDepositos){
            setEditarDepositos(false)
            setDepositos((prev: any[]) =>
                prev.map((item, i) => (i === indice ? formatData : item))
                );
            toast.success("Deposito editado correctamente.")
        }else{
            setDepositos((prev: any) => [...prev, formatData]);
            toast.success("Deposito agregado correctamente.")
        }
        setIsSuccess(false)
	}

	const handleClose = () => {
		setIsSuccess(false);
        setEditarDepositos(false);
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
                            name="tipo_deposito"
                            render={({ field }:any) => (
                                <FormItem>
                                <FormLabel>Tipo Deposito:</FormLabel>
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
                                            <SelectItem key={"Efectivo"} value={"Efectivo"}>Efectivo</SelectItem>
                                            <SelectItem key={"Fichas Deposito"} value={"Fichas Deposito"}>Fichas Deposito</SelectItem>
                                            <SelectItem key={"Menos Dev. DEP-PDT"} value={"Menos Dev. DEP-PDT"}>Menos Dev. DEP-PDT</SelectItem>
                                            <SelectItem key={"Cheques"} value={"Cheques"}>Cheques</SelectItem>
                                            <SelectItem key={"Cheques Dlls"} value={"Cheques Dlls"}>Cheques Dlls</SelectItem>
                                            <SelectItem key={"Vales"} value={"Vales"}>Vales</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                              <FormField
                            control={form.control}
                            name="origen"
                            render={({ field }:any) => (
                                <FormItem>
                                <FormLabel>Origen:</FormLabel>
                                <FormControl>
                                    <Input placeholder="Origen..." {...field} 
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="cantidad"
                            render={({ field }:any) => (
                                <FormItem>
                                <FormLabel>Cantidad:</FormLabel>
                                <FormControl>
                                    <Input placeholder="Cantidad..." {...field} 
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "" || !isNaN(Number(value))) {
                                            field.onChange(value === "" ? "" : Number(value)); // Si es vacío, lo mantiene vacío
                                        }
                                    }}
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
							    {editarDepositos? ("Editar"):(("Agregar"))}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
