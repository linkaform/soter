'use client'
import { useState } from 'react'
import ChangeLocation from '@/components/changeLocation'
import StatCard from './StatCard'
import { Sun, FolderOpen, Package2 } from 'lucide-react'
import { useGetStats } from '@/hooks/useGetStats'

interface StatsProps {
  setStatusFilter: (status: string) => void
  ubicacionSeleccionada: string
  areaSeleccionada: string
  setUbicacionSeleccionada: (ubicacion: string) => void
  setAreaSeleccionada: (area: string) => void
}

const Stats = ({ setStatusFilter, ubicacionSeleccionada, areaSeleccionada, setUbicacionSeleccionada, setAreaSeleccionada }: StatsProps) => {

  const { data: stats } = useGetStats(true,ubicacionSeleccionada, areaSeleccionada, 'Notas')
  const [selectedStat, setSelectedStat] = useState<string | null>(null)

  const handleCardClick = (status: string) => {
    if (selectedStat === status) {
      setSelectedStat(null)
      setStatusFilter('')
    } else {
      setSelectedStat(status)
      setStatusFilter(status)
    }
  }

  return (
    <div className='flex gap-5 justify-end' >
      <div>
        <ChangeLocation
          ubicacionSeleccionada={ubicacionSeleccionada}
          areaSeleccionada={areaSeleccionada}
          setUbicacionSeleccionada={setUbicacionSeleccionada}
          setAreaSeleccionada={setAreaSeleccionada}
        />
      </div>

      <div className='flex justify-end gap-4'>
        <StatCard
          label='Notas Del Día'
          value={stats?.notas_del_dia ?? 0}
          icon={<Sun className='text-primary w-10 h-10' />}
          onClick={() => handleCardClick('dia')}
          selected={selectedStat === 'dia'}
          selectable
        />
        <StatCard
          label='Notas Abiertas'
          value={stats?.notas_abiertas ?? 0}
          icon={<FolderOpen className='text-primary w-10 h-10' />}
          onClick={() => handleCardClick('abierto')}
          selected={selectedStat === 'abierto'}
          selectable
        />
        <StatCard
          label='Notas Cerradas'
          value={stats?.notas_cerradas ?? 0}
          icon={<Package2 className='text-primary w-10 h-10' />}
          onClick={() => handleCardClick('cerrado')}
          selected={selectedStat === 'cerrado'}
          selectable
        />
      </div>
    </div >
  )
}

export default Stats
