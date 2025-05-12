import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { UpdatePase } from "@/lib/update-pass";
import { UpdatedPassModal } from "./updated-pass-modal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { data_correo } from "@/lib/send_correo";
import { formatData } from "@/app/dashboard/pase-update/page";
import Image from "next/image";
import { toast } from "sonner";

interface EntryPassModal2Props {
	title: string;
	data: formatData
	isSuccess: boolean;
	setIsSuccess: Dispatch<SetStateAction<boolean>>;
	onClose: ()=> void;
	passData: any;
}

export const EntryPassModal2: React.FC<EntryPassModal2Props> = ({
	title,
	data,
	isSuccess,
	setIsSuccess,
	passData
}) => {
	const [response, setResponse] = useState<any>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<unknown>();
	const [openGeneratedPass, setOpenGeneratedPass] = useState<boolean>(false);
	const [responseformated, setResponseFormated] = useState<data_correo|null>(null);
	const onSubmit = async () => {
		try {
			setIsLoading(true);
			const apiResponse = await UpdatePase({ access_pass: {
					grupo_vehiculos: data?.grupo_vehiculos,
					grupo_equipos: data.grupo_equipos,
					status_pase: data.status_pase,
					walkin_fotografia:data?.walkin_fotografia,
					walkin_identificacion:data?.walkin_identificacion,
			}, 
			id:data.folio, account_id: data.account_id });
			setResponseFormated({
				email_to: data.email,
				asunto: apiResponse?.response?.data?.json?.asunto,
				email_from: apiResponse?.response?.data?.enviar_de_correo,
				nombre: apiResponse?.response?.data?.json?.enviar_a,
				nombre_organizador: apiResponse?.response?.data?.json?.enviar_de,
				ubicacion: apiResponse?.response?.data?.json?.ubicacion,
				fecha: {desde: apiResponse?.response?.data?.json?.fecha_desde, hasta:apiResponse?.response?.data?.json?.fecha_hasta },
				descripcion: apiResponse?.response?.data?.json?.descripcion,
			})
			
			setResponse(apiResponse); 
			setIsSuccess(true); 
			setOpenGeneratedPass(true)
		} catch (err) {
			setError(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
			setIsSuccess(false); 
			// onClose(); 
	};

	useEffect(()=>{
		if(error){
			toast.error("Ocurrio un error")
		}
	},[error])

	return (
		<Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
			<DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh] flex flex-col " aria-describedby="">
				<DialogHeader className="flex-shrink-0">
					<DialogTitle className="text-2xl text-center font-bold">
						{title}
					</DialogTitle>
				</DialogHeader>
				<div className="flex-grow overflow-y-auto p-4 ">
					<div className="w-full flex gap-2 mb-3">
							<p className="font-bold ">Nombre Completo : </p>
							<p className="">{data?.nombre} </p>
						</div>

					<div className="flex flex-col ">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="w-full flex gap-2 ">
								<p className="font-bold">Tipo de pase : </p>
								<p >Visita General</p>
							</div>
							<div className="w-full flex gap-2">
								<p className="font-bold">Estatus : </p>
								<p className=" text-red-500"> Proceso</p>
							</div>
							<div className="w-full flex gap-2">
								<p className="font-bold flex flex-shrink-0">Email : </p>
								<p className="w-full break-words">{data?.email}</p>
							</div>

							<div className="w-full flex gap-2">
								<p className="font-bold">Teléfono : </p>
								<p className="text-sm">{data?.telefono}</p>
							</div>
							<div className="flex justify-between">
									<div className="w-full ">
										<p className="font-bold mb-3">Fotografía:</p>
										{data && data?.walkin_fotografia.length > 0 ?(
										<div className="w-full flex justify-center">
												<Image 
												src={ data?.walkin_fotografia[0].file_url } 
												alt="Imagen"
												width={150}
												height={150}
												className=" h-32 object-contain bg-gray-200 rounded-lg" 
												/>
										</div>
										):(
											<div>
												No hay fotografía disponible
											</div>
										) }
									</div>
								
							</div>
							<div className="flex justify-between">
								
									<div className="w-full ">
										<p className="font-bold mb-3">Identificación:</p>
										{data && data?.walkin_identificacion.length > 0 ?(
										<div className="w-full flex justify-center">
												<Image
												src={data?.walkin_identificacion[0]?.file_url  } 
												alt="Imagen"
												width={150}
												height={150}
												className=" h-32 object-contain bg-gray-200 rounded-lg" 
												/>
										</div>
										):(
											<div>
												No hay identificación disponible
											</div>
										)}

									</div>
							</div>
						</div>
						
						<Separator className="my-4" />

						{data?.grupo_equipos.length>0 && (
						<div className="">
							<p className="text-2xl font-bold mb-2">Equipos</p>
							<Accordion type="single" collapsible>
								{data?.grupo_equipos.map((equipo, index) => (
									<AccordionItem key={index} value={`equipo-${index}`}>
										<AccordionTrigger>{`${equipo.tipo}`}</AccordionTrigger>
										<AccordionContent>
											<p className="font-medium mb-1">
												Tipo: <span className="">{equipo.tipo || "N/A"}</span>
											</p>
											<p className="font-medium mb-1">
												Equipo: <span className="">{equipo.nombre || "N/A"}</span>
											</p>
											<p className="font-medium mb-1">
												Marca: <span className="">{equipo.marca || "N/A"}</span>
											</p>
											<p className="font-medium mb-1">
												Modelo: <span className="">{equipo.modelo || "N/A"}</span>
											</p>
											<p className="font-medium mb-1">
												Número de Serie:{" "}
												<span className="">{equipo.serie || "N/A"}</span>
											</p>
											<p className="font-medium mb-1">
												Color: <span className="">{equipo.color || "N/A"}</span>
											</p>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</div>
						)}

						{data?.grupo_vehiculos.length>0 && (
						<div className="">
							<p className="text-2xl font-bold mb-2">Vehículos</p>
							<Accordion type="single" collapsible>
								{data?.grupo_vehiculos.map((vehiculo, index) => (
									<AccordionItem key={index} value={`vehiculo-${index}`}>
										<AccordionTrigger>{`${vehiculo.tipo}`}</AccordionTrigger>
										<AccordionContent>
											<p className="font-medium mb-1">
												Tipo de Vehículo:{" "}
												<span className="">{vehiculo.tipo || "N/A"}</span>
											</p>
											<p className="font-medium mb-1">
												Marca:{" "}
												<span className="">{vehiculo.marca || "N/A"}</span>
											</p>
											<p className="font-medium mb-1">
												Modelo:{" "}
												<span className="">{vehiculo.modelo || "N/A"}</span>
											</p>
											<p className="font-medium mb-1">
												Estado:{" "}
												<span className="">{vehiculo.estado || "N/A"}</span>
											</p>
											<p className="font-medium mb-1">
												Placas:{" "}
												<span className="">{vehiculo.placas || "N/A"}</span>
											</p>
											<p className="font-medium mb-1">
												Color:{" "}
												<span className="">{vehiculo.color || "N/A"}</span>
											</p>
										</AccordionContent>
									</AccordionItem>
								))}
							</Accordion>
						</div>
						)}
					</div>
				</div>
				<div className="flex gap-2">
					<DialogClose asChild >
						<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
							Cancelar
						</Button>
					</DialogClose>
					{ response?.success  ? ( 
						<UpdatedPassModal
							title="Pase de Entrada Completado "
							description={"El pase ha sido completado con éxito, selecciona una de las siguientes opciones."}
							openGeneratedPass={openGeneratedPass}
							hasEmail={data?.email ? true: false}
							hasTelefono={data?.telefono ? true: false}
							setOpenGeneratedPass={setOpenGeneratedPass} 
							qr={response?.response?.data?.json?.qr_pase[0].file_url}
							dataPass={responseformated}
							account_id={data?.account_id}
							folio={response?.response?.data?.json?.id}
							closePadre={handleClose}
							passData={passData}
							updateResponse={response}
							/>
					):null}
					
						<Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" type="submit" onClick={onSubmit} disabled={isLoading}>
							{!isLoading ? ("Actualizar pase"):(<><Loader2 className="animate-spin"/>Actualizando pase...</>)}
						</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
