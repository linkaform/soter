import { ColumnDef } from '@tanstack/react-table'
import { Check, Eye, Pencil } from 'lucide-react'
import { NoteDetailsModal } from '@/components/modals/note-details-modal'
import { CloseNoteModal } from '@/components/modals/close-note-modal'
import { EditNoteModal } from '../../../modals/edit-note-modal'
import ViewImage from '@/components/modals/view-image'

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
    cell: ({ row }: any) => {
      return (
        <div className='flex space-x-4'>
        {row.original.note_status !== "cerrado" ? (
          <CloseNoteModal title='Cerrar Nota' note={row.original}>
            <div className='cursor-pointer'>
              <Check />
            </div>
          </CloseNoteModal>
        ):null}
  
          <NoteDetailsModal title={row.original.note} note={row.original}>
            <div className='cursor-pointer'>
              <Eye />
            </div>
          </NoteDetailsModal>
        {row.original.note_status !== "cerrado" ? (
            <EditNoteModal title='Editar Nota' note={row.original}>
              <div className='cursor-pointer'>
                <Pencil />
              </div>
            </EditNoteModal>
        ):null}
          
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'folio',
    header: 'Folio',
    cell: ({ row }: any) => (
      <div className='capitalize'>{row.getValue('folio')}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'created_by_name',
    header: 'Empleado',
    cell: ({ row }: any) => (
      <div className='capitalize'>{row.getValue('created_by_name')}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'note_open_date',
    header: 'Apertura',
    cell: ({ row }: any) => (
      <div className='capitalize'>{row.getValue('note_open_date')}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'note_close_date',
    header: 'Cierre',
    cell: ({ row }: any) => (
      <div className='capitalize'>{row.getValue('note_close_date')}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'note',
    header: 'Nota',
    cell: ({ row }: any) => (
      <div className='capitalize'>{row.getValue('note')}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'note_file',
    header: 'Archivo',
    cell: ({ row }: any) => {
      const doc = row.getValue('note_file');
      const docUrl = doc?.[0]?.file_url;
      const docName = doc?.[0]?.file_name;
  
      if (docUrl && docName) {
        return (
          <a
            href={docUrl}
            className='text-blue-500 underline hover:text-blue-700'
            download
          >
            {docName}
          </a>
        );
      }
  
      return (
        <span className='text-gray-400 cursor-not-allowed'>
          No disponible
        </span>
      );
    },
  },
  {
    accessorKey: 'note_pic',
    header: 'Fotografía',
    cell: ({ row }: any) => {
      const pic = row.getValue('note_pic')
      const imageUrl = pic?.[0]?.file_url
      return imageUrl ? (
        <ViewImage imageUrl={pic ?? []} /> 
      ) : (
        <div>No hay imagen disponible</div>
      )
    },
    enableSorting: false,
  },
  {
    accessorFn: (row: ListaNota) => {
      return row.note_comments?.map(c => c.note_comments).join(' ') ?? ''
    },
    id: 'note_comments',
    header: 'Comentarios',
    cell: ({ row }: any) => {
      const comments = row.original.note_comments as NoteComments[] | undefined;
  
      if (!comments || comments.length === 0) {
        return <div>No hay comentarios</div>
      }

      if (comments.length === 1) {
        return <p>{comments[0].note_comments}</p>;
      }
  
      return (
          <ul className='list-disc pl-4'>
            {comments.map((comment, index) => {
              return (
                <li key={index}>{comment.note_comments}</li>
              )
            })}
          </ul>
      )
    },
  },
]
