import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const options = [
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
]

export default function MultiSelectDropdown() {
    const [selected, setSelected] = useState<string[]>([])

    const toggleOption = (value: string) => {
        setSelected(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        )
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start">
                    {selected.length > 0
                        ? selected.join(", ")
                        : "Selecciona opciones..."}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
                {options.map(option => (
                    <div
                        key={option.value}
                        className="flex items-center gap-2 py-1 cursor-pointer"
                        onClick={() => toggleOption(option.value)}
                    >
                        <Checkbox
                            checked={selected.includes(option.value)}
                            onCheckedChange={() => toggleOption(option.value)}
                        />
                        <span>{option.label}</span>
                    </div>
                ))}
            </PopoverContent>
        </Popover>
    )
}
