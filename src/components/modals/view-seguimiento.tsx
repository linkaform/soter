import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { formatDateToText } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

interface ViewSegModalProps {
  title: string;
  data:any
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}

export const ViewSeg: React.FC<ViewSegModalProps> = ({
  title,
  data,
  children,
  setIsSuccess,
  isSuccess,
}) => {

    return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-xl overflow-y-auto max-h-[80vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

		<div className="overflow-y-auto">
			<div className="flex justify-between">
				<div className="w-full flex flex-col gap-3 mb-2">
					<div className="w-full flex gap-2">
						<p className="font-bold">Fecha y hora: <span className="font-normal">{data?.fecha_inicio_seg ? formatDateToText(data?.fecha_inicio_seg.slice(0, -3)): ""}</span> </p>
					</div>
                    
					<div className="w-full flex gap-2">
                        <p className="font-bold ">Tiempo transcurrido: </p>
                        <p  className="font-normal">{data?.tiempo_transcurrido} </p>
					</div>

					<div className="w-full flex gap-2">
					    <p className="font-bold">Accion realizada: <span className="font-normal">{data?.accion_correctiva_incidencia}</span></p>
					</div> 

					<div className=" flex justify-between">
						<div className="w-full flex gap-2">
						<p className="font-bold">Incidencia Personas Involucradas: <span className="font-normal">{data?.incidencia_personas_involucradas}</span></p>
						</div>
					</div>
                    <div className="flex flex-col gap-2">
					<p className="font-bold ">Evidencia: </p>
                    {data?.incidencia_evidencia_solucion !== undefined && data?.incidencia_evidencia_solucion.length > 0 ?
						<div className="flex justify-center">
							<Carousel className="w-36 ">
								<CarouselContent>
									{data?.incidencia_evidencia_solucion.map((a:any, index:number) => (
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
								 
							</Carousel>
						</div>
					: (
						<p>No hay evidencia disponible</p>
					)}
					<p className="font-bold">Documentos:</p>
					{data?.incidencia_documento_solucion && data?.incidencia_documento_solucion.length > 0 ? (
					<div className="mt-5">
							<ul>
							{data.incidencia_documento_solucion.map((documento:any, index: number) => (
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
					</div>
					) : (
						<p>No hay documentos disponibles</p>
					)}
                    </div>
				</div>
					
			</div>
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
