'use client'

import * as React from 'react'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { List, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AddNoteModal } from '@/components/modals/add-note-modal'
import { notasColumns } from './notas-columns'
import Link from 'next/link'
import { Imagen } from '@/lib/update-pass-full'

interface ListaNotasTableProps {
  data: Nota[]
}

export interface Nota {
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

export const NotasTable = ({ data }: ListaNotasTableProps) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 3,
  })

  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data: data || [],
    columns: notasColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
  })

  return (
    <div className='w-full'>
      <div className='my-5'>
        <h1 className='text-2xl font-bold'>Notas : {data?.length}</h1> 
      </div>

      <div className='flex justify-between items-center my-5'>
        {/* Campo de búsqueda a la izquierda */}
        <input
          type='text'
          placeholder='Buscar...'
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='border border-gray-300 rounded-md p-2 h-12 w-full max-w-xs'
        />

        {/* Botones a la derecha */}
        <div className='flex items-center space-x-2'>
          <AddNoteModal title='Nueva nota'>
            <Button className='bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md flex items-center'>
              <Plus /> Nota
            </Button>
          </AddNoteModal>

          <Link href='/dashboard/notas'>
            <Button
              className='bg-blue-500 text-white hover:text-white hover:bg-blue-600'
              variant='outline'
              size='icon'>
              <List size={36} />
            </Button>
          </Link>
        </div>
      </div>

      <div className=''>
        <Table>
          <TableHeader className='bg-[#F0F2F5]'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={notasColumns.length}
                  className='h-24 text-center'>
                  No hay registros disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
