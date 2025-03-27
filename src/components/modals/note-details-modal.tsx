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
import { Note } from "@/hooks/useGetNotes";

interface NoteDetailsModalProps {
  title: string;
  children: React.ReactNode;
  note: Note;
}

export const NoteDetailsModal: React.FC<NoteDetailsModalProps> = ({
  title,
  children,
  note,
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

          <div className="flex justify-end ">
            <Badge
              className="rounded-md text-base font-medium"
              variant="secondary"
            >
              {note?.note_status || "Pendiente"}
            </Badge>
          </div>
        </DialogHeader>

        {/* 🔥 Renderizar imágenes del carrusel */}
        {note?.note_pic?.length > 0 && (
          <Carousel className="flex justify-center">
            <CarouselContent className="flex w-64">
              {note.note_pic.map((pic, index) => (
                <CarouselItem key={index} className="flex-shrink-0 w-full">
                  <Image
                    src={pic.file_url}
                    alt={`Imagen ${index + 1}`}
                    width={300}
                    height={300}
                    className="object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}

        <CloseNoteModal note={note} folio={note?.folio} title="Cerrar Nota">
          <Button className="w-80 mx-auto bg-gray-100 hover:bg-gray-200 text-gray-700 mb-2">
            Cerrar Nota
          </Button>
        </CloseNoteModal>

        {/* Documentos adjuntos */}
        {note?.note_file?.length > 0 && (
          <>
            <p className="font-semibold">Documentos</p>
            {note.note_file.map((file, index) => (
              <div
                key={index}
                className="flex flex-row justify-between items-center mb-5"
              >
                <div className="flex space-x-2">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <File />
                  </div>
                  <div className="flex flex-col">
                    <p>Archivo {index + 1}</p>
                    {/* 🔥 Enlace azul y subrayado que permite descargar */}
                    <a
                      href={file?.file_url}
                      download
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      {file?.file_name}
                    </a>
                  </div>
                </div>
                {/* 🔥 Botón de descarga */}
                <a
                  href={file?.file_url}
                  download
                  rel="noopener noreferrer"
                >
                  <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700">
                    Descargar
                  </Button>
                </a>
              </div>
            ))}
          </>
        )}

        <div className="flex justify-between mb-2">
          <div className="">
            <p className="font-semibold">Creado el</p>

            <p className="text-sm">{note?.note_open_date}</p>
          </div>
        </div>

        <div>
          <p className="font-semibold">Reporta</p>
          <p className="text-sm">{note?.created_by_name || "Desconocido"}</p>
        </div>

        {/* Comentarios */}
        {note?.note_comments?.length > 0 && (
          <div className="mt-5">
            <p className="font-semibold mb-2">Comentarios</p>
            {note.note_comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-300 pb-2 mb-2">
                <p>
                  {Array.isArray(comment.note_comments)
                    ? comment.note_comments.join(", ")
                    : comment.note_comments}
                </p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};