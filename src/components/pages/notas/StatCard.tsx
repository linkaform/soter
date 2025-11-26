import React, { cloneElement, isValidElement } from 'react'
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
      className={`p-4 rounded-lg shadow-md border transition w-56 text-black cursor-${
        selectable ? 'pointer' : 'default'
      }
        ${
          selectable && selected
            ? 'border rounded-md cursor-pointer transition duration-100 bg-blue-100'
            : 'hover:bg-gray-100 '
        }
      `}>
		<div>
			<div className="flex gap-6">
				<div > {
				isValidElement(icon)
				? cloneElement(icon as React.ReactElement<any>, {
					className: `w-10 h-10 ${selected ? 'text-black' : 'text-primary'}`,
					})
				: null
				}</div>
					<span className="flex items-center font-bold text-4xl"> {value}</span>
			</div>
			<div className="flex items-center space-x-0">
				<div className="h-1 w-1/2 bg-cyan-100"></div>
				<div className="h-1 w-1/2 bg-blue-500"></div>
			</div>
			<span className="text-md"> {label}</span>
		</div>
	</div>
  )
}
export default StatCard
