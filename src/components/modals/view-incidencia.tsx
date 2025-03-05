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
import { formatDateToText } from "@/lib/utils";

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
  return (
    <Dialog >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold ">
            {title}
          </DialogTitle>
        </DialogHeader>

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
                    <Carousel className="w-48 max-w-xs">
                        <CarouselContent>
                            {data.evidencia_incidencia.map((a, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-6">
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

        <div className="flex justify-between">
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
		<div className="flex flex-col space-y-5">
			<div className=" flex justify-between">
				<div className="w-full flex gap-2">
				<p className="font-bold">Depositos : </p>
				<p className=""></p>
				</div>
				<div className="w-full flex gap-2">
				<p className="font-bold">Total : </p>
				<p className=""></p>
				</div>
			</div>
        </div>
        <Separator></Separator>
        <div><h1 className="font-bold text-xl">Detalles de los involucrados: </h1></div> 
            <div className=" flex justify-between">
                <div className="w-full ">
                <p className="font-bold">Personas Involucradas : </p>
                <p className=""> </p>
                </div>

                <div className="w-full ">
                <p className="font-bold">Acciones tomadas : </p>
                <p className=""></p>
                </div>
            </div>

        <div className="flex gap-1 my-5">
          <DialogClose asChild>
            <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
