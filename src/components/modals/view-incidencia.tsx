import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { Incidencia_record } from "../table/incidencias/incidencias-columns";
import { capitalizeFirstLetter, formatCurrency, formatDateToText } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { AccionesTomadas, Depositos, PersonasInvolucradas } from "@/lib/incidencias";

import { SeguimientoIncidenciaModal } from "./seguimiento-incidencia";
import { useState } from "react";
// import { Check } from "lucide-react";
// import { SeguimientoIncidenciaModal } from "./seguimiento-incidencia";

interface ViewFallaModalProps {
  title: string;
  data:Incidencia_record
  children: React.ReactNode;
}

export const ViewIncidencia: React.FC<ViewFallaModalProps> = ({
  title,
  data,
  children,
}) => {
	const [openModal, setOpenModal] = useState(false)
	
  function sumDepositos(item:Depositos[]){
    const sumaTotal = item.reduce((total: any, item: { cantidad: number; }) => total + item.cantidad, 0);
    return formatCurrency(sumaTotal)
  }
  return (
    <Dialog >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] flex flex-col" aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

		<div className="overflow-y-auto ">
			<div className="flex flex-between gap-2 ">
				<div className="w-full flex flex-col gap-3">
					<div className="w-full flex gap-2">
						<p className="font-bold flex flex-shrink-0">Fecha :</p>
						<p className="">{formatDateToText(data?.fecha_hora_incidencia.slice(0,-3))} </p>
					</div>
					<div className="w-full flex gap-2">
						<p className="font-bold ">Folio: </p>
						<p  className="font-bold text-blue-500">{data?.folio} </p>
					</div>
					<div className="w-full flex gap-2">
						<p className="font-bold">Ubicación: </p>
						<p >{data?.ubicacion_incidencia} </p>
					</div>
					<div className="w-full flex gap-2">
						<p className="font-bold">Area: </p>
						<p >{data?.area_incidencia} </p>
					</div>
					<div className="w-full flex gap-2 mb-2">
						<p className="font-bold">Incidencia: <span className="font-normal">{data?.incidencia}</span></p>
						
					</div>
				</div>	
				
				{data.evidencia_incidencia && data.evidencia_incidencia.length>0?(
					<>
					<div className="w-full">
					<div className="mx-auto max-w-xs">
						<p className="font-bold mb-2">Evidencia : </p>
						<Carousel className="w-36 max-w-xs">
							<CarouselContent>
								{data.evidencia_incidencia.map((a, index) => (
								<CarouselItem key={index}>
									<div className="p-1">
									<Card>
										<CardContent className="flex aspect-square items-center justify-center p-0">
										{/* <span className="text-4xl font-semibold"> */}
											<Image
												width={280}
												height={280}
												src= {a.file_url || "/nouser.svg"}
												alt="Imagen"
												className="w-42 h-42 object-contain bg-gray-200 rounded-lg" 
											/>
										{/* </span> */}
										</CardContent>
									</Card>
									</div>
								</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					</div>
				</div></>
				):(
					<>
					<div className="w-full flex gap-2">
						<div className="mx-auto max-w-xs">
							<p className="font-bold mb-2">Evidencia : </p>
							<p className="mb-2">No hay evidencias disponibles </p>
						</div>
					</div>
					</>
				)}
			</div>
			
			<div className="flex justify-between mb-2">
				<div className="w-full flex flex-col gap-3">
					<div className="w-full flex gap-2">
			<p className="font-bold ">Comentarios:</p>
			<p className="">{data?.comentario_incidencia} </p>
					</div>
					<div className="w-full flex gap-2">
			<p className="font-bold ">Prioridad: </p>
			<p className="text-red-500">{data?.prioridad_incidencia} </p>
					</div>
					<div className="w-full flex gap-2">
						<p className="font-bold">Tipo de daño: </p>
						<p >{data?.area_incidencia} </p>
					</div>
					<div className="w-full flex gap-2">
						<p className="font-bold">Notificaciones: </p>
						<p >{data?.notificacion_incidencia} </p>
					</div>
				</div>
				<div className="w-full flex gap-2">
				<div className="mx-auto max-w-xs">
					<p className="font-bold">Documentos:</p>
					{data?.documento_incidencia && data.documento_incidencia.length > 0 ? (
							<ul>
							{data.documento_incidencia.map((documento, index) => (
							<li key={index}>
							<a
								href={documento.file_url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 underline"
							>
								{documento.file_name}
							</a>
							</li>
							))}
							</ul>
						) : (
						<p>No hay documentos disponibles</p>
						)}
					</div >
				</div >
			</div>
			<Separator></Separator>
			{data.datos_deposito_incidencia.length>0 && data.incidente == "Depósitos y retiros de valores" ? 
			<>
				<div className="flex flex-col mt-2">
					<div className=" flex justify-between">
						{data.datos_deposito_incidencia.length > 0 ? (
						<Accordion type="single" collapsible className="w-full">
							<AccordionItem key={"1"} value={"1"}>
							<AccordionTrigger><h1 className="font-bold text-xl">Depósitos: </h1></AccordionTrigger>
							<AccordionContent className="mb-0 pb-0">
							{data.datos_deposito_incidencia.length > 0 ? (
							<>
							<table className="min-w-full table-auto border-separate border-spacing-2">
								<thead>
								<tr>
									<th className="px-4 py-2 text-left border-b">Cantidad</th>
									<th className="px-4 py-2 text-left border-b">Tipo dde depósito</th>
								</tr>
								</thead>
								<tbody>
								{data.datos_deposito_incidencia.map((item:Depositos, index: number) => (
									<tr key={index}>
									<td className="px-4 py-2"><p>{formatCurrency(item.cantidad) || "N/A"}</p></td>
									<td className="px-4 py-2"><p>{capitalizeFirstLetter(item.tipo_deposito) || "N/A"}</p></td>
									</tr>
								))}
								</tbody>
							</table>

							<div className="flex gap-2 items-center ml-5 mb-3">
							<span className="font-bold text-base">Total:</span>
							<span className="font-bold text-base">{sumDepositos(data.datos_deposito_incidencia)}</span>
							</div>
							</>
							) :null}
							</AccordionContent>
							</AccordionItem>
						</Accordion>
						):<div>No hay lista de depositos disponibles.</div>}
					</div>
				</div>
			</>
			:null}


			{data.personas_involucradas_incidencia.length>0? 
			<>
				<div className="flex justify-between w-full h-full mb-2">
					{data.personas_involucradas_incidencia.length > 0 ? (
						<Accordion type="single" collapsible className="w-full">
						<AccordionItem key={"1"} value={"1"}>
						<AccordionTrigger><h1 className="font-bold text-xl">Detalles de los involucrados: </h1></AccordionTrigger>
						<AccordionContent className="mb-0 pb-0">
						{data.personas_involucradas_incidencia.length > 0 ? (
							<table className="min-w-full table-auto border-separate border-spacing-2">
							<thead>
								<tr>
								<th className="px-4 py-2 text-left border-b">Nombre completo</th>
								<th className="px-4 py-2 text-left border-b">Tipo de persona</th>
								</tr>
							</thead>
							<tbody>
								{data.personas_involucradas_incidencia.map((item: PersonasInvolucradas, index: number) => (
								<tr key={index}>
									<td className="px-4 py-2"><p>{capitalizeFirstLetter(item.nombre_completo) || "N/A"}</p></td>
									<td className="px-4 py-2"><p>{capitalizeFirstLetter(item.tipo_persona) || "N/A"}</p></td>
								</tr>
								))}
							</tbody>
							</table>
						) : (
							null
						)}
						</AccordionContent>
						</AccordionItem>
						</Accordion>
					):(<div>No hay detalles d elos involucrados</div>)}
				</div>
			</>:null}

			<div className="flex justify-between w-full h-full ">
				{data.acciones_tomadas_incidencia.length > 0 ? (
					<Accordion type="single" collapsible className="w-full">
					<AccordionItem key={"1"} value={"1"}>
					<AccordionTrigger><h1 className="font-bold text-xl">Acciones Realizadas: </h1></AccordionTrigger>
					<AccordionContent className="mb-0 pb-0">
					{data.acciones_tomadas_incidencia.length > 0 ? (
						<table className="min-w-full table-auto border-separate border-spacing-2">
						<thead>
							<tr>
							<th className="px-4 py-2 text-left border-b">Acción realizada</th>
							<th className="px-4 py-2 text-left border-b">Responsable</th>
							</tr>
						</thead>
						<tbody>
							{data.acciones_tomadas_incidencia.map((item: AccionesTomadas, index: number) => (
							<tr key={index}>
								<td className="px-4 py-2"><p>{item.acciones_tomadas || "N/A"}</p></td>
								<td className="px-4 py-2"><p>{item.responsable_accion || "N/A"}</p></td>
							</tr>
							))}
						</tbody>
						</table>
					) : (
						null
					)}
					</AccordionContent>
					</AccordionItem>
					</Accordion>
				):(null)}
			</div>

			<div className="flex flex-col justify-between w-full h-full">
				{data.incidente == 	"Persona extraviada" ? (
					<>
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem key={"1"} value={"1"}>
							<AccordionTrigger><h1 className="font-bold text-xl">Persona extraviada </h1></AccordionTrigger>
							<AccordionContent className="mb-0 pb-0">
								<table className="min-w-full table-auto border-separate border-spacing-2">
									<tbody>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Nombre completo</p></td>
											<td className="px-4 py-2"><p>{data.nombre_completo_persona_extraviada || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Edad</p></td>
											<td className="px-4 py-2"><p>{data.edad || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Color de piel</p></td>
											<td className="px-4 py-2"><p>{data.color_piel || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Color de cabello</p></td>
											<td className="px-4 py-2"><p>{data.color_cabello || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Estatura aproximada</p></td>
											<td className="px-4 py-2"><p>{data.estatura_aproximada || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Descripcion física y vestimenta</p></td>
											<td className="px-4 py-2"><p>{data.descripcion_fisica_vestimenta || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2"><p>Información del responsable (reporta)</p></td>
											<td className="px-4 py-2"><p></p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Nombre completo</p></td>
											<td className="px-4 py-2"><p>{data.nombre_completo_responsable || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Parentesco</p></td>
											<td className="px-4 py-2"><p>{data.parentesco || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Número de documento de identidad</p></td>
											<td className="px-4 py-2"><p>{data.num_doc_identidad || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Teléfono</p></td>
											<td className="px-4 py-2"><p>{data.telefono || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>¿La información facilitada coincide con los videos?</p></td>
											<td className="px-4 py-2"><p>{data.info_coincide_con_videos || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Responsable que entraga</p></td>
											<td className="px-4 py-2"><p>{data.responsable_que_entrega || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Responsable que recibe</p></td>
											<td className="px-4 py-2"><p>{data.responsable_que_recibe || "N/A"}</p></td>
										</tr>
									</tbody>
								</table>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					</>
				):null}
			</div>


			<div className="flex flex-col justify-between w-full h-full">
				{data.incidente == 	"Robo de vehículo" ? (
					<>
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem key={"1"} value={"1"}>
							<AccordionTrigger><h1 className="font-bold text-xl">Robo de Vehículo: </h1></AccordionTrigger>
							<AccordionContent className="mb-0 pb-0">
								<table className="min-w-full table-auto border-separate border-spacing-2">
									<tbody>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Placas</p></td>
											<td className="px-4 py-2"><p>{ data.placas|| "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Tipo</p></td>
											<td className="px-4 py-2"><p>{data.tipo || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Marca</p></td>
											<td className="px-4 py-2"><p>{data.marca || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Modelo</p></td>
											<td className="px-4 py-2"><p>{data.modelo || "N/A"}</p></td>
										</tr>
										<tr>
											<td className="px-4 py-2 font-bold"><p>Color</p></td>
											<td className="px-4 py-2"><p>{data.color || "N/A"}</p></td>
										</tr>
									</tbody>
								</table>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					</>
				):null}
			</div>

			<div className="w-full flex justify-end items-center my-2">
				{/* <SeguimientoIncidenciaModal title="Seguimiento Incidencia" folio={data?.folio}>
					<Button className="bg-blue-500 hover:bg-blue-600 text-white">
						<Check /> Agregar seguimiento
					</Button>
				</SeguimientoIncidenciaModal> */}
				<div className="flex justify-end items-center">
					<div className="cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white mr-5 rounded-sm p-1 w-full text-center" onClick={()=>{setOpenModal(!openModal)}}>
						Agregar seguimiento 
					</div>
				</div>
				<SeguimientoIncidenciaModal
					title="Seguimiento Incidencia"
					folio={data?.folio}
					isSuccess={openModal}
					setIsSuccess={setOpenModal}
					>
					<div></div>
				</SeguimientoIncidenciaModal>
			</div>
			{data?.grupo_seguimiento_incidencia?.length > 0 ? (
				<div>
					<Accordion type="single" collapsible>
						<AccordionItem key={"1"} value={`1`}>
							<div className="flex justify-between">
								<AccordionTrigger>{`Seguimientos`}</AccordionTrigger>
							</div>
							<AccordionContent className="mb-0 pb-0">
								<table className="min-w-full table-auto border-separate border-spacing-2">
									<thead>
										<tr>
											<th className="px-4 py-2 text-left border-b">Acción realizada</th>
											<th className="px-4 py-2 text-left border-b">Comentario</th>
											<th className="px-4 py-2 text-left border-b">Fecha inicio</th>
											<th className="px-4 py-2 text-left border-b">Fecha fin</th>
											<th className="px-4 py-2 text-left border-b">Evidencia</th>
											<th className="px-4 py-2 text-left border-b">Documentos</th>
										</tr>
									</thead>
									<tbody>
										{data?.grupo_seguimiento_incidencia?.map((item: any, index: any) => (
											<tr key={index}>
												<td className="px-4 py-2"><p>{item?.accion_correctiva || "N/A"}</p></td>
												<td className="px-4 py-2"><p>{item?.comentario || "N/A"}</p></td>
												<td className="px-4 py-2"><p>{item?.fecha_inicio || "N/A"}</p></td>
												<td className="px-4 py-2"><p>{item?.fecha_fin || "N/A"}</p></td>
												<td className="px-4 py-2">
													{item?.evidencia.length > 0 ? (
														<div className="w-full flex justify-center">
															<Carousel className="w-16">
																<CarouselContent>
																	{item?.evidencia.map((a: any, index: number) => (
																		<CarouselItem key={index}>
																			<Card>
																				<CardContent className="flex aspect-square items-center justify-center p-0">
																					<Image
																						width={280}
																						height={280}
																						src={a?.file_url || "/nouser.svg"}
																						alt="Imagen"
																						className="w-42 h-42 object-contain bg-gray-200 rounded-lg"
																					/>
																				</CardContent>
																			</Card>
																		</CarouselItem>
																	))}
																</CarouselContent>
																<CarouselPrevious />
																<CarouselNext />
															</Carousel>
														</div>
													) : (
														<p>No hay evidencias disponibles.</p>
													)}
												</td>
												<td className="px-4 py-2">
													{item?.documento && item?.documento.length > 0 ? (
														<ul className="ms-2">
															{item?.documento.map((file: any, index: any) => (
																<li key={index}>
																	<a
																		href={file?.file_url}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-blue-600 hover:underline"
																	>
																		<p>{file.file_name}</p>
																	</a>
																</li>
															))}
														</ul>
													) : null}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			) : (null)}
		</div>
        
        <div className="flex gap-1 my-5 col-span-2">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cerrar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
