'use client'
import * as React from 'react'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { FileDown, Plus, Search } from 'lucide-react'
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
import { listaNotasColumns } from './lista-notas-columns'
import { useNotes } from '@/hooks/useNotes'
import { useState, useEffect } from 'react'
import Pagination from '@/components/pages/notas/Pagination'
import DateFilter from '@/components/pages/notas/DateFilter'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface ListaNotasTableProps {
  statusFilter: string
  ubicacionSeleccionada: string
  areaSeleccionada: string
}

export const ListaNotasTable = ({ statusFilter, ubicacionSeleccionada, areaSeleccionada }: ListaNotasTableProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [registersPage, setRegistersPage] = useState(10)
  const [dateFromValue, setDateFromValue] = useState('')
  const [dateToValue, setDateToValue] = useState('')
  if (statusFilter === '') {
    statusFilter = 'abierto'
  }

  useEffect(() => {
    if (statusFilter === 'dia') {
      setDateFilter('today')
    } else {
      setDateFilter('this_month')
    }
  }, [statusFilter])

  const { data: notes, isLoadingListNotes, isFetching } = useNotes( true,
    areaSeleccionada,
    ubicacionSeleccionada,
    currentPage,
    registersPage,
    dateFromValue,
    dateToValue,
    statusFilter
  )
  const actual_page = notes?.actual_page ?? 1
  const records = notes?.records ?? []
  const total_pages = notes?.total_pages ?? 1
  const total_records = notes?.total_records ?? 0

  const handleRegistersPageChange = (newQuantity: number) => {
    setRegistersPage(newQuantity)
    setCurrentPage(0)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage - 1)
  }

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 23,
  })
  const [globalFilter, setGlobalFilter] = React.useState('')

  const tableData = Array.isArray(records) ? records : []

  const table = useReactTable({
    data: tableData,
    columns: listaNotasColumns,
    pageCount: Math.ceil(total_records / pagination.pageSize),
    manualPagination: true,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  })

  const [date1, setDate1] = useState<Date | '' | null>('')
  const [date2, setDate2] = useState<Date | '' | null>('')
  const [dateFilter, setDateFilter] = useState<string>('this_month')

  useEffect(() => {
    selectedDate(dateFilter)

    if (dateFilter !== 'range') {
      setDate1('')
      setDate2('')
    }
  }, [dateFilter])

  const selectedDate = (dateFilter: string): void => {
    const now = new Date()
    let dateFrom = ''
    let dateTo = ''

    switch (dateFilter) {
      case 'today':
        dateFrom = dateTo = format(now, 'yyyy-MM-dd')
        break

      case 'yesterday':
        const yesterday = new Date(now)
        yesterday.setDate(now.getDate() - 1)
        dateFrom = dateTo = format(yesterday, 'yyyy-MM-dd')
        break

      case 'this_week':
        const firstDayOfWeek = new Date(now)
        firstDayOfWeek.setDate(now.getDate() - now.getDay())
        const lastDayOfWeek = new Date(now)
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6)

        dateFrom = format(firstDayOfWeek, 'yyyy-MM-dd')
        dateTo = format(lastDayOfWeek, 'yyyy-MM-dd')
        break

      case 'last_week':
        const lastWeekStart = new Date(now)
        lastWeekStart.setDate(now.getDate() - now.getDay() - 7)
        const lastWeekEnd = new Date(lastWeekStart)
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6)

        dateFrom = format(lastWeekStart, 'yyyy-MM-dd')
        dateTo = format(lastWeekEnd, 'yyyy-MM-dd')
        break

      case 'last_fifteen_days':
        const fifteenDaysAgo = new Date(now)
        fifteenDaysAgo.setDate(now.getDate() - 14)
        dateFrom = format(fifteenDaysAgo, 'yyyy-MM-dd')
        dateTo = format(now, 'yyyy-MM-dd')
        break

      case 'this_month':
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

        dateFrom = format(firstDay, 'yyyy-MM-dd')
        dateTo = format(lastDay, 'yyyy-MM-dd')
        break

      case 'last_month':
        const firstDayLastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        )
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

        dateFrom = format(firstDayLastMonth, 'yyyy-MM-dd')
        dateTo = format(lastDayLastMonth, 'yyyy-MM-dd')
        break

      case 'this_year':
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        const endOfYear = new Date(now.getFullYear(), 11, 31)

        dateFrom = format(startOfYear, 'yyyy-MM-dd')
        dateTo = format(endOfYear, 'yyyy-MM-dd')
        break
    }

    setDateFromValue(dateFrom)
    setDateToValue(dateTo)
  }

  const Filter = () => {
    if (date1 && date2) {
      const str1 = format(date1, 'yyyy-MM-dd HH:mm:ss')
      const str2 = format(date2, 'yyyy-MM-dd HH:mm:ss')
      setDateFromValue(str1)
      setDateToValue(str2)
    } else {
      toast.error('Escoge un rango de fechas.')
    }
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col md:flex-row justify-between items-center'>
        <div className='flex items-center gap-2'>
          <input
            type='text'
            placeholder='Buscar...'
            value={globalFilter}
            onChange={(e: any) => setGlobalFilter(e.target.value)}
            className='w-full border border-gray-300 rounded-md p-2  max-w-xs mb-5'
          />
          <Search />
        </div>
        <div className='w-full md:w-auto flex flex-col md:flex-row items-center gap-2'>
          <DateFilter
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            Filter={Filter}
            setDate1={setDate1}
            setDate2={setDate2}
            date1={date1}
            date2={date2}
          />
         
          <AddNoteModal title='Nueva nota' >
            <Button className='w-full md:w-auto bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-md flex items-center'>
              <Plus />
              Nota
            </Button>
          </AddNoteModal>
          <Button className='w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2'>
            <FileDown/>
            Descargar
          </Button>
        </div>
      </div>

      <div>
        <Table>
          <TableHeader className='bg-[#F0F2F5]'>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoadingListNotes || isFetching ? (
              <TableRow>
                <TableCell colSpan={listaNotasColumns.length} className="text-center">
                  Cargando registros...
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={listaNotasColumns.length} className="text-center">
                  No hay registros disponibles. Intenta seleccionar una ubicación o un área diferente.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Pagination
          paginaActualProp={actual_page}
          totalRegistrosProp={total_records}
          totalPaginasProp={total_pages}
          cantidadXPagina={registersPage}
          registrosXPagina={[10, 20, 30]}
          onPageChange={handlePageChange}
          handleRegistersPageChange={handleRegistersPageChange}
        />
      </div>
    </div>
  )
}
