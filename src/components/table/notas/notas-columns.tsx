import { CloseNoteModal } from '@/components/modals/close-note-modal'
import { NoteDetailsModal } from '@/components/modals/note-details-modal'
import { ColumnDef } from '@tanstack/react-table'
import { Check, Eye } from 'lucide-react'

export type Nota = {
  id: string
  empleado: string
  apertura: string
  cierre: string
  nota: string
  comentarios: string
}

export const notasColumns: ColumnDef<Nota>[] = [
  {
    id: 'select',
    header: '',
    cell: ({ row }) => (
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
          title={row.original.nota}
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
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'empleado',
    header: 'Empleado',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('empleado')}</div>
    ),
  },
  {
    accessorKey: 'cierre',
    header: 'Cierre',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('cierre')}</div>
    ),
  },
  {
    accessorKey: 'nota',
    header: 'Nota',
    cell: ({ row }) => <div className='capitalize'>{row.getValue('nota')}</div>,
  },
  {
    accessorKey: 'comentarios',
    header: 'Comentarios',
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('comentarios')}</div>
    ),
  },
]
