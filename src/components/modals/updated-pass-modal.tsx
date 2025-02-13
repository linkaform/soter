import { CheckCircleIcon, Mail, MessageCircleMore } from "lucide-react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSendCorreo } from "@/hooks/useSendCorreo";
import { data_correo } from "@/lib/send_correo";
import { useGetPdf } from "@/hooks/usetGetPdf";
import { descargarPdfPase } from "@/lib/download-pdf";
import { errorAlert } from "@/lib/utils";
import Image from "next/image";

interface updatedPassModalProps {
	title: string;
	description: string;
	children: React.ReactNode;
	openGeneratedPass:boolean;
	qr:string;
	dataPass: data_correo|null;
	account_id:number;
	folio:string;
}
export const formSchema = z
		.object({
			enviar_correo: z.array(z.string()).optional()
	});
export const UpdatedPassModal: React.FC<updatedPassModalProps> = ({
	title,
	description,
	children,
	openGeneratedPass,
	dataPass,
	qr,
	account_id,
	folio
}) => {
	const router = useRouter(); // Inicializamos el hook useRouter
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // Estado para almacenar las opciones seleccionadas
	const [dataCorreo, setDataCorreo]= useState<data_correo|null>(null)
	const { isLoading: loadingCorreo, refetch:refetchCorreo , error} = useSendCorreo(account_id, selectedOptions,dataCorreo,folio);
	const { data: responsePdf, isLoading: loadingPdf} = useGetPdf(account_id,folio);

	const handleCheckboxChange = (option: string, checked: boolean) => {
		if (checked) {
			setSelectedOptions((prev) => [...prev, option]); // Agregar la opción al estado si está seleccionada
		} else {
			setSelectedOptions((prev) => prev.filter((item) => item !== option)); // Eliminar la opción del estado si no está seleccionada
		}
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			enviar_correo: [],
		}
		
	});

	const onSubmit = async () => {
		setDataCorreo(dataPass)
		await descargarPdfPase(responsePdf.response?.data?.data?.download_url)
		toast.success("¡PDF descargado correctamente!");
		router.push(`/`);
	};

	useEffect(()=>{
		if(dataCorreo){
			refetchCorreo()
		}
	},[dataCorreo,refetchCorreo])

	useEffect(()=>{
		if(error){
			console.error(error)
			errorAlert(error)
		}
	},[error])

return (
	//onOpenChange={setOpenGeneratedPass}  esto en estaba como pro
	<Dialog open={openGeneratedPass} modal>
		<DialogTrigger asChild>{children}</DialogTrigger>

		<DialogContent className="max-w-xl">
			<DialogHeader>
				<DialogTitle className="text-2xl text-center  font-bold my-5">
					{title}
					<CheckCircleIcon className=" h-6 w-6 text-green-500 ml-2 inline-block" />
				</DialogTitle>
			</DialogHeader>
			
			<div className="px-16">
				<p className="text-center">{description}</p>
			</div>
			<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> 
					<div className="flex flex-col justify-start items-center gap-3">

						<div >
						<FormField
							control={form.control}
							name="enviar_correo"
							render={() => (
								<FormItem>
									<div className="flex flex-col space-y-2">
										<FormItem className="flex items-center space-x-3">
											<FormControl>
											<Checkbox id="correo"  
											checked={selectedOptions.includes("enviar_correo")} // Si está seleccionado, marcar el checkbox
											onCheckedChange={(checked: boolean) => handleCheckboxChange("enviar_correo", checked)}/>
											</FormControl>
											<Mail className="h-6" />
											<label
												htmlFor="terms"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>Enviar Correo</label>

											{/* <FormLabel>Enviar Correo</FormLabel> */}
										</FormItem>

										<FormItem className="flex items-center space-x-3">
											<FormControl>
											<Checkbox id="sms" 
												checked={selectedOptions.includes("enviar_sms")} // Si está seleccionado, marcar el checkbox
												onCheckedChange={(checked: boolean) => handleCheckboxChange("enviar_sms", checked)}
											/>
											</FormControl>
											<MessageCircleMore className="h-6" />
											<label
												htmlFor="terms"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>Enviar SMS</label>
										</FormItem>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						</div>
				</div>
						
					{qr!=="" ?(
							<>
							<div className="w-full ">
									<div className="w-full flex justify-center">
											<Image
											src={qr} // Asumiendo que data.imagenUrl contiene la URL de la imagen
											alt="Imagen"
											width={150}
											height={150}
											className="w-64 h-64 object-contain bg-gray-200 rounded-lg" // Clases de Tailwind para estilizar la imagen
											/>
									</div>
									</div>
							</>
					):null}

					<Button
						className="w-full bg-blue-500 hover:bg-blue-600 text-white" type="submit">
						{loadingCorreo || loadingPdf ? ("Cargando..."): ("Descargar PDF")}
					</Button>
			</form>
			</Form>
		</DialogContent>
	</Dialog>
);
};
