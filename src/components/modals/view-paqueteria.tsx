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
import { capitalizeFirstLetter, formatDateToText } from "@/lib/utils";
import { Paquete_record } from "../table/articulos/paqueteria/paqueteria-columns";

interface ViewFallaModalProps {
  title: string;
  data:Paquete_record
  isSuccess: boolean;
  children: React.ReactNode;
}

export const ViewPaqueteria: React.FC<ViewFallaModalProps> = ({
  title,
  data,
  children,
}) => {
  return (
    <Dialog modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl overflow-y-auto max-h-[80vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

		<div className="overflow-y-auto">
			<div className="flex justify-between">
				<div className="w-full flex flex-col gap-3 mb-2">
					<div className="w-full flex gap-2">
                        <p className="font-bold ">Folio: </p>
                        <p className="font-bold text-blue-500">{data?.folio} </p>
                    </div>
					<div className="w-full flex gap-2">
						<p className="font-bold">Descripcion: <span className="font-normal">{data?.descripcion_paqueteria}</span> </p>
						
					</div>

					<div className="w-full flex gap-2">
						<p className="font-bold">Fecha de recepción: <span className="font-normal">{formatDateToText(data?.fecha_recibido_paqueteria.slice(0, -3))}</span> </p>
					</div> 

					<div className="w-full flex gap-2">
					<p className="font-bold">Area : <span className="font-normal">{data?.area_paqueteria}</span></p>
					</div>

					<div className="w-full flex gap-2">
						<p className="font-bold">Ubicación:  <span className="font-normal">{data?.ubicacion_paqueteria}</span></p>
					</div>

					<div className=" flex justify-between">
						<div className="w-full flex gap-2">
						<p className="font-bold">Estatus : 
						{data?.estatus_paqueteria =="guardado"?(<span className="text-red-600"> {capitalizeFirstLetter( data?.estatus_paqueteria)}</span>):(
							<span className="text-green-600"> {capitalizeFirstLetter( data?.estatus_paqueteria)}</span>
						)}
						</p>
						</div>
					</div>
					<Separator className="my-2 w-74 mr-5"/>

                    <div className="w-full flex gap-2">
					<p className="font-bold">Proveedor: <span className="font-normal">{data?.proveedor}</span></p>
					</div> 


					<div className="w-full flex gap-2">
					<p className="font-bold">Guardado en: <span className="font-normal">{data?.guardado_en_paqueteria}</span></p>
					</div> 

					<div className=" flex justify-between">
						<div className="w-full flex gap-2">
						<p className="font-bold">Quien recibe: <span className="font-normal">{data?.quien_recibe_paqueteria}</span></p>
						</div>
					</div>
				</div>
				<div className="w-full">
					<p className="font-bold mb-2">Evidencia: </p>
					<div className="flex justify-center">
						<Carousel className="w-36 ">
							<CarouselContent>
								{data.fotografia_paqueteria?.map((a, index) => (
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
				</div>
			</div>

			<Separator className="" />
			
			<div className="flex flex-col justify-between my-2">
				<div className="w-full">
					<h1 className="font-bold text-xl">Información de la entrega </h1>
				</div>     
				<div className="w-full flex flex-col space-y-5 mt-2">
					<div className=" flex justify-between">
						<div className="w-full flex gap-2">
						<p className="font-bold">Entregado a: <span className="font-normal">{data?.entregado_a_paqueteria}</span></p>
						</div>
					</div>

                    <div className=" flex justify-between">
						<div className="w-full flex gap-2">
						<p className="font-bold">Fecha en que se realizo la entrega: <span className="font-normal">{formatDateToText(data?.fecha_recibido_paqueteria.slice(0, -3))}</span></p>
						</div>
					</div>
				</div>
			</div>
		</div>

        <div className="flex  gap-1 my-5">
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
