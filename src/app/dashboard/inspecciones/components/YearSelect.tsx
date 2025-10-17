// components/year-select.tsx
'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function YearSelect({ value, onChange }: { value: string | null, onChange: (v: string) => void }) {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

    return (
        <Select value={value ?? undefined} onValueChange={onChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona año" />
            </SelectTrigger>
            <SelectContent>
                {years.map(year => (
                    <SelectItem key={year} value={year}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
