// components/year-select.tsx
'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function YearSelect({ onChange }: { onChange?: (year: string) => void }) {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 20 }, (_, i) => currentYear - i)

    const handleChange = (value: string) => {
        onChange?.(value)
    }

    return (
        <Select onValueChange={handleChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona un año" />
            </SelectTrigger>
            <SelectContent>
                {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
