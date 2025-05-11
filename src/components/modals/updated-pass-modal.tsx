/* eslint-disable react-hooks/exhaustive-deps */
import { Mail, MessageCircleMore } from "lucide-react";
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
import { Form} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm} from "react-hook-form";
import { data_correo } from "@/lib/send_correo";
import { useGetPdf } from "@/hooks/usetGetPdf";
import { descargarPdfPase } from "@/lib/download-pdf";
import Image from "next/image";
import { useSendCorreoSms } from "@/hooks/useSendCorreo";

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
	passData: any;
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
	closePadre,
	passData
}) => {
	const [enviarCorreo, setEnviarCorreo] = useState<string[]>([]);
	const [isActive, setIsActive] = useState(false);
	const [isActiveSMS, setIsActiveSMS] = useState(false);
	const { createSendCorreoSms, isLoadingCorreo} = useSendCorreoSms();
	const [enablePdf, setEnablePdf] = useState(false)
	const { data: responsePdf, isLoading: loadingPdf} = useGetPdf(account_id, folio, enablePdf);
	const downloadUrl=responsePdf?.response?.data?.data?.download_url

	const handleClickGoogleButton = () => {
		const url = passData?.pass_selected?.google_wallet_pass_url;
		if (url) {
			window.open(url, '_blank');
		} else {
			console.log('No hay URL disponible');
		}
	}
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			enviar_correo: enviarCorreo,
		}
	});

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
		// setTimeout(() => {
		// 	window.location.href = "https://www.soter.mx/";
		// }, 100);
	}

	useEffect(()=>{
		if(downloadUrl){
			onDescargarPDF(downloadUrl)
			setEnablePdf(false)
			console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++", enviarCorreo)
			if(enviarCorreo.includes("enviar_correo") || enviarCorreo.includes("enviar_sms")){
				createSendCorreoSms.mutate({account_id, envio:enviarCorreo, data_for_msj:dataPass, folio})
			}
			toast.success("¡PDF descargado correctamente!");
			// setTimeout(() => {
			// 	window.location.href = "https://www.soter.mx/";
			// }, 1800);
		}
	},[downloadUrl])

	async function onDescargarPDF(download_url: string) {
		try {
		  await descargarPdfPase(download_url);
		} catch (error) {
		  toast.error("Error al descargar el PDF: " + error);
		}
	}


return (
	<Dialog open={openGeneratedPass} modal>
		<DialogTrigger ></DialogTrigger>

	    <DialogContent className="max-w-xl  overflow-y-auto max-h-[90vh] flex flex-col" aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-4">
			
			<div className="flex justify-center mb-3">
				<p className="text-center w-1/2 md:w-full">{ !hasEmail && !hasTelefono ? "El pase ha sido completado con éxito.":description}</p>
			</div>
			<Form {...form}>
			<form className="space-y-8"> 
					<div className="flex flex-col justify-start items-center gap-3">
						<div className="flex gap-2 flex-col">
							<div className="flex flex-col gap-2 flex-wrap items-center justify-center">
								{hasEmail==true ? (
									
									<Button
										type="button"
										onClick={handleToggleEmail}
										className={`px-4 py-2 rounded-md transition-all duration-300 w-full ${
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
									
									<Button
										type="button"
										onClick={handleToggleSMS}
										className={`px-4 py-2 rounded-md transition-all duration-300 w-full ${
											isActiveSMS ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
										} hover:bg-trasparent hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
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

								<button type="button" onClick={handleClickGoogleButton}>
									<Image src="/esES_add_to_google_wallet_wallet-button.svg" alt="Add to Google Wallet" width={200} height={200} className="mt-2" />
								</button>
							</div>
						</div>
					</div>
						
					{qr!=="" ?(
						<>
						<div className="w-full ">
							<div className="w-full flex justify-center">
								<Image
								src={qr} 
								alt="Imagen"
								width={150}
								height={150}
								className="w-64 h-64 object-contain bg-gray-200 rounded-lg" 
								/>
							</div>
						</div>
						</>
					):null}
					
			</form>
			</Form>
		</div>
		<div className="flex gap-2 ">
					<DialogClose asChild >
						<Button className="w-full  bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={closeModal}>
							Cerrar
						</Button>
					</DialogClose>
					<Button
						className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={()=>{setEnablePdf(true)}} disabled={loadingPdf}>
						{isLoadingCorreo || loadingPdf ? ("Cargando..."): ("Descargar PDF")}
					</Button>
					</div> 
		</DialogContent>
	</Dialog>
);
};
