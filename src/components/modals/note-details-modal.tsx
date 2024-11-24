import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import File from "../icon/file";
import { CloseNoteModal } from "./close-note-modal";

interface NoteDetailsModalProps {
  title: string;
  children: React.ReactNode;
}

export const NoteDetailsModal: React.FC<NoteDetailsModalProps> = ({
  title,
  children,
}) => {
  const images = [
    "/image/carrusel1.png",
    "/image/carrusel2.png",
    "/image/carrusel3.png",
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>

          <Separator />

          <div className="flex justify-end ">
            <Badge
              className="rounded-md text-base font-medium"
              variant="secondary"
            >
              Pendiente
            </Badge>
          </div>
        </DialogHeader>

        <Carousel className="flex justify-center">
          <CarouselContent className="flex w-64">
            {images.map((src, index) => (
              <CarouselItem key={index} className="flex-shrink-0 w-full">
                <Image
                  src={src}
                  alt={`Imagen ${index + 1}`}
                  width={300}
                  height={300}
                  className="object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">
            Anterior
          </CarouselPrevious>
          <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full">
            Siguiente
          </CarouselNext>
        </Carousel>


        <CloseNoteModal title="Cerrar nota">


        <Button className="w-80 mx-auto bg-gray-100 hover:bg-gray-200 text-gray-700 mb-5">
          Cerrar Nota
        </Button>

        </CloseNoteModal>


        <div className="mb-5">
          <p className="font-semibold">Descripción</p>

          <p className="">
            Recibimos una entrega de suministros de seguridad. Favor de revisar
            el inventario y notificar cualquier discrepancia.
          </p>
        </div>

        <p className="font-semibold">Documentos</p>

        <div className="flex flex-row justify-between items-center mb-5">
          <div className="flex space-x-2">
            <div className=" bg-gray-100 p-3 rounded-lg">
              <File />
            </div>

            <div className="flex flex-col">
              <p className="">Archivo 1</p>

              <p className="text-sm">Inventario.pdf</p>
            </div>
          </div>

          <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700">
            Descargar
          </Button>
        </div>

        <div className="flex justify-between mb-5">
          <div className="">
            <p className="font-semibold">Creado el</p>

            <p className="text-sm">Martes 03/Junio/2024.</p>
          </div>

          <div className="">
            <p className="text-sm">14:30:02 hrs.</p>
          </div>
        </div>


        <div className="">
            <p className="font-semibold">Reporta</p>

            <p className="text-sm">Manuel silva cruz.</p>

      
        </div>




      </DialogContent>
    </Dialog>
  );
};
