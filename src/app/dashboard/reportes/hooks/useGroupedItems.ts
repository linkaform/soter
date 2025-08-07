// Crear: /src/hooks/useGroupedItems.ts
import { useState, useMemo } from 'react';

export const useGroupedItems = (items: any[], groupByField: string = 'label') => {
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null); // Solo un grupo expandido a la vez

    const groupedItems = useMemo(() => {
        const groups: { [key: string]: any[] } = {};

        // Agrupar items por el campo especificado
        items.forEach(item => {
            const groupKey = item[groupByField];
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
        });

        // Convertir a array de grupos
        return Object.entries(groups).map(([label, groupItems]) => ({
            id: label,
            label,
            items: groupItems,
            isExpanded: expandedGroup === label,
            count: groupItems.length,
            representativeItem: groupItems[0] // Usar el primer item como representativo
        }));
    }, [items, groupByField, expandedGroup]);

    const toggleGroup = (groupId: string) => {
        setExpandedGroup(prev => prev === groupId ? null : groupId);
    };

    const closeGroup = () => {
        setExpandedGroup(null);
    };

    const getDisplayItems = () => {
        const displayItems: any[] = [];

        groupedItems.forEach(group => {
            if (group.count === 1) {
                // Si solo hay un item, mostrarlo directamente
                displayItems.push({
                    ...group.items[0],
                    isGrouped: false,
                    groupInfo: null
                });
            } else {
                // Siempre mostrar solo el representativo con badge
                displayItems.push({
                    ...group.representativeItem,
                    isGrouped: true,
                    isGroupParent: true,
                    groupId: group.id,
                    groupInfo: group
                });
            }
        });

        return displayItems;
    };

    return {
        groupedItems,
        toggleGroup,
        closeGroup,
        getDisplayItems,
        expandedGroup
    };
};