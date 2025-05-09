import React from 'react'
import LoadImage from '../upload-Image'
import LoadFile from '../upload-file'
import { Input } from '../ui/input'
import { z } from 'zod'
import File from '../icon/file'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Textarea } from '../ui/textarea'
import { useNotes } from '@/hooks/useNotes'
import { useState } from 'react'
import { Imagen } from '@/lib/update-pass'
import { Button } from '../ui/button'
import Image from 'next/image'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel'

interface EditNoteModalProps {
  title: string
  children: React.ReactNode
  open?: boolean
  setOpen?: (open: boolean) => void
  note: Note
}

interface Note {
  _id: string
  folio: string
  created_by_name: string
  note_status: string
  note_open_date: string
  note: string
  note_close_date?: string
  note_file?: NoteFiles[]
  note_pic?: NoteFiles[]
  note_comments?: NoteComments[]
}

interface NoteComments {
  note_comments: string
}

interface NoteFiles {
  file_name: string
  file_url: string
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Campo requerido.',
  }),
  description: z.string().min(2, {
    message: 'Campo requerido.',
  }),
})

export const EditNoteModal: React.FC<EditNoteModalProps> = ({
  title,
  children,
  note,
}: EditNoteModalProps) => {
  const [open, setOpen] = useState(false)
  const [evidencia, setEvidencia] = useState<Imagen[]>([])
  const [documento, setDocumento] = useState<Imagen[]>([])

  const { editNoteMutation ,isLoadingNotes} = useNotes(false,'', '')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const { note_pic, note_comments, note_file, folio } = note

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formatData = {
      data_update: {
        note: values.title,
        note_comments: [values.description],
        note_file: documento,
        note_pic: evidencia,
      },
      folio: folio,
    }
    editNoteMutation.mutate(
      { update_note: formatData },
      {
        onSuccess: () => {
          setOpen(false)
          form.reset()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className='max-w-xl max-h-[80vh] overflow-y-auto'
        aria-describedby='edit-note-description'>
        <DialogHeader>
          <DialogTitle className='text-2xl text-center font-bold my-5'>
            {title}
          </DialogTitle>
          <DialogDescription id='edit-note-description'>
            Completa los campos para agregar una nueva nota.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>* Nota</FormLabel>
                  <FormControl>
                    <Input placeholder='Texto' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <p>Fotos cargadas </p>
            </div>
            {note_pic && note_pic.length > 0 && (
              <Carousel className='flex justify-center'>
                <CarouselContent className='flex w-64'>
                  {note_pic.map((pic, index) => (
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
            <div>
              <p>Archivos cargados </p>
            </div>
            {note_file && note_file.length > 0 ? (
              <div className='flex flex-col items-center mb-5'>
                {note_file.map((file, index) => (
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
            <div className='mb-5'>
              <p className='font-semibold mb-2'>Comentarios cargados</p>

              <ul className='list-disc list-inside space-y-1 text-gray-700'>
                {note_comments?.map((comment, index) => (
                  <li key={index} className='pl-1'>
                    {comment.note_comments}
                  </li>
                ))}
              </ul>
            </div>

            <div className='flex justify-between'>
              <LoadImage
                id='evidencia'
                titulo={'Agregar foto'}
                setImg={setEvidencia}
                showWebcamOption={true}
                facingMode='environment'
                imgArray={evidencia}
                showArray={true}
                limit={10}
              />
            </div>

            <div className='flex justify-between'>
              <LoadFile
                id='documento'
                titulo={'Subir un archivo'}
                setDocs={setDocumento}
                docArray={documento}
                limit={10}
              />
            </div>

            <FormField
              control={form.control}
              name='description'
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel>* Comentario</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Texto'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className='text-gray-400'>**Campos requeridos </p>

            <div className='flex gap-5'>
              <DialogClose asChild>
                <Button className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700'>
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type='submit'
                disabled={isLoadingNotes}
                className='w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2'>
                {isLoadingNotes ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Editando...
                  </>
                ) : (
                  'Editar'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
