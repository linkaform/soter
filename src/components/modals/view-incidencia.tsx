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

interface ViewFallaModalProps {
  title: string;
  data:Incidencia_record
  isSuccess: boolean;
  children: React.ReactNode;
}

export const ViewIncidencia: React.FC<ViewFallaModalProps> = ({
  title,
  data,
  children,
}) => {

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
						<p className="font-bold">Ubicación: </p>
						<p >{data?.ubicacion_incidencia} </p>
					</div>
					<div className="w-full flex gap-2">
						<p className="font-bold">Area: </p>
						<p >{data?.area_incidencia} </p>
					</div>
					<div className="w-full flex gap-2">
						<p className="font-bold">Incidencia: </p>
						<p >{data?.incidencia} </p>
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
			<div className="flex flex-col space-y-5 mt-2">
		<h1 className="font-bold text-xl">Depósitos: </h1>
				<div className=" flex justify-between">
					{data.datos_deposito_incidencia.length > 0 ? (
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem key={"1"} value={"1"}>
						<AccordionTrigger>{`Depósitos`}</AccordionTrigger>
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
								<td className="px-4 py-2"><small>{formatCurrency(item.cantidad) || "N/A"}</small></td>
								<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.tipo_deposito) || "N/A"}</small></td>
								</tr>
							))}
							</tbody>
						</table>

						<div className="flex gap-2 items-center ml-5 mb-3">
						<span className="font-bold text-base">Total:</span>
						<span className="font-bold text-base">{sumDepositos(data.datos_deposito_incidencia)}</span>
						</div>
						</>
						) : (
						<div>No hay lista de depositos disponibles.</div>
						)}
						</AccordionContent>
						</AccordionItem>
					</Accordion>
					):(<div>No hay lista de depositos disponibles.</div>)}
				</div>
			</div>
			<div className="mb-2 mt-2">
			<h1 className="font-bold text-xl">Detalles de los involucrados: </h1>
			</div> 
			<div className="flex justify-between w-full h-full mb-2">
				{data.personas_involucradas_incidencia.length > 0 ? (
					<Accordion type="single" collapsible className="w-full">
					<AccordionItem key={"1"} value={"1"}>
					<AccordionTrigger>{`Personas Involucradas`}</AccordionTrigger>
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
								<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.nombre_completo) || "N/A"}</small></td>
								<td className="px-4 py-2"><small>{capitalizeFirstLetter(item.tipo_persona) || "N/A"}</small></td>
							</tr>
							))}
						</tbody>
						</table>
					) : (
						<div>No hay lista de personas involucradas disponible.</div>
					)}
					</AccordionContent>
					</AccordionItem>
					</Accordion>
				):(<div>No hay lista de personas involucradas disponible.</div>)}
			</div>
			<div className="flex justify-between w-full h-full ">
				{data.acciones_tomadas_incidencia.length > 0 ? (
					<Accordion type="single" collapsible className="w-full">
					<AccordionItem key={"1"} value={"1"}>
					<AccordionTrigger>{`Acciones Realizadas`}</AccordionTrigger>
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
								<td className="px-4 py-2"><small>{item.acciones_tomadas || "N/A"}</small></td>
								<td className="px-4 py-2"><small>{item.responsable_accion || "N/A"}</small></td>
							</tr>
							))}
						</tbody>
						</table>
					) : (
						<div>No hay acciones disponibles.</div>
					)}
					</AccordionContent>
					</AccordionItem>
					</Accordion>
				):(<div>No hay acciones disponibles.</div>)}
			</div>
		</div>
        
        <div className="flex gap-1 my-5">
          <DialogClose asChild>
            <Button className="w-full  bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
