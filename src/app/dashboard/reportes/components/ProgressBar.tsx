import React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
    value: number // porcentaje
    color?: string // ej: bg-red-500
    className?: string
}

const ProgressBar = ({ value, color = "bg-blue-500", className }: ProgressBarProps) => {
    // Si value no es un número válido, usa 0
    const safeValue = typeof value === "number" && isFinite(value) ? value : 0

    return (
        <div className={cn("w-full h-4 bg-gray-200 rounded-full overflow-hidden", className)}>
            <div
                className={cn("h-full transition-all duration-300", color)}
                style={{ width: `${safeValue}%` }}
            />
        </div>
    )
}

export default ProgressBar