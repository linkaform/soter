/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Label } from "../ui/label";

interface NoteDetailsModalProps {
  title: string;
  noteData: {
    note_open_date: string;
    folio: string;
    note_comments: { note_comments: string }[];
    created_by_name: string;
    note_file: { file_name: string; file_url: string }[];
    note_status: string;
    note_pic: { file_name: string; file_url: string }[];
    note: string;
    created_by_email: string;
  };
  children: React.ReactNode;
}

export const NoteDetailsModal: React.FC<NoteDetailsModalProps> = ({
  title,
  children,
  noteData,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>

          <Separator />
          <div className="flex justify-end">
            <Badge
              className={`rounded-md text-base font-medium transition-colors ${
                noteData?.note_status === "abierto"
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {noteData?.note_status.charAt(0).toUpperCase() +
                noteData?.note_status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>




        {noteData?.note_pic?.length > 0 && (
          <Carousel className="flex justify-center">
            <CarouselContent className="flex w-64">
              {noteData.note_pic.map((pic, index) => (
                <CarouselItem key={index} className="flex-shrink-0 w-full">
                  <Image
                    src={pic.file_url}
                    alt={pic.file_name}
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
        )}

        <CloseNoteModal title="Cerrar nota">
          <Button className="w-80 mx-auto bg-gray-100 hover:bg-gray-200 text-gray-700 mb-5">
            Cerrar Nota
          </Button>
        </CloseNoteModal>

        {noteData?.note_comments?.length > 0 && (
          <div className="mb-5">
            <p className="font-semibold">Comentarios</p>
            {noteData.note_comments.map((comment, index) => (
              <p key={index} className="mb-2">
                {comment.note_comments}
              </p>
            ))}
          </div>
        )}

        {noteData?.note_file?.length > 0 && (
          <div className="mb-5">
            <p className="font-semibold">Documentos</p>
            {noteData.note_file.map((file, index) => (
              <div
                className="flex flex-row justify-between items-center mb-2"
                key={index}
              >
                <div className="flex space-x-2">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <File />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-medium">{`Archivo ${index + 1}`}</p>
                    <p className="text-sm text-blue-500 underline hover:text-blue-700">
                      {file.file_name}
                    </p>
                  </div>
                </div>
                <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                  <a
                    href={file.file_url}
                    download
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Descargar
                  </a>
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="mb-2">
          <p className="font-semibold">Creado el</p>

          <Label className="text-sm mr-3">
            {new Date(noteData?.note_open_date).toLocaleDateString("es-MX", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Label>
          <Label className="text-sm">
            {new Date(noteData?.note_open_date).toLocaleTimeString("es-MX")}
          </Label>
        </div>

        <div className="mb-5">
          <p className="font-semibold">Reporta</p>
          <p className="text-sm">{noteData?.created_by_name}</p>
          <p className="text-sm text-gray-500">{noteData?.created_by_email}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
