"use client"
import React, { useState } from 'react';
import { MapPin, Camera, MessageSquare, ChevronDown } from 'lucide-react';
import Image from "next/image";
import { TabsList, TabsTrigger } from './ui/tabs';
import { useRondinesImages } from '@/hooks/Rondines/useRondinesImages';
import CheckImageModal from "@/components/modals/CheckImageModal";
import {
    MultiSelect,
    MultiSelectContent,
    MultiSelectItem,
    MultiSelectTrigger,
    MultiSelectValue,
} from "@/components/ui/multi-select";
import { useAreasLocationStore } from "@/store/useGetAreaLocationByUser";

interface CheckImage {
    name: string;
    recordId: number;
    file_name: string;
    file_url: string;
    numSet: number;
    thumbnail_name: string;
    fieldId: string;
    file_path: string;
}

interface CheckData {
    id: string;
    folio: string;
    ref_number: number;
    ubicacion: string;
    nombre_recorrido: string;
    nombre_area: string;
    fecha_y_hora_check: string;
    comentario_check: string;
    url_check: string;
    fotos_check: CheckImage[];
}

interface ChecksImagesSectionProps {
    location: string;
    showTabs: boolean;
}

interface UbicacionGroup {
    ubicacion: string;
    totalImagenes: number;
    totalChecks: number;
    checks: CheckData[];
}

const ChecksImagesSection: React.FC<ChecksImagesSectionProps> = ({
    location,
    showTabs
}) => {
    const [visibleItems, setVisibleItems] = useState<{ [ubicacion: string]: number }>({});
    const [loadingMore, setLoadingMore] = useState<{ [ubicacion: string]: boolean }>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [debouncedSelectedAreas, setDebouncedSelectedAreas] = useState<string[]>([]);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSelectedAreas(selectedAreas);
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedAreas]);

    const { data: checksData, isLoading: isLoadingImages } = useRondinesImages(true, location, debouncedSelectedAreas, '', '', 50, 0);
    const { areas: storeAreas } = useAreasLocationStore();

    const ITEMS_PER_PAGE = 50;

    // Obtener lista única de áreas para el filtro desde el store
    const availableAreas = React.useMemo(() => {
        if (!storeAreas) return [];
        return storeAreas.sort();
    }, [storeAreas]);

    const isValidImageUrl = (url: string): boolean => {
        if (!url) return false;
        const invalidPatterns = ['not-found', '404', 'error', 'placeholder', 'default-image'];
        return !invalidPatterns.some(pattern => url.toLowerCase().includes(pattern));
    };

    // Agrupar checks por ubicación
    const agruparPorUbicacion = (): UbicacionGroup[] => {
        const grupos: { [ubicacion: string]: CheckData[] } = {};

        checksData
            ?.filter((check: CheckData) => check.fotos_check && check.fotos_check.length > 0)
            ?.forEach((check: CheckData) => {
                const ubicacion = check.ubicacion || 'Sin ubicación';
                if (!grupos[ubicacion]) {
                    grupos[ubicacion] = [];
                }
                grupos[ubicacion].push(check);
            });

        return Object.entries(grupos)
            .map(([ubicacion, checks]) => {
                if (!(ubicacion in visibleItems)) {
                    setVisibleItems(prev => ({
                        ...prev,
                        [ubicacion]: Math.min(ITEMS_PER_PAGE, checks.length)
                    }));
                }

                return {
                    ubicacion,
                    totalImagenes: checks.reduce((sum, check) => sum + check.fotos_check.length, 0),
                    totalChecks: checks.length,
                    checks: checks.sort((a, b) =>
                        (a.fecha_y_hora_check || '').localeCompare(b.fecha_y_hora_check || '')
                    )
                };
            })
            .sort((a, b) => a.ubicacion.localeCompare(b.ubicacion));
    };

    const ubicacionesAgrupadas = agruparPorUbicacion();

    // Aplanar todas las imágenes para la navegación global en el modal
    const allImages: (CheckImage & { parentCheck: CheckData })[] = React.useMemo(() => {
        return ubicacionesAgrupadas.flatMap(grupo =>
            grupo.checks.flatMap(check =>
                check.fotos_check
                    .filter(img => isValidImageUrl(img.file_url))
                    .map(img => ({ ...img, parentCheck: check }))
            )
        );
    }, [ubicacionesAgrupadas]);

    const getGlobalIndex = (check: CheckData, imgIndex: number) => {
        // Encontrar el índice de esta imagen específica en el arreglo global allImages
        // Buscamos coincidencia por recordId y nombre de archivo (o algún identificador único)
        // Dado que estamos aplanando en orden determinista, podemos buscar la primera coincidencia
        // que corresponda a este check y tenga el mismo índice relativo en su lista filtrada.

        let currentIndex = 0;
        for (const grupo of ubicacionesAgrupadas) {
            for (const c of grupo.checks) {
                const validImages = c.fotos_check.filter(img => isValidImageUrl(img.file_url));

                if (c.id === check.id && c.ref_number === check.ref_number) {
                    // Estamos en el check correcto, sumamos el índice relativo
                    return currentIndex + imgIndex;
                }

                currentIndex += validImages.length;
            }
        }
        return 0;
    };

    const handleLoadMore = async (ubicacion: string) => {
        setLoadingMore(prev => ({ ...prev, [ubicacion]: true }));

        await new Promise(resolve => setTimeout(resolve, 300));

        setVisibleItems(prev => {
            const currentVisible = prev[ubicacion] || ITEMS_PER_PAGE;
            const grupo = ubicacionesAgrupadas.find(g => g.ubicacion === ubicacion);
            const newVisible = Math.min(currentVisible + ITEMS_PER_PAGE, grupo?.totalChecks || 0);

            return {
                ...prev,
                [ubicacion]: newVisible
            };
        });

        setLoadingMore(prev => ({ ...prev, [ubicacion]: false }));
    };

    const getChecksVisibles = (grupo: UbicacionGroup) => {
        const visibleCount = visibleItems[grupo.ubicacion] || ITEMS_PER_PAGE;
        return grupo.checks.slice(0, visibleCount);
    };

    const hasMoreItems = (grupo: UbicacionGroup) => {
        const visibleCount = visibleItems[grupo.ubicacion] || ITEMS_PER_PAGE;
        return visibleCount < grupo.totalChecks;
    };




    // Render content based on state
    const renderContent = () => {
        if (isLoadingImages) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Cargando imágenes...</span>
                </div>
            );
        }

        if (ubicacionesAgrupadas.length === 0) {
            return (
                <div className="text-center text-gray-500 py-12">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <div className="text-lg font-medium">No hay imágenes disponibles</div>
                    <div className="text-sm">
                        No se encontraron checks con fotografías en los datos seleccionados.
                    </div>
                </div>
            );
        }

        return (
            <>
                {/* Resumen general */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-blue-800">Resumen de Imágenes de Checks</h3>
                        </div>
                        <div className="text-sm text-blue-700">
                            <span className="font-medium">{ubicacionesAgrupadas.length}</span> ubicaciones •
                            <span className="font-medium ml-1">
                                {ubicacionesAgrupadas.reduce((sum, grupo) => sum + grupo.totalImagenes, 0)}
                            </span> imágenes •
                            <span className="font-medium ml-1">
                                {ubicacionesAgrupadas.reduce((sum, grupo) => sum + grupo.totalChecks, 0)}
                            </span> checks
                        </div>
                    </div>
                </div>

                {/* Grupos por ubicación */}
                {ubicacionesAgrupadas.map((grupo) => {
                    const checksVisibles = getChecksVisibles(grupo);
                    const tieneMore = hasMoreItems(grupo);
                    const isLoadingState = loadingMore[grupo.ubicacion];
                    const visibleCount = visibleItems[grupo.ubicacion] || ITEMS_PER_PAGE;

                    return (
                        <div key={grupo.ubicacion} className="border rounded-lg overflow-hidden">
                            {/* Header de la ubicación */}
                            <div className="bg-gray-50 border-b px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="w-5 h-5 text-gray-600" />
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {grupo.ubicacion}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="text-xs bg-gray-200 px-2 py-1 rounded">
                                            Mostrando {visibleCount} de {grupo.totalChecks}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Camera className="w-4 h-4" />
                                            <span>{grupo.totalImagenes} fotos</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="w-4 h-4" />
                                            <span>{grupo.totalChecks} checks</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grid de imágenes tipo galería */}
                            <div className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {checksVisibles.map((check) =>
                                        check.fotos_check
                                            .filter(img => isValidImageUrl(img.file_url))
                                            .map((img, imgIndex) => (
                                                <div
                                                    key={`${check.id}-${check.ref_number}-${imgIndex}`}
                                                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                                                    onClick={() => {
                                                        // Calcular índice global
                                                        const globalIndex = getGlobalIndex(check, imgIndex);
                                                        setSelectedImgIndex(globalIndex);
                                                        setModalOpen(true);
                                                    }}
                                                >
                                                    <Image
                                                        width={300}
                                                        height={300}
                                                        src={img.file_url}
                                                        alt={img.file_name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                        loading="lazy"
                                                        unoptimized
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                                                    {/* Overlay con información básica al hover */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <p className="text-white text-xs font-medium truncate">
                                                            {check.nombre_recorrido}
                                                        </p>
                                                        <p className="text-white/80 text-[10px]">
                                                            {check.fecha_y_hora_check}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                    )}
                                </div>

                                {/* Botón "Ver más" */}
                                {tieneMore && (
                                    <div className="mt-8 text-center">
                                        <button
                                            onClick={() => handleLoadMore(grupo.ubicacion)}
                                            disabled={isLoadingState}
                                            className={`
                                            inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
                                            text-white rounded-lg font-medium transition-colors
                                            ${isLoadingState ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
                                        `}
                                        >
                                            {isLoadingState ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Cargando...
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown className="w-4 h-4" />
                                                    Cargar más
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}

                                {/* Indicador cuando se han mostrado todas */}
                                {!tieneMore && grupo.totalChecks > ITEMS_PER_PAGE && (
                                    <div className="mt-8 text-center">
                                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                                            ✓ Se han mostrado todas las imágenes de {grupo.ubicacion}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <div className="space-y-6">
            {showTabs &&
                <TabsList className="bg-blue-500 text-white p-1 rounded-md">
                    <TabsTrigger value="Bitacora">Bitácora</TabsTrigger>
                    <TabsTrigger value="Rondines">Rondines</TabsTrigger>
                    <TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
                    <TabsTrigger value="Fotos">Fotos</TabsTrigger>
                    <TabsTrigger value="Calendario">Calendario</TabsTrigger>
                </TabsList>
            }

            {/* Filtro de Areas */}
            <div className="w-full relative z-20">
                <MultiSelect
                    values={selectedAreas}
                    onValuesChange={setSelectedAreas}
                >
                    <MultiSelectTrigger className="w-full md:w-96">
                        <MultiSelectValue placeholder="Filtrar por áreas" />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                        {availableAreas.map((areaVal) => (
                            <MultiSelectItem key={areaVal} value={areaVal}>
                                {areaVal}
                            </MultiSelectItem>
                        ))}
                    </MultiSelectContent>
                </MultiSelect>
            </div>

            {/* Resumen general y Grupos por ubicación renderizados condicionalmente */}
            {renderContent()}

            {
                modalOpen && (
                    <CheckImageModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        images={allImages}
                        initialIndex={selectedImgIndex}
                    />
                )
            }
        </div >
    );
};

export default ChecksImagesSection;