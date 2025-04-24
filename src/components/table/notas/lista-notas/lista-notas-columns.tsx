import { ColumnDef } from '@tanstack/react-table'
import { Check, Eye, Pencil } from 'lucide-react'
import { NoteDetailsModal } from '@/components/modals/note-details-modal'
import { CloseNoteModal } from '@/components/modals/close-note-modal'
import Image from 'next/image'
import { EditNoteModal } from '../../../modals/edit-note-modal'

interface NoteComments {
  note_comments: string
}

interface NoteFiles {
  file_name: string
  file_url: string
}

export interface ListaNota {
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

export const listaNotasColumns: ColumnDef<ListaNota>[] = [
  {
    id: 'select',
    header: '',
    cell: ({ row }: any) => (
      <div className='flex space-x-4'>
        <CloseNoteModal title='Cerrar nota' note={row.original}>
          <div className='cursor-pointer'>
            <Check />
          </div>
        </CloseNoteModal>

        <NoteDetailsModal title={row.original.note} note={row.original}>
          <div className='cursor-pointer'>
            <Eye />
          </div>
        </NoteDetailsModal>

        <EditNoteModal title='Editar nota' note={row.original}>
          <div className='cursor-pointer'>
            <Pencil />
          </div>
        </EditNoteModal>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'folio',
    header: 'Folio',
    cell: ({ row }: any) => (
      <div className='capitalize'>{row.getValue('folio')}</div>
    ),
  },
  {
    accessorKey: 'created_by_name',
    header: 'Empleado',
    cell: ({ row }: any) => (
      <div className='capitalize'>{row.getValue('created_by_name')}</div>
    ),
  },
  {
    accessorKey: 'note_open_date',
    header: 'Apertura',
    cell: ({ row }: any) => (
      <div className='capitalize'>{row.getValue('note_open_date')}</div>
    ),
  },
  {
    accessorKey: 'note_close_date',
    header: 'Cierre',
    cell: ({ row }: any) => (
      <div className='capitalize'>{row.getValue('note_close_date')}</div>
    ),
  },
  {
    accessorKey: 'note',
    header: 'Nota',
    cell: ({ row }: any) => (
      <div className='capitalize'>{row.getValue('note')}</div>
    ),
  },
  {
    accessorKey: 'note_file',
    header: 'Archivo',
    cell: ({ row }: any) => {
      const doc = row.getValue('note_file')
      const docUrl = doc?.[0]?.file_url
      const docName = doc?.[0]?.file_name

      return (
        <a
          href={docUrl}
          className='text-blue-500 underline hover:text-blue-700'
          download>
          {docName || 'No disponible'}
        </a>
      )
    },
  },
  {
    accessorKey: 'note_pic',
    header: 'Fotografía',
    cell: ({ row }: any) => {
      const pic = row.getValue('note_pic')
      const imageUrl = pic?.[0]?.file_url

      return imageUrl ? (
        <div className='relative h-24 w-28'>
          <Image
            src={imageUrl}
            alt='Fotografía'
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      ) : (
        <div>No hay imagen disponible</div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'note_comments',
    header: 'Comentarios',
    cell: ({ row }: any) => {
      const comments = row.getValue('note_comments') as
        | NoteComments[]
        | undefined

      if (!comments || comments.length === 0) {
        return <div>No hay comentarios</div>
      }

      return (
        <ul className='list-disc pl-4'>
          {comments.map((comment, index) => (
            <li key={index}>{comment.note_comments}</li>
          ))}
        </ul>
      )
    },
  },
]
