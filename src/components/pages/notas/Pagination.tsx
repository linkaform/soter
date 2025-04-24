import React from 'react'
import { useState } from 'react'
import {
  ChevronRight,
  ChevronLeft,
  ChevronFirst,
  ChevronLast,
} from 'lucide-react'

interface PaginationProps {
  paginaActualProp: number
  totalPaginasProp: number
  totalRegistrosProp: number
  cantidadXPagina: number
  registrosXPagina?: number[]
  handleRegistersPageChange: (newCantidad: number) => void
}

const Pagination = ({
  paginaActualProp,
  totalPaginasProp,
  totalRegistrosProp,
  cantidadXPagina,
  registrosXPagina = [25, 50, 100],
  onPageChange,
  handleRegistersPageChange,
}: PaginationProps & { onPageChange: (newPage: number) => void }) => {
  const [cantidad, setCantidad] = useState(registrosXPagina[0])
  const [paginaActual, setPaginaActual] = useState(paginaActualProp)

  const handleCantidadChange = (e: any) => {
    const newCantidad = parseInt(e.target.value)
    onPageChange(0)
    setCantidad(newCantidad)
    handleRegistersPageChange(newCantidad)
  }

  const handlePageChange = (newPage: number) => {
    setPaginaActual(newPage)
    onPageChange(newPage)
  }

  return (
    <div className='p-2 border flex flex-col md:flex-row justify-between items-center mb-10'>
      <div
        id='infoPaginacion'
        className='mb-2 md:mb-0 text-gray-500 flex items-center gap-3'>
        <span>Registros por página</span>
        <select
          name='registrosXPagina'
          id='registrosXPagina'
          onChange={handleCantidadChange}
          value={cantidadXPagina}
          className='border rounded px-2 py-1 bg-white'>
          {registrosXPagina.map((cantidad, index) => (
            <option key={index} value={cantidad}>
              {cantidad}
            </option>
          ))}
        </select>
        <span id='totalDeRegistros'>
          1-{cantidad} de {totalRegistrosProp} registros
        </span>
      </div>

      <div className='flex gap-2 items-center'>
        <button
          onClick={() => handlePageChange(1)}
          disabled={paginaActual === 1}
          className='p-1 text-gray-500 rounded'>
          <ChevronFirst />
        </button>
        <button
          onClick={() => handlePageChange(paginaActual - 1)}
          disabled={paginaActual === 1}
          className='p-1 text-blue-600 hover:bg-gray-100 rounded flex items-center'>
          <ChevronLeft /> Anterior
        </button>

        <div className='flex items-center justify-center gap-1'>
          <input
            type='number'
            value={paginaActual}
            onChange={(e: any) => handlePageChange(Number(e.target.value))}
            className='border rounded w-10'
            min={1}
            max={totalPaginasProp}
          />
          <span>de {totalPaginasProp}</span>
        </div>

        <button
          onClick={() => handlePageChange(paginaActual + 1)}
          disabled={paginaActual === totalPaginasProp}
          className='p-1 text-blue-600 hover:bg-gray-100 rounded flex items-center'>
          Siguiente <ChevronRight />
        </button>

        <button
          onClick={() => handlePageChange(totalPaginasProp)}
          disabled={paginaActual === totalPaginasProp}
          className='p-1 text-gray-500 rounded'>
          <ChevronLast />
        </button>
      </div>
    </div>
  )
}

export default Pagination
