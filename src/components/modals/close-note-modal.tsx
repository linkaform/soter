import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Form } from '../ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useNotes } from '@/hooks/useNotes'
import { useState } from 'react'

interface CloseNoteModalProps {
  title: string
  children: React.ReactNode
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

const formSchema = z.object({})

export const CloseNoteModal: React.FC<CloseNoteModalProps> = ({
  title,
  children,
  note,
}: CloseNoteModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const [open, setOpen] = useState(false)
  const { closeNoteMutation, isLoading } = useNotes('', '')

  function onSubmit() {
    const currentDate = new Date()

    const mexicoTime = new Date(
      currentDate.toLocaleString('en-US', { timeZone: 'America/Mexico_City' })
    )

    const formattedDate =
      mexicoTime.getFullYear() +
      '-' +
      String(mexicoTime.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(mexicoTime.getDate()).padStart(2, '0') +
      ' ' +
      String(mexicoTime.getHours()).padStart(2, '0') +
      ':' +
      String(mexicoTime.getMinutes()).padStart(2, '0') +
      ':' +
      String(mexicoTime.getSeconds()).padStart(2, '0')

    const formatData = {
      data_update: {
        note_close_date: formattedDate,
        note_status: 'cerrado',
      },
      folio: note.folio,
    }
    closeNoteMutation.mutate(
      { close_note: formatData },
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

      <DialogContent className='max-w-xl' aria-describedby='static-description'>
        <DialogHeader>
          <DialogTitle className='text-2xl text-center font-bold my-5'>
            {title}
          </DialogTitle>
        </DialogHeader>
        <p id='static-description' className='text-center text-gray-700'>
          ¿Estás seguro que deseas cerrar la nota?
        </p>

        <div className='flex flex-col gap-2'>
          <p className='font-semibold'>Reporta</p>
          <p className='text-sm'>{note?.created_by_name ?? ''}.</p>
          <p className='font-semibold'>Nota:</p>
          <p className='text-sm'>{note?.note ?? ''}.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='flex gap-5'>
              <DialogClose asChild>
                <Button className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700'>
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2'>
                {isLoading ? (
                  <>
                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                    Cerrando...
                  </>
                ) : (
                  'Cerrar nota'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
