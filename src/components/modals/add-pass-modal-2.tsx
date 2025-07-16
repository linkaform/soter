import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { Loader2 } from "lucide-react";
import { UpdatedPassModal } from "./updated-pass-modal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { data_correo } from "@/lib/send_correo";
import { formatData } from "@/app/dashboard/pase-update/page";
import Image from "next/image";
// import { Checkbox } from "../ui/checkbox";
// import { Label } from "../ui/label";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useUpdateAccessPass } from "@/hooks/useUpdatePass";
import { Equipo, Vehiculo } from "@/lib/update-pass-full";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Badge } from "../ui/badge";
// import { toast } from "sonner";

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
	passData,
	setIsSuccess,onClose
}) => {
	const [response,setResponse] = useState<any>(null);
	const [openGeneratedPass, setOpenGeneratedPass] = useState<boolean>(false);
	const [responseformated, setResponseFormated] = useState<data_correo|null>(null);
	const{ updatePassMutation , isLoadingUpdate} = useUpdateAccessPass();

	const onSubmit = async () => {
			updatePassMutation.mutate({access_pass:{
				grupo_vehiculos: data?.grupo_vehiculos,
				grupo_equipos: data.grupo_equipos,
				status_pase: data.status_pase,
				walkin_fotografia: data?.walkin_fotografia,
				walkin_identificacion: data?.walkin_identificacion,
				acepto_aviso_privacidad: data?.acepto_aviso_privacidad ? "sí":"no",
				conservar_datos_por: data?.conservar_datos_por
			},id: data.folio, account_id: data.account_id},{
				onSuccess: (response) => {
					setResponseFormated({
						email_to: data.email,
						asunto: response?.response?.data?.json?.asunto,
						email_from: response?.response?.data?.enviar_de_correo,
						nombre: response?.response?.data?.json?.enviar_a,
						nombre_organizador: response?.response?.data?.json?.enviar_de,
						ubicacion: response?.response?.data?.json?.ubicacion,
						fecha: {desde: response?.response?.data?.json?.fecha_desde, hasta:response?.response?.data?.json?.fecha_hasta },
						descripcion: response?.response?.data?.json?.descripcion,
					})
					setResponse(response); 
					setIsSuccess(true); 
					setOpenGeneratedPass(true)
				},
			})
	};

	const handleClose = () => {
		onClose(); 
	};

	return (
		<Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
			<DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh] flex flex-col  " aria-describedby="">
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
								<Badge
								className={`text-white text-sm ${
									"Proceso".toLowerCase() == "proceso"
									? "bg-blue-600 hover:bg-blue-600"
									: "bg-gray-400"
								}`}
								>
								{capitalizeFirstLetter("Proceso")}
								</Badge>
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
												className="h-32 object-cover rounded-lg" 
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
												className="h-32 object-cover rounded-lg" 
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
						
						<div className="flex justify-between w-full h-full mb-2 mt-2">
							{data?.grupo_equipos.length > 0 ? (
								<Accordion type="single" collapsible className="w-full">
								<AccordionItem key={"1"} value={"1"}>
								<AccordionTrigger>{"Lista de equipos"}</AccordionTrigger>
								<AccordionContent className="mb-0 pb-0">
								{data?.grupo_equipos.length > 0 ? (
									<table className="min-w-full table-auto border-separate border-spacing-2">
									<thead>
										<tr>
										<th className="px-4 py-2 text-left border-b">Tipo</th>
										<th className="px-4 py-2 text-left border-b">Nombre</th>
										<th className="px-4 py-2 text-left border-b">Marca</th>
										<th className="px-4 py-2 text-left border-b">Modelo</th>
										<th className="px-4 py-2 text-left border-b">No. Serie</th>
										<th className="px-4 py-2 text-left border-b">Color</th>
										</tr>
									</thead>
									<tbody>
										{data?.grupo_equipos.map((item: Equipo, index: number) => (
										<tr key={index}>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.tipo) || ""}</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.nombre) || ""}</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.marca) || ""}</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.modelo) || ""}</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.serie) || ""}</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.color) || ""}</small></td>
										</tr>
										))}
									</tbody>
									</table>
								) : (
										<div>No se agregaron equipos.</div>
								)}
								</AccordionContent>
								</AccordionItem>
								</Accordion>
							):(<div>No se agregaron equipos.</div>)}
						</div>

						<div className="flex justify-between w-full h-full mb-2 mt-2">
							{data?.grupo_vehiculos.length > 0 ? (
								<Accordion type="single" collapsible className="w-full">
								<AccordionItem key={"1"} value={"1"}>
								<AccordionTrigger>{"Lista de vehículos"}</AccordionTrigger>
								<AccordionContent className="mb-0 pb-0">
								{data?.grupo_vehiculos.length > 0 ? (
									<table className="min-w-full table-auto border-separate border-spacing-2">
									<thead>
										<tr>
										<th className="px-4 py-2 text-left border-b">Tipo</th>
										<th className="px-4 py-2 text-left border-b">Marca</th>
										<th className="px-4 py-2 text-left border-b">Modelo</th>
										<th className="px-4 py-2 text-left border-b">Estado</th>
										<th className="px-4 py-2 text-left border-b">Placas</th>
										<th className="px-4 py-2 text-left border-b">Color</th>
										</tr>
									</thead>
									<tbody>
										{data?.grupo_vehiculos.map((item: Vehiculo, index: number) => (
										<tr key={index}>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.tipo) || ""}</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.marca) || ""}</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.modelo) || ""}</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.estado) || ""}</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.placas) || ""}</small></td>
											<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.color) || ""}</small></td>
										</tr>
										))}
									</tbody>
									</table>
								) : (
										<div>No se agregaron vehiculos.</div>
								)}
								</AccordionContent>
								</AccordionItem>
								</Accordion>
							):(<div>No se agregaron vehiculos.</div>)}
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					{/* <div>
						{isSubmitted && (radioSelected=="default" || radioSelected == "" ) &&
							<small className="text-red-500 ">* Acepta el aviso de privacidad y selecciona una opcion para la conservacion de tus datos personales</small>}
					</div> */}
					<div className="flex gap-2">
						<DialogClose asChild >
							<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700" onClick={handleClose}>
								Cancelar
							</Button>
						</DialogClose>
							<UpdatedPassModal
								title="Pase de Entrada Completado "
								description={""}
								openGeneratedPass={openGeneratedPass}
								hasEmail={data?.email ? true: false}
								hasTelefono={data?.telefono ? true: false}
								setOpenGeneratedPass={setOpenGeneratedPass} 
								qr={response?.json?.qr_pase[0].file_url ?? "/nouser.svg"}
								dataPass={responseformated}
								account_id={data?.account_id}
								folio={response?.json?.id}
								closePadre={handleClose}
								passData={passData}
								updateResponse={response}
								/>
						
							<Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" type="submit" onClick={onSubmit} disabled={isLoadingUpdate}>
								{!isLoadingUpdate ? ("Confirmar pase"):(<><Loader2 className="animate-spin"/>Actualizando pase...</>)}
							</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
