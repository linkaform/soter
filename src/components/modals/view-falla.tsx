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
import { FallaGrupoSeguimiento, Fallas_record } from "../table/incidencias/fallas/fallas-columns";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { capitalizeFirstLetter, formatDateToText } from "@/lib/utils";
import { Imagen } from "@/lib/update-pass";
import { SeguimientoFallaModal } from "./seguimiento-falla";

interface ViewFallaModalProps {
  title: string;
  data:Fallas_record
  isSuccess: boolean;
  children: React.ReactNode;
}

export const ViewFalla: React.FC<ViewFallaModalProps> = ({
  title,
  data,
  children,
}) => {
  const seguimientos = data.falla_grupo_seguimiento_formated || []
  return (
    <Dialog modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] flex flex-col" aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

		<div className="overflow-y-auto">
			<div className="flex justify-between">
				<div className="w-full flex flex-col gap-3 mb-2">
					<div className="w-full flex gap-2">
						<p className="font-bold">Concepto: <span className="font-normal">{data?.falla}</span> </p>
						
					</div>
					{data?.falla_objeto_afectado ? ( 
						<div className="w-full flex gap-2">
							<p className="font-bold">Subconcepto: <span className="font-normal">{data?.falla_objeto_afectado}</span></p>
						</div>
					):null}

					<div className="w-full flex gap-2">
						<p className="font-bold">Fecha de la falla: <span className="font-normal">{formatDateToText(data?.falla_fecha_hora.slice(0, -3))}</span> </p>
					</div> 

					<div className="w-full flex gap-2">
					<p className="font-bold">Area : <span className="font-normal">{data?.falla_caseta}</span></p>
					</div>

					<div className="w-full flex gap-2">
						<p className="font-bold">Ubicación:  <span className="font-normal">{data?.falla_ubicacion}</span></p>
					</div>

					<div className=" flex justify-between">
						<div className="w-full flex gap-2">
						<p className="font-bold">Estatus : 
						{data?.falla_estatus =="abierto"?(<span className="text-green-600"> {capitalizeFirstLetter( data?.falla_estatus)}</span>):(
							<span className="text-green-600"> {capitalizeFirstLetter( data?.falla_estatus)}</span>
						)}
						</p>
						</div>
					</div>
					<Separator className="my-2 w-74 mr-5"/>
					<div className="w-full flex gap-2">
					<p className="font-bold">Comentario: <span className="font-normal">{data?.falla_comentarios}</span></p>
					</div> 

					<div className=" flex justify-between">
						<div className="w-full flex gap-2">
						<p className="font-bold">Reporta: <span className="font-normal">{data?.falla_reporta_nombre}</span></p>
						</div>
					</div>
				</div>
				<div className="w-full flex flex-col">
					<p className="font-bold mb-2">Evidencia: </p>
					<div className="flex justify-center">
						<Carousel className="w-36 ">
							<CarouselContent>
								{data.falla_evidencia.map((a, index) => (
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
					<div className="mt-5">
						<p className="font-bold">Documentos:</p>
						{data?.falla_documento && data.falla_documento.length > 0 ? (
							<ul>
							{data.falla_documento.map((documento, index) => (
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
					</div>
				</div>
			</div>

			<Separator className="" />
			
			<div className="flex justify-between my-2">
				<div className="w-full">
					<h1 className="font-bold text-xl">Información de la solucion </h1>
				</div>     
				<div className="w-full flex flex-col space-y-5">
					<div className=" flex justify-between">
						<div className="w-full flex gap-2">
						<p className="font-bold">Responsable: <span className="font-normal">{data?.falla_responsable_solucionar_nombre}</span></p>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-end items-center">
				<div className="cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white mr-5 rounded-sm p-1 w-1/4 text-center">
					Agregar seguimiento 
				</div>
			</div>
			<SeguimientoFallaModal
					title="Seguimiento Falla"
					data={[]} >
					<div></div>
			</SeguimientoFallaModal>
			{seguimientos.length > 0 ? (
			<div className="">
			{/* <p className=" font-bold mb-2">Seguimientos:</p> */}
			<Accordion type="single" collapsible>
			{/* {seguimientos.map((item:FallaGrupoSeguimiento, index:number) => ( */}
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
					{seguimientos.map((item: FallaGrupoSeguimiento, index: number) => (
					<tr key={index}>
						<td className="px-4 py-2"><small>{item.accion_correctiva || "N/A"}</small></td>
						<td className="px-4 py-2"><small>{item.comentario || "N/A"}</small></td>
						<td className="px-4 py-2"><small>{item.fecha_inicio || "N/A"}</small></td>
						<td className="px-4 py-2"><small>{item.fecha_fin || "N/A"}</small></td>
						<td className="px-4 py-2">
						{item.evidencia.length > 0 ? (
							<div className="w-full flex justify-center">
							<Carousel className="w-16">
								<CarouselContent>
								{item.evidencia.map((a: Imagen, index: number) => (
									<CarouselItem key={index}>
									<Card>
										<CardContent className="flex aspect-square items-center justify-center p-0">
										<Image
											width={280}
											height={280}
											src={a.file_url || "/nouser.svg"}
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
							<small>No hay evidencias disponibles.</small>
						)}
						</td>
						<td className="px-4 py-2">
						{item.documento && item.documento.length > 0 ? (
							<ul className="ms-2">
							{item.documento.map((file, index) => (
								<li key={index}>
								<a
									href={file.file_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									<small>{file.file_name}</small>
								</a>
								</li>
							))}
							</ul>
						) : (
							<small>No hay archivos disponibles.</small>
						)}
						</td>
					</tr>
					))}
				</tbody>
				</table>
				</AccordionContent>
				</AccordionItem>
			{/* ))} */}
			</Accordion>
			</div>
			):(<div>No hay seguimientos disponibles.</div>)}
		</div>

        <div className="flex  gap-1 my-5">
          <DialogClose asChild>
            <Button className="w-1/2  bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cerrar
            </Button>
          </DialogClose>
          {/* <Button className="w-1/2  bg-blue-500 hover:bg-blue-600 text-white">
              Cerrar falla
            </Button> */}
        </div>
        </DialogContent>
    </Dialog>
  );
};
