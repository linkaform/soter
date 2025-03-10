import { CheckCircleIcon, Mail, MessageCircleMore } from "lucide-react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Form} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm} from "react-hook-form";
import { useSendCorreo } from "@/hooks/useSendCorreo";
import { data_correo } from "@/lib/send_correo";
import { useGetPdf } from "@/hooks/usetGetPdf";
import { descargarPdfPase } from "@/lib/download-pdf";
import Image from "next/image";

interface updatedPassModalProps {
	title: string;
	description: string;
	openGeneratedPass:boolean;
	setOpenGeneratedPass:Dispatch<SetStateAction<boolean>>;
	qr:string;
	dataPass: data_correo|null;
	account_id:number;
	folio:string;
	hasEmail:boolean;
	hasTelefono:boolean;
	closePadre:()=>void;
}
 const formSchema = z
		.object({
			enviar_correo: z.array(z.string()).optional()
	});
export const UpdatedPassModal: React.FC<updatedPassModalProps> = ({
	title,
	description,
	openGeneratedPass,
	setOpenGeneratedPass,
	dataPass,
	qr,
	account_id,
	folio,
	hasEmail,
	hasTelefono,
	closePadre
}) => {
	const router = useRouter(); 
	console.log("HAS TEL ", hasEmail, hasTelefono)
	const [dataCorreo, setDataCorreo]= useState<data_correo|null>(null)
	const [enviarCorreo, setEnviarCorreo] = useState<string[]>([]);
	const [isActive, setIsActive] = useState(false);
	const [isActiveSMS, setIsActiveSMS] = useState(false);
	const { isLoading: loadingCorreo, refetch:refetchCorreo , error} = useSendCorreo(account_id, enviarCorreo ,dataCorreo,folio);
	const { data: responsePdf, isLoading: loadingPdf} = useGetPdf(account_id,folio);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			enviar_correo: enviarCorreo,
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
			toast.error("Error")
			// errorAlert(error)
		}
	},[error])

	const handleToggleEmail = () => {
		const email= "enviar_correo"
		setEnviarCorreo((prev) => {
			const pre = prev.includes(email)
			? prev.filter((d) => d !== email) 
			: [...prev, email];
			return pre;
		});
		setIsActive(!isActive);

	};

	const handleToggleSMS = () => {
		const sms= "enviar_sms"
		setEnviarCorreo((prev) => {
			const pre = prev.includes(sms)
			? prev.filter((d) => d !== sms)
			: [...prev, sms];
			return pre;
		});
		setIsActiveSMS(!isActiveSMS);
	};
	const closeModal=()=>{
		setOpenGeneratedPass(false)
		closePadre()
	}

return (
	//onOpenChange={setOpenGeneratedPass}  esto en estaba como pro
	<Dialog open={openGeneratedPass} modal>
		<DialogTrigger ></DialogTrigger>

		<DialogContent className="max-w-xl">
			<DialogHeader>
				<DialogTitle className="text-2xl text-center  font-bold my-5">
					{title}
					<CheckCircleIcon className=" h-6 w-6 text-green-500 ml-2 inline-block" />
				</DialogTitle>
			</DialogHeader>
			
			<div className="px-16">
				<p className="text-center">{ !hasEmail && !hasTelefono ? "El pase ha sido completado con éxito.":description}</p>
			</div>
			<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> 
					<div className="flex flex-col justify-start items-center gap-3">

						{/* <div >
						<FormField
							control={form.control}
							name="enviar_correo"
							render={() => (
								<FormItem>
									<div className="flex flex-col space-y-2">
										<FormItem className="flex items-center space-x-3">
											<FormControl>
											<Checkbox id="correo"  
											checked={enviarCorreo.includes("enviar_correo")} // Si está seleccionado, marcar el checkbox
											onCheckedChange={(checked: boolean) => handleCheckboxChange("enviar_correo", checked)}/>
											</FormControl>
											<Mail className="h-6" />
											<label
												htmlFor="terms"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>Enviar Correo</label>
										</FormItem>

										<FormItem className="flex items-center space-x-3">
											<FormControl>
											<Checkbox id="sms" 
												checked={enviarCorreo.includes("enviar_sms")} // Si está seleccionado, marcar el checkbox
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
						</div> */}


					<div className="flex gap-2 flex-col">
						<div className="flex gap-2 flex-wrap">
						{hasEmail==true ? (
							// <Controller
							// control={form.control}
							// name="toggleFieldEmail"
							// render={() => (
							// 		<FormItem>
							// 		<FormControl>
							// 			<Button
							// 			type="button"
							// 			onClick={handleToggleEmail}
							// 			className={`px-4 py-2 rounded-md transition-all duration-300 ${
							// 				isActive ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent "
							// 			} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
							// 			>
							// 			<div className="flex flex-wrap items-center">
							// 				{isActive ? (
							// 				<><Mail className="mr-3" /><div className="">Enviar por correo</div></>
							// 				):(
							// 				<><Mail className="mr-3 text-blue-600" /><div className="text-blue-600">Enviar por correo</div></>
							// 				)}
											
							// 			</div>
							// 			</Button>
							// 		</FormControl>
							// 		<FormMessage />
							// 		</FormItem>
							// 	)}
							// 	/>
							<Button
								type="button"
								onClick={handleToggleEmail}
								className={`px-4 py-2 rounded-md transition-all duration-300 ${
									isActive ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent "
								} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
								>
								<div className="flex flex-wrap items-center">
									{isActive ? (
									<>
										<Mail className="mr-3" />
										<div>Enviar por correo</div>
									</>
									) : (
									<>
										<Mail className="mr-3 text-blue-600" />
										<div className="text-blue-600">Enviar por correo</div>
									</>
									)}
								</div>
								</Button>

						):null}

						



						{hasTelefono==true ?(
							// <Controller
							// control={form.control}
							// name="toggleFieldSMS"
							// render={() => (
							// 		<FormItem>
							// 		<FormControl>
							// 			<Button
							// 			type="button"
							// 			onClick={handleToggleSMS}
							// 			className={`px-4 py-2 rounded-md transition-all duration-300 ${
							// 				isActiveSMS ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
							// 			} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
							// 			>
							// 			<div className="flex flex-wrap items-center">
							// 				{isActiveSMS ? (
							// 				<><MessageCircleMore className="mr-3 text-white" /><div className="">Enviar por sms</div></>
							// 				):(
							// 				<><MessageCircleMore className="mr-3 text-blue-600" /><div className="text-blue-600">Enviar por sms</div></>
							// 				)}
											
							// 			</div>
							// 			</Button>
							// 		</FormControl>
							// 		<FormMessage />
							// 		</FormItem>
							// 	)}
							// 	/>
							<Button
								type="button"
								onClick={handleToggleSMS}
								className={`px-4 py-2 rounded-md transition-all duration-300 ${
									isActiveSMS ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
								} hover:bg-transparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
								>
								<div className="flex flex-wrap items-center">
									{isActiveSMS ? (
									<>
										<MessageCircleMore className="mr-3 text-white" />
										<div>Enviar por sms</div>
									</>
									) : (
									<>
										<MessageCircleMore className="mr-3 text-blue-600" />
										<div className="text-blue-600">Enviar por sms</div>
									</>
									)}
								</div>
								</Button>
						):null}
						</div>
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
					<div className="flex gap-5 my-5">
					<DialogClose asChild >
						<Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={closeModal}>
							Cancelar
						</Button>
					</DialogClose>
					<Button
						className="w-full bg-blue-500 hover:bg-blue-600 text-white" type="submit">
						{loadingCorreo || loadingPdf ? ("Cargando..."): ("Descargar PDF")}
					</Button>
					</div> 
			</form>
			</Form>
		</DialogContent>
	</Dialog>
);
};
