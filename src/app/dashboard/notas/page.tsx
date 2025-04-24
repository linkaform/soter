'use client'

import { ListaNotasTable } from '@/components/table/notas/lista-notas/table'
import PageTitle from '@/components/page-title'
import Stats from '@/components/pages/notas/StatsNotas'
import { useState } from 'react'

const NotasPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('')

  return (
    <main className='mt-4 mx-4'>
      <header className='flex flex-col md:flex-row md:justify-between'>
        <PageTitle title='Listado de Notas' />
        <div className='w-full md:w-3/5'>
          <Stats setStatusFilter={setStatusFilter} />
        </div>
      </header>
      <section>
        <ListaNotasTable statusFilter={statusFilter} />
      </section>
    </main>
  )
}

export default NotasPage
