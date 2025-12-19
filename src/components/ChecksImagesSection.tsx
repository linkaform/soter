"use client"
import React, { useState } from 'react';
import { MapPin, Camera, MessageSquare, Calendar, ChevronDown } from 'lucide-react';
import Image from "next/image";
import { TabsList, TabsTrigger } from './ui/tabs';
import { useRondinesImages } from '@/hooks/Rondines/useRondinesImages';
import CheckImageModal, { CheckData as CheckDataType } from "@/components/modals/CheckImageModal";

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
    area: string;
    showTabs:boolean;
}

interface UbicacionGroup {
    ubicacion: string;
    totalImagenes: number;
    totalChecks: number;
    checks: CheckData[];
}

const ChecksImagesSection: React.FC<ChecksImagesSectionProps> = ({
    location,
    area,
    showTabs
}) => {
    const [visibleItems, setVisibleItems] = useState<{ [ubicacion: string]: number }>({});
    const [loadingMore, setLoadingMore] = useState<{ [ubicacion: string]: boolean }>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCheck, setSelectedCheck] = useState<CheckDataType | null>(null);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);
    const { data: checksData, isLoading: isLoadingImages } = useRondinesImages(true, location, area, '', '', 50, 0);

    const ITEMS_PER_PAGE = 6;

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

    const isValidImageUrl = (url: string): boolean => {
        if (!url) return false;
        const invalidPatterns = ['not-found', '404', 'error', 'placeholder', 'default-image'];
        return !invalidPatterns.some(pattern => url.toLowerCase().includes(pattern));
    };

    if (isLoadingImages) {
        return (
            <>
            {showTabs &&
            <TabsList className="bg-blue-500 text-white p-1 rounded-md">
                <TabsTrigger value="Bitacora">Bitácora</TabsTrigger>
                <TabsTrigger value="Rondines">Rondines</TabsTrigger>
                <TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
                <TabsTrigger value="Fotos">Fotos</TabsTrigger>
                <TabsTrigger value="Calendario">Calendario</TabsTrigger>
            </TabsList>}
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando imágenes...</span>
            </div>
            </>
        );
    }

    if (ubicacionesAgrupadas.length === 0) {
        return (
            <>
            {showTabs &&
            <TabsList className="bg-blue-500 text-white p-1 rounded-md">
                <TabsTrigger value="Bitacora">Bitácora</TabsTrigger>
                <TabsTrigger value="Rondines">Rondines</TabsTrigger>
                <TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
                <TabsTrigger value="Fotos">Fotos</TabsTrigger>
                <TabsTrigger value="Calendario">Calendario</TabsTrigger>
            </TabsList>}
            <div className="text-center text-gray-500 py-12">
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <div className="text-lg font-medium">No hay imágenes disponibles</div>
                <div className="text-sm">
                    No se encontraron checks con fotografías en los datos seleccionados.
                </div>
            </div>
            </>
        );
    }

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

                        {/* Grid de checks con imágenes */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {checksVisibles.map((check) => (
                                    <div
                                        key={`${check.id}-${check.ref_number}`}
                                        className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        {/* Header del check */}
                                        <div className="p-4 border-b bg-gray-50">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-sm font-medium text-blue-600">
                                                    {check.nombre_recorrido}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {check.fecha_y_hora_check}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-800 line-clamp-2" title={check.nombre_area}>
                                                {check.nombre_area.length > 80
                                                    ? `${check.nombre_area.substring(0, 80)}...`
                                                    : check.nombre_area
                                                }
                                            </div>
                                            {check.folio && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Folio: {check.folio}
                                                </div>
                                            )}
                                        </div>

                                        {/* Grid de imágenes */}
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 gap-2">
                                                {check.fotos_check
                                                    .filter(img => isValidImageUrl(img.file_url))
                                                    .slice(0, 4)
                                                    .map((img, imgIndex) => (
                                                        <div
                                                            key={`${check.id}-${check.ref_number}-${imgIndex}`}
                                                            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                                            onClick={() => {
                                                                setSelectedCheck(check);
                                                                setSelectedImgIndex(imgIndex);
                                                                setModalOpen(true);
                                                            }}
                                                        >
                                                            <Image
                                                                width={200}
                                                                height={200}
                                                                src={img.file_url}
                                                                alt={img.file_name}
                                                                className="w-full h-full object-cover bg-gray-200"
                                                                loading="lazy"
                                                                unoptimized
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                                                        </div>
                                                    ))
                                                }

                                                {/* Botón "más imágenes" */}
                                                {check.fotos_check.filter(img => isValidImageUrl(img.file_url)).length > 4 && (
                                                    <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-600 text-sm font-medium cursor-pointer hover:bg-gray-200 transition-colors">
                                                        <Camera className="w-6 h-6 mb-1" />
                                                        <span>+{check.fotos_check.filter(img => isValidImageUrl(img.file_url)).length - 4} más</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Comentario si existe */}
                                            {check.comentario_check && (
                                                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                                    <div className="flex items-start gap-2">
                                                        <MessageSquare className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                        <div className="text-yellow-800">
                                                            <strong>Comentario:</strong> {check.comentario_check}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
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
                                                Ver más ({grupo.totalChecks - visibleCount} restantes)
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Indicador cuando se han mostrado todas */}
                            {!tieneMore && grupo.totalChecks > ITEMS_PER_PAGE && (
                                <div className="mt-8 text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                                        ✓ Se han mostrado todos los {grupo.totalChecks} checks de {grupo.ubicacion}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {selectedCheck && (
                <CheckImageModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    check={selectedCheck}
                    initialIndex={selectedImgIndex}
                />
            )}
        </div>
    );
};

export default ChecksImagesSection;