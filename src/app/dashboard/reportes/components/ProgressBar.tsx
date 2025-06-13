import React from "react"
import { cn } from "@/lib/utils" // si usas la util `cn`, si no, puedes omitir

interface ProgressBarProps {
    value: number // porcentaje
    color?: string // ej: bg-red-500
    className?: string
}

const ProgressBar = ({ value, color = "bg-blue-500", className }: ProgressBarProps) => {
    return (
        <div className={cn("w-full h-4 bg-gray-200 rounded-full overflow-hidden", className)}>
            <div
                className={cn("h-full transition-all duration-300", color)}
                style={{ width: `${value}%` }}
            />
        </div>
    )
}

export default ProgressBar