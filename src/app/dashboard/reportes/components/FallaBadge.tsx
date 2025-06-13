import { Badge } from "@/components/ui/badge";
import React from 'react'

interface FallaBadgeProps {
    falla: string;
    total: number;
    active: boolean;
    onToggle: (falla: string) => void;
}

const FallaBadge = ({ falla, total, active, onToggle }: FallaBadgeProps) => {
    return (
        <Badge
            className={`w-full rounded-sm font-light hover:cursor-pointer flex items-center justify-between ${active
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-200 text-black hover:bg-blue-300"
                }`}
            onClick={() => onToggle(falla)}
        >
            <span>{falla.replace(/_/g, " ").toUpperCase()}</span>
            <span className="ml-2 px-2 py-0.5 rounded bg-white/30">{total}</span>
        </Badge>
    )
}

export default FallaBadge