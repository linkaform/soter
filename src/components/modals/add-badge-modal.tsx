import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

import { z } from "zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useGetLockers } from "@/hooks/useGetLockers";
import { useGetGafetes } from "@/hooks/useGetGafetes";
import { useAsignarGafete } from "@/hooks/useAsignarGafete";
import { IdCard, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { toast } from "sonner";
import { dataGafetParamas } from "@/lib/bitacoras";

interface AddBadgeModalProps {
	title: string;
	status:string;
	refetchTable:()=>void;
	id_bitacora:string;
	tipo_movimiento:string;
	ubicacion:string;
	area:string;
}

export interface locker {
	status: string
	area: string
	locker_id: string
	ubicacion: string
	tipo_locker: string
	_id: string
}
export interface gafete {
	ubicacion: string
	status: string
	gafete_id: string
	_id: string
	area: string
}


const FormSchema = z.object({
	gafete: z.string().min(2, {
		message: "Campo requerido.",
	}),

	locker: z.string().min(2, {
		message: "Campo requerido.",
	}),
	documentos: z.string().min(1, {
		message: "Selecciona al menos un documento.",
	}),
});

export const AddBadgeModal: React.FC<AddBadgeModalProps> = ({
	title,
	area,
	status,
	refetchTable, 
	id_bitacora,
	tipo_movimiento,
	ubicacion
}) => {
	const [dataGafete, setDataGafete]= useState< dataGafetParamas | null>(null)
	const { data:responseGetLockers, isLoading:loadingGetLockers, refetch: refetchLockers } = useGetLockers(ubicacion ?? null,"", status);
	const { data:responseGetGafetes, isLoading:loadingGetGafetes, refetch: refetchGafetes } = useGetGafetes(ubicacion ?? null,"", status);
	const { data:responseAsignarGafete, isLoading:loadingAsginarGafete, refetch: refetchAsignarGafete, error:errorAsignarGafete } = useAsignarGafete(dataGafete ?? null, 
		id_bitacora ?? null, tipo_movimiento?? null );
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			gafete: "",
			locker: "",
			documentos:"",
		},
	});

	useEffect(()=>{
		if(isOpen){
			refetchLockers()
			refetchGafetes()
		}
	},[isOpen, refetchGafetes, refetchLockers])

	useEffect(()=>{
		if(errorAsignarGafete){
			toast.error("Error al asignar gafete.")
			// errorAlert(errorAsignarGafete, "Error al asignar gafete.", "warning")
		}
	},[errorAsignarGafete])


	function onSubmit(data: z.infer<typeof FormSchema>) {
		setDataGafete({locker_id:data.locker, gafete_id:data.gafete, documento:data.documentos, status_gafete:"asignado" , ubicacion:ubicacion, area:area})
	}

	useEffect(()=>{
		if(dataGafete){
			refetchAsignarGafete()
		}
	},[dataGafete,refetchAsignarGafete])
	

	useEffect(()=>{
		if(responseAsignarGafete){
			setIsOpen(false)
			toast.success("Gafete asignado exitosamente.")
			// sweetAlert("success", "Confirmación", "Gafete asignado exitosamente.")
			refetchTable()
		}
	}, [responseAsignarGafete,refetchTable])

	const handleOpenModal = async () => {
		setIsOpen(true); 
	}

return (
	<Dialog open={isOpen} onOpenChange={setIsOpen}>
		<div className="cursor-pointer" onClick={handleOpenModal}>
			<IdCard />
		</div>
		<DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] flex flex-col" aria-describedby="">
			<DialogHeader className="flex-shrink-0">
			<DialogTitle className="text-2xl text-center font-bold">
				{title}
			</DialogTitle>
			</DialogHeader>
			<div className="overflow-y-auto">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="w-full space-y-6 "
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<FormField
								control={form.control}
								name="gafete"
								render={({ field }:any) => (
									<FormItem>
										<FormLabel>
											<span className="text-red-500">*</span> Gafete
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
												{loadingGetGafetes?(
														<>
														<SelectValue placeholder="Cargando gafetes..." />
														</>
													): (
														<>
														<SelectValue placeholder="Selecciona un gafete" />
														</>
													)}
												</SelectTrigger>
											</FormControl>
											<SelectContent>
											{responseGetGafetes?.map((gafete:gafete, index:string) => (
														<SelectItem key={index} value={gafete.gafete_id}>
															{gafete.gafete_id}
														</SelectItem>
													))}
											</SelectContent>
										</Select>

										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="locker"
								render={({ field }:any) => (
									<FormItem>
										<FormLabel>
											<span className="text-red-500">*</span> Locker
										</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
												{loadingGetLockers?(
														<>
														<SelectValue placeholder="Cargando lockers..." />
														</>
													): (
														<>
														<SelectValue placeholder="Selecciona un locker" />
														</>
													)}
												</SelectTrigger>
											</FormControl>
											<SelectContent>
											{responseGetLockers?.map((locker:locker, index:string) => (
														<SelectItem key={index} value={locker.locker_id	}>
															{locker.locker_id	}
														</SelectItem>
													))}
											</SelectContent>
										</Select>

										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="documentos"
								render={({ field }:any) => (
									<FormItem>
										<FormLabel>
											<span className="text-red-500">*</span> Documento de
											garantía
										</FormLabel>
										<div className="space-y-2 my-5">
												<FormControl >
													<div className="flex items-center space-x-2">
														<RadioGroup 
															defaultValue={field.value}
															onValueChange={field.onChange}
														>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="ine" />
															</FormControl>
															<FormLabel className="font-normal">
																INE
															</FormLabel>
														</FormItem>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="licencia de conducir" />
															</FormControl>
															<FormLabel className="font-normal">Licencia de conducir</FormLabel>
														</FormItem>

														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="pase de estacionamiento" />
															</FormControl>
															<FormLabel className="font-normal">Pase de Estacionamiento</FormLabel>
														</FormItem>
														<FormItem className="flex items-center space-x-3 space-y-0">
															<FormControl>
																<RadioGroupItem value="otro" />
															</FormControl>
															<FormLabel className="font-normal">Otro</FormLabel>
														</FormItem>

														</RadioGroup>
													</div>
												</FormControl>
										</div>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						
					</form>
				</Form>
			</div>
			<div className="flex gap-5">
				<DialogClose asChild>
					<Button
						onClick={() => form.reset()}
						className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
					>
						Cancelar
					</Button>
				</DialogClose>

				<Button className="w-full  bg-blue-500 hover:bg-blue-600 text-white" type="submit" onClick={form.handleSubmit(onSubmit)}>
					{ !loadingAsginarGafete ? (<>
					{("Asignar gafete")}
					</>) :(<> <Loader2 className="animate-spin"/> {"Cargando..."} </>)}
				</Button>
			</div>
		</DialogContent>        
	</Dialog>
);
};
