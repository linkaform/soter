import React, { useRef, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useGroupedItems } from "@/app/dashboard/reportes/hooks/useGroupedItems";
import Portal from "@/app/dashboard/reportes/components/Portal";

interface GridItem {
    id: string | number;
    label: string;
    [key: string]: any;
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
    idField?: string;
    groupByField?: string;
    enableGrouping?: boolean;
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
    idField = 'id',
    groupByField = 'label',
    enableGrouping = false,
}) => {
    const {
        minItemWidth = "2.5rem",
        gap = "gap-2",
        itemSize = "w-10 h-10",
    } = gridConfig;

    const { toggleGroup, closeGroup, getDisplayItems, expandedGroup, groupedItems } = useGroupedItems(
        enableGrouping ? items : [],
        groupByField
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const [popupPosition, setPopupPosition] = useState<{
        top: number;
        left: number;
        positioning: 'right' | 'left';
    } | null>(null);

    // Cerrar el popup al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;

            // Verificar si el click fue en el container original O en el popup del portal
            const isInContainer = containerRef.current && containerRef.current.contains(target);
            const isInPopup = target && (target as Element).closest('[data-popup="group-popup"]');

            // Solo cerrar si el click NO fue en ninguno de los dos
            if (!isInContainer && !isInPopup) {
                closeGroup();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeGroup();
            }
        };

        if (expandedGroup) {
            // Bloquear scroll del body
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        } else {
            // Restaurar scroll del body
            document.body.style.overflow = 'unset';
        }

        return () => {
            // Limpiar eventos y restaurar scroll
            document.body.style.overflow = 'unset';
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [expandedGroup, closeGroup]);

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

    const processedItems = enableGrouping ? getDisplayItems() : sortItems(items);

    const handleItemClick = (item: any, event: React.MouseEvent) => {
        if (item.isGroupParent && item.groupInfo?.count > 1) {
            // Si es un grupo, calcular posición y mostrar el popup
            event.stopPropagation();
            const element = event.currentTarget as HTMLElement;
            const position = calculatePopupPosition(element);
            setPopupPosition(position);
            toggleGroup(item.groupId);
        } else {
            // Si es un item normal, ejecutar click normal
            onItemClick?.(item);
            closeGroup(); // Cerrar popup si hay uno abierto
        }
    };

    const handleGroupItemClick = (item: any) => {
        onItemClick?.(item);
        closeGroup(); // Cerrar popup después de seleccionar
    };

    const getExpandedGroupData = () => {
        if (!expandedGroup) return null;
        return groupedItems.find(group => group.id === expandedGroup);
    };

    const renderItem = (item: any, idx: number) => {
        const itemId = item[idField];
        const status = getItemStatus(item);
        const isSelected = selectedItemId === itemId;
        const isGroupExpanded = item.isGroupParent && item.groupId === expandedGroup;

        const selectedClass = isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : '';
        const expandedClass = isGroupExpanded ? 'ring-4 ring-purple-500 ring-offset-2 scale-105' : '';
        const statusClass = getStatusClass(status);

        return (
            <div
                key={`${itemId}-${idx}-${item.groupId || 'single'}`}
                className={`${itemSize} flex items-center justify-center text-sm font-medium rounded cursor-pointer ${statusClass} ${selectedClass} ${expandedClass} transition-all duration-300 hover:scale-105 relative overflow-visible`}
                onClick={(e) => handleItemClick(item, e)}
                title={getItemTooltip(item)}
            >
                {/* Contenido principal del item */}
                <span className="truncate px-1">
                    {item.label}
                </span>

                {/* Badge de contador para grupos */}
                {item.isGroupParent && item.groupInfo?.count > 1 && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white z-10">
                        {item.groupInfo.count}
                    </div>
                )}

                {/* Indicador de expansión para grupos */}
                {item.isGroupParent && item.groupInfo?.count > 1 && (
                    <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-tl-lg p-0.5">
                        {isGroupExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                        ) : (
                            <ChevronRight className="w-3 h-3" />
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Función para calcular la posición del popup
    const calculatePopupPosition = (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        const popupWidth = 320;
        const popupHeight = 300;
        const margin = 16;

        // Verificar si hay espacio a la derecha
        const spaceRight = window.innerWidth - rect.right;
        const spaceLeft = rect.left;

        let positioning: 'right' | 'left' = 'right';
        let left = rect.right + margin;

        // Si no hay suficiente espacio a la derecha, mostrar a la izquierda
        if (spaceRight < popupWidth + margin) {
            if (spaceLeft >= popupWidth + margin) {
                positioning = 'left';
                left = rect.left - popupWidth - margin;
            } else {
                // Si no hay espacio en ningún lado, centrar en la pantalla
                left = Math.max(margin, (window.innerWidth - popupWidth) / 2);
            }
        }

        // Calcular top, asegurándose de que no se salga de la pantalla
        let top = rect.top;
        const maxTop = window.innerHeight - popupHeight - margin;
        if (top > maxTop) {
            top = maxTop;
        }
        if (top < margin) {
            top = margin;
        }

        return { top, left, positioning };
    };

    const renderPopupWithPortal = () => {
        if (!expandedGroup || !popupPosition) return null;

        const groupData = getExpandedGroupData();
        if (!groupData) return null;

        return (
            <Portal>
                {/* Overlay semitransparente */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-20 z-[9998]"
                    onClick={closeGroup}
                />

                {/* Popup principal */}
                <div
                    data-popup="group-popup"
                    className="fixed bg-white border-2 border-purple-500 rounded-lg shadow-2xl p-4 min-w-[320px] max-w-[400px] z-[9999] animate-slideIn"
                    style={{
                        top: `${popupPosition.top}px`,
                        left: `${popupPosition.left}px`,
                    }}
                >
                    {/* Header del popup */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b">
                        <div className="font-semibold text-gray-800 text-sm">
                            📍 {groupData.label} ({groupData.count} auditorías)
                        </div>
                        <button
                            onClick={closeGroup}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Lista de items del grupo */}
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                        {groupData.items.map((groupItem: any, index: number) => {
                            const groupItemStatus = getItemStatus(groupItem);
                            const groupItemSelected = selectedItemId === groupItem[idField];
                            const groupItemStatusClass = getStatusClass(groupItemStatus);

                            return (
                                <div
                                    key={`group-item-${groupItem[idField]}-${index}`}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 hover:shadow-sm border ${groupItemSelected ? 'bg-blue-50 border-blue-300 shadow-sm' : 'border-gray-200'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleGroupItemClick(groupItem);
                                    }}
                                >
                                    {/* Indicador de estado */}
                                    <div className={`w-4 h-4 rounded-full flex-shrink-0 ${groupItemStatusClass.split(' ')[0]}`} />

                                    {/* Información del item */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {groupItem.label}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                            📍 {groupItem.state} • {groupItem.created_at}
                                        </div>
                                        {groupItem.folio && (
                                            <div className="text-xs text-blue-600 truncate">
                                                📋 {groupItem.folio}
                                            </div>
                                        )}
                                    </div>

                                    {/* Indicador de selección */}
                                    {groupItemSelected && (
                                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer con información adicional */}
                    <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500 text-center">
                        💡 Tip: Presiona <kbd className="px-1 py-0.5 bg-gray-100 rounded">Esc</kbd> para cerrar
                    </div>
                </div>
            </Portal>
        );
    };

    return (
        <div ref={containerRef} className={`border rounded-lg p-4 flex-1 min-h-0 flex flex-col ${className} relative`}>
            <div className="text-2xl flex items-center justify-between">
                {title}
            </div>
            <Separator className="w-[22rem] bg-black mt-2" />
            <ScrollArea className="w-full flex-1 min-h-0">
                <div className="w-full">
                    <div
                        className={`grid ${gap} p-4 transition-all duration-300`}
                        style={{
                            gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`,
                        }}
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40 text-xl text-gray-400 col-span-full">
                                {loadingMessage}
                            </div>
                        ) : processedItems.length === 0 ? (
                            <div className="flex justify-center items-center h-40 text-xl text-gray-400 col-span-full">
                                {emptyMessage}
                            </div>
                        ) : (
                            processedItems.map((item, idx) => renderItem(item, idx))
                        )}
                    </div>
                </div>
            </ScrollArea>

            {/* Renderizar el popup usando Portal */}
            {renderPopupWithPortal()}
        </div>
    );
};

export default GridDisplay;