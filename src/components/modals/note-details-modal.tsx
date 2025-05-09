import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import Image from 'next/image'
import React, { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Separator } from '../ui/separator'
import File from '../icon/file'
import { CloseNoteModal } from './close-note-modal'
import { Imagen } from '@/lib/update-pass-full'

interface NoteDetailsModalProps {
  title: string
  children: React.ReactNode
  note: Note
}

interface Note {
  note_open_date?: string
  folio: string
  note_comments?: NoteComment[]
  created_by_name?: string
  note_file?: Imagen[]
  note_status?: string
  note_pic?: any[]
  note?: string
  created_by_id?: number
  created_by_email?: string
  _id: string
}

interface NoteComment {
  note_comments: string
}

export const NoteDetailsModal: React.FC<NoteDetailsModalProps> = ({
  title,
  children,
  note,
}: NoteDetailsModalProps) => {

  const [open, setIsOpen]= useState(false)
  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='max-w-xl max-h-[90vh] overflow-scroll'>
        <DialogHeader>
          <DialogTitle className='text-2xl	 text-center  font-bold my-5'>
            {title}
          </DialogTitle>

          <Separator />

          <div className='flex justify-end '>
            <Badge>{note?.note_status ?? ''}</Badge>
          </div>
        </DialogHeader>
        {(note?.note_pic ?? []).length > 0 && (
          <Carousel className='flex justify-center'>
            <CarouselContent className='flex w-64'>
              {(note.note_pic ?? []).map((pic, index) => (
                <CarouselItem key={index} className='flex-shrink-0 w-full'>
                  <Image
                    src={pic.file_url}
                    alt={`Imagen ${index + 1}`}
                    width={300}
                    height={300}
                    className='object-cover'
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full'>
              Anterior
            </CarouselPrevious>
            <CarouselNext className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full'>
              Siguiente
            </CarouselNext>
          </Carousel>
        )}

        <CloseNoteModal title='Cerrar nota' note={note} setIsOpen={setIsOpen} isOpen={open}>
          <Button className='w-80 mx-auto bg-gray-100 hover:bg-gray-200 text-gray-700 mb-5'>
            Cerrar Nota
          </Button>
        </CloseNoteModal>

        <div className='mb-5'>
          <p className='font-semibold mb-2'>Comentarios</p>

          <ul className='list-disc list-inside space-y-1 text-gray-700'>
            {(note?.note_comments ?? []).map((comment, index) => (
              <li key={index} className='pl-1'>
                {comment.note_comments}
              </li>
            ))}
          </ul>
        </div>

        <p className='font-semibold'>Documentos</p>

        {(note?.note_file ?? []).length > 0 ? (
          <div className='flex flex-col items-center mb-5'>
            {note?.note_file?.map((file, index) => (
              <div
                key={index}
                className='flex flex-row justify-between items-center mb-5 w-full'>
                <div className='flex space-x-2'>
                  <div className=' bg-gray-100 p-3 rounded-lg'>
                    <File />
                  </div>

                  <div className='flex flex-col'>
                    <p className=''>Archivo {index + 1}</p>

                    <p className='text-sm'>{file.file_name}</p>
                  </div>
                </div>

                <a
                  href={file.file_url}
                  target='_blank'
                  rel='noopener noreferrer'>
                  <Button className='bg-gray-100 hover:bg-gray-200 text-gray-700'>
                    Descargar
                  </Button>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-sm text-gray-500 italic'>
            No se adjuntaron documentos.
          </p>
        )}

        <div className='flex justify-between mb-5'>
          <div className=''>
            <p className='font-semibold'>Creado el</p>
            <p className='text-sm'>{note?.note_open_date ?? ''}</p>
          </div>
        </div>

        <div className=''>
          <p className='font-semibold'>Reporta</p>

          <p className='text-sm'>{note?.created_by_name ?? ''}.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
