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
import { Articulo_perdido_record } from "../table/articulos/pendientes/pendientes-columns";

interface ViewArtModalProps {
  title: string;
  data:Articulo_perdido_record
  isSuccess: boolean;
  children: React.ReactNode;
}

export const ViewArticulo: React.FC<ViewArtModalProps> = ({
  title,
  data,
  children,
}) => {
  return (
    <Dialog >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between">
            <div className="w-full flex flex-col gap-3">
                {data?.articulo_seleccion ? ( 
                  <div className="w-full flex gap-2">
                      <p className="font-bold">Articulo: <span className="font-normal">{data?.articulo_seleccion}</span></p>
                  </div>
                ):null}

                <div className="w-full flex gap-2">
                  <p className="font-bold">Color: <span className="font-normal">{data?.color_perdido}</span> </p>
                </div>

                <div className="w-full flex gap-2">
                  <p className="font-bold">Categoria: <span className="font-normal">{data?.tipo_articulo_perdido}</span> </p>
                </div> 

                <div className="w-full flex gap-2">
                <p className="font-bold">Descripcion : <span className="font-normal">{data?.descripcion}</span></p>
                </div>

                <div className=" flex justify-between">
                    <div className="w-full flex gap-2">
                    <p className="font-bold">Estatus : 
                  { data?.estatus_perdido =="donado"|| data?.estatus_perdido =="entregado"?(<span className="text-green-600"> {capitalizeFirstLetter( data?.estatus_perdido)}</span>):(
                      <span className="text-red-600"> {capitalizeFirstLetter( data?.estatus_perdido)}</span>
                    )}
                    </p>
                    </div>
                </div>

                <div className="w-full flex gap-2">
                <p className="font-bold">Comentario: <span className="font-normal">{data?.comentario_perdido}</span></p>
                </div> 

                <Separator className="my-2 w-74 mr-5"/>
               

                <div className="w-full flex gap-2">
                  <p className="font-bold">Fecha del hallazgo: <span className="font-normal">{formatDateToText(data?.date_hallazgo_perdido.slice(0, -3))}</span> </p>
                </div> 

                <div className="w-full flex gap-2">
                <p className="font-bold">Ubicacion: <span className="font-normal">{data?.ubicacion_perdido}</span> </p>
                </div>

                <div className="w-full flex gap-2">
                    <p className="font-bold">Area: <span className="font-normal">{data?.area_perdido}</span> </p>
                </div>

                <div className="w-full flex gap-2">
                    <p className="font-bold">Reporta: <span className="font-normal">{data?.quien_entrega}</span> </p>
                </div>

            </div>
            <div className="w-full flex flex-col">
                <p className="font-bold mb-2">Evidencia: </p>
                <div className="flex justify-center">
                  <Carousel className="w-36 ">
                      <CarouselContent>
                          {data.foto_perdido.map((a, index) => (
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
            <div className="w-full flex gap-2">
                    <h1 className="font-bold text-xl">Información de la Entrega </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="w-full flex gap-2">
                <p className="font-bold">Recibe: <span className="font-normal">{data?.recibe_perdido}</span> </p>
            </div>
            
            <div className="w-full flex gap-2">
                <p className="font-bold">Fecha de la entrega: <span className="font-normal">{data?.date_entrega_perdido ? formatDateToText(data?.date_entrega_perdido.slice(0, -3)):""}</span> </p>
            </div>

            <div className="w-full flex gap-2">
                <p className="font-bold">Interno: <span className="font-normal">{data?.quien_entrega_interno}</span></p>
            </div>

            <div className="w-full flex gap-2">
                <p className="font-bold">Externo: <span className="font-normal">{data?.quien_entrega_externo}</span></p>
            </div>

            <div className="w-full flex gap-2">
                <p className="font-bold">Area de resguardo: <span className="font-normal">{data?.locker_perdido}</span></p>
            </div>
            </div>
          

        <div className="flex  gap-1 my-5">
          <DialogClose asChild>
            <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cerrar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
