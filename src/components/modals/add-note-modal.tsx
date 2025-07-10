import React, { useEffect } from 'react'
import LoadImage from '../upload-Image'
import LoadFile from '../upload-file'
import { Input } from '../ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Textarea } from '../ui/textarea'
import { useNotes } from '@/hooks/useNotes'
import { useShiftStore } from '@/store/useShiftStore'
import { useState } from 'react'
import { Imagen } from '@/lib/update-pass'
import { Button } from '../ui/button'
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

interface AddNoteModalProps {
  title: string
  children: React.ReactNode
}

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Campo requerido.',
  }),
  description: z.string().min(2, {
    message: 'Campo requerido.',
  }),
})

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  title,
  children,
}: AddNoteModalProps) => {
  const [evidencia, setEvidencia] = useState<Imagen[]>([])
  const [documento, setDocumento] = useState<Imagen[]>([])
  const [open, setOpen] = useState(false)
  const { area, location } = useShiftStore()
  const { createNoteMutation, isLoadingNotes } = useNotes(false,area, location)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  useEffect(()=>{
    setEvidencia([])
    setDocumento([])
  }, [])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formatData = {
      note: values.title,
      note_comments: [values.description],
      note_booth: area,
      note_status: 'abierto',
      note_file: documento,
      note_pic: evidencia,
      note_guard_close: '',
    }
    createNoteMutation.mutate(
      { location, area, data_notes: formatData },
      {
        onSuccess: () => {
          if (open) {
            setOpen(false)
          }
          form.reset()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild>{children}</DialogTrigger>
     	<DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl px-4 py-6 overflow-y-auto max-h-[90vh] flex flex-col" aria-describedby="">
            <DialogHeader className="flex-shrink-0">
				<DialogTitle className="text-2xl text-center font-bold">
					{title}
				</DialogTitle>
				<DialogDescription id='add-note-description'>
					Completa los campos para agregar una nueva nota.
				</DialogDescription>
            </DialogHeader>
        <div className="flex-grow overflow-y-auto p-4">
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
						<FormLabel>* Comentarios</FormLabel>
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

			
				</form>
			</Form>
        </div>
        <div className='flex gap-2'>
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
				Agregando...
				</>
			) : (
				'Agregar'
			)}
			</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
