import { CloseNoteModal } from '@/components/modals/close-note-modal'
import { NoteDetailsModal } from '@/components/modals/note-details-modal'
import { Imagen } from '@/lib/update-pass-full'
import { ColumnDef } from '@tanstack/react-table'
import { Check, Eye } from 'lucide-react'

interface Nota {
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

export interface NoteComment {
  note_comments: string
}

export const notasColumns: ColumnDef<Nota>[] = [
  {
    id: 'select',
    header: '',
    cell: ({ row }) => {
      console.log("row",row.original)
      return(
        <div className='flex space-x-4'>
        {/* TODO: Checar porque no se le pasan los datos */}
        <CloseNoteModal
          title='Cerrar nota'
          note={{
            ...row.original,
            _id: '',
            folio: '',
            created_by_name: '',
            note_status: '',
            note_open_date: '',
            note: '',
          }}>
          <div className='cursor-pointer'>
            <Check />
          </div>
        </CloseNoteModal>

        {/* TODO: Checar porque no se le pasan los datos */}
        <NoteDetailsModal
          title={row.original.note??""}
          note={{
            ...row.original,
            _id: '',
            folio: '',
            created_by_name: '',
            note_status: '',
            note_open_date: '',
            note: '',
          }}>
          <div className='cursor-pointer'>
            <Eye />
          </div>
        </NoteDetailsModal>
      </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'created_by_name',
    header: 'Empleado',
    cell: ({ row }) => (
      <div className='capitalize'>{row.original.created_by_name??""}</div>
    ),
  },
  {
    accessorKey: 'note_open_date',
    header: 'Apertura',
    cell: ({ row }) => (
      <div className='capitalize'>{row.original.note_open_date}</div>
    ),
  },
  {
    accessorKey: 'note_close_date',
    header: 'Cierre',
    cell: ({ row }) => (
      <div className='capitalize'>{row.original.note_open_date}</div>
    ),
  },
  {
    accessorKey: 'nota',
    header: 'Nota',
    cell: ({ row }) => <div className='capitalize'>{row.original.note}</div>,
  },
  // {
  //   accessorKey: 'comentarios',
  //   header: 'Comentarios',
  //   cell: ({ row }) => (
  //     <div className='capitalize'>{row.getValue('comentarios')}</div>
  //   ),
  // },
]
