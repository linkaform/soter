import React from 'react'

interface StatCardProps {
    icon: React.ReactNode
    value: string
    label: string
}

const StatCard = ({ icon, value, label }: StatCardProps) => {
    return (
        <div className="flex gap-4 border p-4 rounded-lg">
            <div>
                <div className="bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div>
                <div className="font-bold">{value}</div>
                <div className="text-gray-500">{label}</div>
            </div>
        </div>
    )
}

export default StatCard