import React from 'react'
import { CircleHelp } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  onClick?: () => void
  selected?: boolean
  selectable?: boolean
}

const StatCard = ({
  label,
  value,
  icon = <CircleHelp className='text-primary w-10 h-10' />,
  onClick,
  selected = false,
  selectable = false,
}: StatCardProps) => {
  return (
    <div
      onClick={selectable ? onClick : undefined}
      className={`p-4 rounded-lg shadow-md border transition cursor-${
        selectable ? 'pointer' : 'default'
      }
        ${
          selectable && selected
            ? 'bg-primary text-white border-primary'
            : 'bg-white hover:bg-gray-50'
        }
      `}>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium'>{label}</p>
          <p className='text-2xl font-bold'>{value}</p>
        </div>
        {icon}
      </div>
    </div>
  )
}

export default StatCard
