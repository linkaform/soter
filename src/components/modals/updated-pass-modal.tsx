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
import { sendSmsOrEmail } from "@/lib/notes";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Form} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm} from "react-hook-form";
import { data_correo } from "@/lib/send_correo";
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
	updateResponse: any;
}
 const formSchema = z
		.object({
			enviar_correo: z.array(z.string()).optional()
	});
export const UpdatedPassModal: React.FC<updatedPassModalProps> = ({
	title,
	openGeneratedPass,
	setOpenGeneratedPass,
	dataPass,
	qr,
	account_id,
	folio,
	hasEmail,
	hasTelefono,
	closePadre,
	passData,
	updateResponse
}) => {
	const [enviarCorreo, setEnviarCorreo] = useState<string[]>([]);
	const { createSendCorreoSms, isLoadingCorreo} = useSendCorreoSms();
	const [enablePdf, setEnablePdf] = useState(false)
	const [smsSent, setSmsSent] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const downloadImgUrl = Array.isArray(updateResponse?.json?.pdf_to_img) && updateResponse?.json?.pdf_to_img.length > 0
		? updateResponse?.json?.pdf_to_img[0]?.file_url
		: "";

	const handleClickSendPass = async (folio: string, envio: string[]) => {
		if (envio.includes("enviar_correo")) {
			setEmailSent(true);
		}
		if (envio.includes("enviar_sms")) {
			setSmsSent(true);
		}
		try {
			await sendSmsOrEmail(folio, envio);
		} catch (err) {
			console.error("Error:", err);
			if (envio.includes("enviar_correo")) {
				setEmailSent(false);
			}
			if (envio.includes("enviar_sms")) {
				setSmsSent(false);
			}
		}
	}
	
	const handleClickGoogleButton = () => {
		const url = passData?.pass_selected?.google_wallet_pass_url;
		if (url) {
			window.open(url, '_blank');
		} else {
			toast.error('No hay pase disponible', {
                style: {
                    background: "#dc2626",
                    color: "#fff",
                    border: 'none'
                },
            });
		}
	}

	const handleClickAppleButton = async () => {
		const record_id = passData?.pass_selected?._id;
		const userJwt = localStorage.getItem("access_token");

		toast.loading("Obteniendo tu pase...", {
			style: {
				background: "#000",
				color: "#fff",
				border: 'none'
			},
		});

		try {
			const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
				method: 'POST',
				body: JSON.stringify({
					script_name: 'create_pass_apple_wallet.py',
					record_id
				}),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + userJwt
				},
			});
			const data = await response.json();
			const file_url = data?.response?.file_url;

			toast.dismiss();
			toast.success("Pase obtenido correctamente.", {
				style: {
					background: "#000",
					color: "#fff",
					border: 'none'
				},
			});

			const fileResponse = await fetch(file_url);
			const blob = await fileResponse.blob();
			const pkpassBlob = new Blob([blob], { type: 'application/vnd.apple.pkpass' });
			const url = window.URL.createObjectURL(pkpassBlob);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'pass.pkpass';
			document.body.appendChild(a);
			a.click();
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			toast.dismiss();
			toast.error(`${error}` || "Hubo un error al obtener su pase.", {
				style: {
					background: "#000",
					color: "#fff",
					border: 'none'
				},
			});
		}
	}
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			enviar_correo: enviarCorreo,
		}
	});

	const closeModal=()=>{
		setOpenGeneratedPass(false)
		closePadre()
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}

	useEffect(() => {
		if (enablePdf && downloadImgUrl) {
			onDescargarPDF();
			setEnablePdf(false);
			setEnviarCorreo([]);
			if (enviarCorreo.includes("enviar_correo") || enviarCorreo.includes("enviar_sms")) {
				createSendCorreoSms.mutate({ account_id, envio: enviarCorreo, data_for_msj: dataPass, folio });
			}
			toast.success("Pase descargado correctamente!");
			setTimeout(() => {
				window.location.reload();
			}, 2000);
		}
	}, [enablePdf]); // Solo depende de enablePdf

	// async function onDescargarPDF(download_url: string) {
	async function onDescargarPDF() {
		try {
		//   await descargarPdfPase(downloadImgUrl);
			const response = await fetch(downloadImgUrl);
			if (!response.ok) throw new Error("No se pudo obtener el archivo");

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			a.download = "pase_de_entrada.png";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);

			URL.revokeObjectURL(url);
		} catch (error) {
		  toast.error("Error al descargar el pase: " + error);
		}
	}


return (
	<Dialog open={openGeneratedPass} onOpenChange={(isOpen) => {
		setOpenGeneratedPass(isOpen);
		if (!isOpen) {
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		}
	  }} modal>
		<DialogTrigger> </DialogTrigger>

	    <DialogContent className="max-w-xl  overflow-y-auto max-h-[90vh] flex flex-col" aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-4">
			
			<div className="flex justify-center mb-3">
				<p className="text-center w-1/2 md:w-full"></p>
			</div>
			<Form {...form}>
			<form className="space-y-4"> 
					<div className="flex flex-col justify-start items-center gap-3">
						<div className="flex gap-2 flex-col">
							<div className="flex flex-col gap-2 lg:flex-row lg:gap-6 justify-center items-center">
								{hasEmail === true && (
									<Button
										type="button"
										onClick={() => handleClickSendPass(folio, ["enviar_correo"])}
										disabled={emailSent}
										className={`px-4 py-2 rounded-md transition-all duration-300 w-full ${
											emailSent ? "bg-gray-400 text-white" : "bg-blue-600 text-white"
										} hover:bg-blue-700 hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
									>
										<div className="flex items-center">
											<Mail className="mr-3" />
											<div>{emailSent ? "Correo enviado" : "Enviar por correo"}</div>
										</div>
									</Button>
								)}

								{hasTelefono === true && (
									<Button
										type="button"
										onClick={() => handleClickSendPass(folio, ["enviar_sms"])}
										disabled={smsSent}
										className={`px-4 py-2 rounded-md transition-all duration-300 w-full ${
											smsSent ? "bg-gray-400 text-white" : "bg-blue-600 text-white"
										} hover:bg-blue-700 hover:shadow-[0_3px_6px_rgba(0,0,0,0.2)]`}
									>
										<div className="flex items-center">
											<MessageCircleMore className="mr-3" />
											<div>{smsSent ? "SMS enviado" : "Enviar por sms"}</div>
										</div>
									</Button>
								)}
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
							<div className="flex flex-col gap-2 lg:flex-row lg:gap-6 justify-center items-center">
								<button type="button" onClick={handleClickGoogleButton}>
									<Image src="/esES_add_to_google_wallet_add-wallet-badge.png" alt="Add to Google Wallet" width={150} height={150} className="mt-2" />
								</button>
								<button type="button" onClick={handleClickAppleButton}>
									<Image src="/ESMX_Add_to_Apple_Wallet_RGB_101821.svg" alt="Add to Apple Wallet" width={150} height={150} className="mt-2" />
								</button>
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
						className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={()=>{setEnablePdf(true)}}>
						{isLoadingCorreo ? ("Cargando..."): ("Descargar Pase")}
					</Button>
					</div> 
		</DialogContent>
	</Dialog>
);
};
