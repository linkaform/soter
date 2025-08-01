import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface GridItem {
    id: string | number;
    label: string;
    [key: string]: any; // Para propiedades adicionales
}

interface GridDisplayProps {
    title: string;
    items: GridItem[];
    isLoading?: boolean;
    loadingMessage?: string;
    emptyMessage?: string;
    onItemClick?: (item: GridItem) => void;
    selectedItemId?: string | number | null;
    getItemStatus?: (item: GridItem) => 'done' | 'warning' | 'error' | 'info' | 'pending';
    getItemTooltip?: (item: GridItem) => string;
    sortItems?: (items: GridItem[]) => GridItem[];
    gridConfig?: {
        minItemWidth?: string;
        gap?: string;
        itemSize?: string;
    };
    className?: string;
    idField?: string; // ← Nueva prop
}

const GridDisplay: React.FC<GridDisplayProps> = ({
    title,
    items = [],
    isLoading = false,
    loadingMessage = "Cargando elementos...",
    emptyMessage = "No hay elementos para mostrar",
    onItemClick,
    selectedItemId,
    getItemStatus = () => 'pending',
    getItemTooltip = (item) => item.label,
    sortItems = (items) => items.sort((a, b) => String(a.label).localeCompare(String(b.label))),
    gridConfig = {},
    className = "",
    idField = 'id', // ← Valor por defecto
}) => {
    const {
        minItemWidth = "2.5rem",
        gap = "gap-2",
        itemSize = "w-10 h-10",
    } = gridConfig;

    const getStatusClass = (status: string) => {
        const statusClasses = {
            done: 'bg-green-600 text-white',
            warning: 'bg-yellow-500 text-white',
            error: 'bg-red-600 text-white',
            info: 'bg-blue-500 text-white',
            pending: 'bg-gray-400 text-white border',
        };
        return statusClasses[status as keyof typeof statusClasses] || statusClasses.pending;
    };

    const sortedItems = sortItems(items);

    return (
        <div className={`border rounded-lg p-4 flex-1 min-h-0 flex flex-col ${className}`}>
            <div className="text-2xl">{title}</div>
            <Separator className="w-[22rem] bg-black mt-2" />
            <ScrollArea className="w-full flex-1 min-h-0">
                <div className="w-full">
                    <div
                        className={`grid ${gap} p-4`}
                        style={{
                            gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
                        }}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40 text-xl text-gray-400 col-span-full">
                                {loadingMessage}
                            </div>
                        ) : sortedItems.length === 0 ? (
                            <div className="flex justify-center items-center h-40 text-xl text-gray-400 col-span-full">
                                {emptyMessage}
                            </div>
                        ) : (
                            sortedItems.map((item, idx) => {
                                const itemId = item[idField]; // ← Usar el campo dinámico
                                const status = getItemStatus(item);
                                const isSelected = selectedItemId === itemId;
                                const selectedClass = isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : '';
                                const statusClass = getStatusClass(status);

                                return (
                                    <div
                                        key={`${itemId}-${idx}`} // ← Usar itemId
                                        className={`${itemSize} flex items-center justify-center text-sm font-medium rounded cursor-pointer ${statusClass} ${selectedClass} transition-all duration-200 hover:scale-105`}
                                        onClick={() => onItemClick?.(item)}
                                        title={getItemTooltip(item)}
                                    >
                                        {item.label}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
};

export default GridDisplay;