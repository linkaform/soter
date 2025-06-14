'use client'

import { ListaNotasTable } from '@/components/table/notas/lista-notas/table'
import PageTitle from '@/components/page-title'
import Stats from '@/components/pages/notas/StatsNotas'
import {  useState } from 'react'
import { useShiftStore } from '@/store/useShiftStore'

const NotasPage = () => {
  const { location, area } = useShiftStore()
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(location)
  const [areaSeleccionada, setAreaSeleccionada] = useState(area)

  return (
    <main className='mt-4 mx-4'>
      <header className='flex flex-col md:flex-row md:justify-between'>
        <PageTitle title='Listado de Notas' />
        <div className='w-full md:w-3/5'>
          <Stats setStatusFilter={setStatusFilter} ubicacionSeleccionada={ubicacionSeleccionada}
            areaSeleccionada={areaSeleccionada}
            setUbicacionSeleccionada={setUbicacionSeleccionada}
            setAreaSeleccionada={setAreaSeleccionada} />
        </div>
      </header>
      <section>
        <ListaNotasTable statusFilter={statusFilter}
          ubicacionSeleccionada={ubicacionSeleccionada}
          areaSeleccionada={areaSeleccionada} />
      </section>
    </main>
  )
}

export default NotasPage
