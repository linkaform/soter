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
import { Dispatch, SetStateAction, useState } from 'react'
import { Imagen } from '@/lib/update-pass-full'

interface CloseNoteModalProps {
  title: string
  children: React.ReactNode
  note: Note
  setIsOpen?:Dispatch<SetStateAction<boolean>>;
  isOpen?:boolean
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



const formSchema = z.object({})

export const CloseNoteModal: React.FC<CloseNoteModalProps> = ({
  title,
  children,
  note,
  isOpen,
  setIsOpen
}: CloseNoteModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const [open, setOpen] = useState(false)
  const { closeNoteMutation, isLoadingNotes } = useNotes(false,'', '')

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
          if(isOpen && setIsOpen)
            setIsOpen(false)
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
          <p className='text-sm'>{note?.created_by_name ?? ''}</p>
          <p className='font-semibold'>Nota:</p>
          <p className='text-sm'>{note?.note ?? ''}</p>
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
                disabled={isLoadingNotes}
                className='w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2'>
                {isLoadingNotes ? (
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
