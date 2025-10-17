import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterItem {
    id: string | number;
    label: string;
    total?: number;
    [key: string]: any;
}

interface FilterPanelProps {
    title: string;
    items: FilterItem[];
    selectedItems: string[];
    searchTerm: string;
    isLoading?: boolean;
    emptyMessage?: string;
    searchPlaceholder?: string;
    selectAllText?: string;
    clearSelectionText?: string;
    onItemToggle: (itemId: string) => void;
    onSearchChange: (term: string) => void;
    onSelectAll: () => void;
    onClearSelection: () => void;
    renderItem?: (item: FilterItem, isSelected: boolean, onToggle: (id: string) => void) => React.ReactNode;
    getTotalCount?: (items: FilterItem[]) => number;
    className?: string;
}

// Componente por defecto para renderizar items
const DefaultItemRenderer: React.FC<{
    item: FilterItem;
    isSelected: boolean;
    onToggle: (id: string) => void;
}> = ({ item, isSelected, onToggle }) => (
    <div
        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isSelected
            ? 'bg-blue-100 border-blue-500 shadow-md'
            : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
        onClick={() => onToggle(String(item.id))}
    >
        <div className="flex justify-between items-center">
            <span className={`font-medium ${isSelected ? 'text-blue-800' : 'text-gray-700'}`}>
                {item.label}
            </span>
            {item.total !== undefined && (
                <span className={`text-sm px-2 py-1 rounded-full ${isSelected ? 'bg-blue-200 text-blue-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                    {item.total}
                </span>
            )}
        </div>
    </div>
);

const FilterPanel: React.FC<FilterPanelProps> = ({
    title,
    items = [],
    selectedItems = [],
    searchTerm = "",
    isLoading = false,
    emptyMessage = "No se encontraron elementos",
    searchPlaceholder = "Buscar...",
    selectAllText = "Seleccionar todas",
    clearSelectionText = "Limpiar selección",
    onItemToggle,
    onSearchChange,
    onSelectAll,
    onClearSelection,
    renderItem,
    getTotalCount = (items) => items.reduce((sum, item) => sum + (item.total || 0), 0),
    className = "",
}) => {
    // Ordenar items por total de mayor a menor ANTES de filtrar
    const sortedItems = [...items].sort((a, b) => {
        const totalA = a.total || 0;
        const totalB = b.total || 0;
        return totalB - totalA; // Orden descendente (mayor a menor)
    });

    // Filtrar items basado en el término de búsqueda (usando los items ya ordenados)
    const filteredItems = sortedItems.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCount = getTotalCount(items);
    const hasSelection = selectedItems.length > 0;

    return (
        <div className={`border rounded-lg p-4 flex flex-col gap-4 h-full w-full ${className}`}>
            {/* Header */}
            <div>
                <div className="font-bold">
                    {title}: {totalCount > 0 && totalCount.toLocaleString()}
                </div>
                <div className="text-gray-400 flex items-center justify-between">
                    <div>
                        Seleccione elementos para visualizar
                    </div>
                    <div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={hasSelection ? onClearSelection : onSelectAll}
                            className="ml-2"
                        >
                            {hasSelection ? clearSelectionText : selectAllText}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div>
                <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Items List */}
            <div className="flex-1 min-h-0">
                <ScrollArea className="w-full rounded-md border h-full">
                    <div className="p-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40 text-gray-400">
                                Cargando elementos...
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="flex justify-center items-center h-40 text-gray-400">
                                {emptyMessage}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {filteredItems.map((item) => {
                                    const isSelected = selectedItems.includes(String(item.id));

                                    return (
                                        <div key={item.id}>
                                            {renderItem ? (
                                                renderItem(item, isSelected, onItemToggle)
                                            ) : (
                                                <DefaultItemRenderer
                                                    item={item}
                                                    isSelected={isSelected}
                                                    onToggle={onItemToggle}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default FilterPanel;