import React, { useState } from 'react';
import { FallaDetalle } from '../utils/dataProcessors';
import { MapPin, Camera, MessageSquare, Calendar, ChevronDown, Filter, AlertTriangle } from 'lucide-react';
import Image from "next/image";
import Multiselect from "multiselect-react-dropdown";
import FallaImagesModal from '@/app/dashboard/inspecciones/modals/FallaImagesModal';

interface State {
    id: string;
    name: string;
}

interface Falla {
    id: string;
    label: string;
    total: number;
}

interface ImagesSectionProps {
    fallasDetalle: FallaDetalle[];
    isLoading?: boolean;
    states?: State[];
    fallas?: Falla[]; // Nueva prop para las fallas
}

interface EstadoGroup {
    estado: string;
    totalImagenes: number;
    totalFallas: number;
    fallas: FallaDetalle[];
}

const ImagesSection: React.FC<ImagesSectionProps> = ({
    fallasDetalle,
    isLoading = false,
    states = [],
    fallas = []
}) => {
    const [visibleItems, setVisibleItems] = useState<{ [estado: string]: number }>({});
    const [loadingMore, setLoadingMore] = useState<{ [estado: string]: boolean }>({});

    // Estados para los filtros
    const [selectedStatesFilter, setSelectedStatesFilter] = useState<State[]>([]);
    const [selectedFallasFilter, setSelectedFallasFilter] = useState<Falla[]>([]); // Nuevo estado para filtro de fallas

    // Agregar un estado para forzar re-render de los multiselects
    const [multiselectKey, setMultiselectKey] = useState(0);

    const ITEMS_PER_PAGE = 6;

    // Función para filtrar fallasDetalle según los filtros seleccionados
    const getFallasFiltradas = (): FallaDetalle[] => {
        let fallasFiltradas = fallasDetalle;

        // Filtrar por estados si hay selección
        if (selectedStatesFilter.length > 0) {
            const estadosSeleccionados = selectedStatesFilter.map(state => state.name);
            fallasFiltradas = fallasFiltradas.filter(falla =>
                estadosSeleccionados.includes(falla.estado || '')
            );
        }

        // Filtrar por fallas si hay selección
        if (selectedFallasFilter.length > 0) {
            const fallasSeleccionadas = selectedFallasFilter.map(falla => falla.id);
            fallasFiltradas = fallasFiltradas.filter(falla =>
                fallasSeleccionadas.includes(falla.id)
            );
        }

        return fallasFiltradas;
    };

    // Agrupar fallas por estado (usando las fallas filtradas)
    const agruparPorEstado = (): EstadoGroup[] => {
        const fallasFiltradas = getFallasFiltradas();
        const grupos: { [estado: string]: FallaDetalle[] } = {};

        fallasFiltradas
            .filter(falla => falla.imagenes.length > 0)
            .forEach(falla => {
                const estado = falla.estado || 'Sin estado';
                if (!grupos[estado]) {
                    grupos[estado] = [];
                }
                grupos[estado].push(falla);
            });

        return Object.entries(grupos)
            .map(([estado, fallas]) => {
                if (!(estado in visibleItems)) {
                    setVisibleItems(prev => ({
                        ...prev,
                        [estado]: Math.min(ITEMS_PER_PAGE, fallas.length)
                    }));
                }

                return {
                    estado,
                    totalImagenes: fallas.reduce((sum, falla) => sum + falla.imagenes.length, 0),
                    totalFallas: fallas.length,
                    fallas: fallas.sort((a, b) => (a.fecha || '').localeCompare(b.fecha || ''))
                };
            })
            .sort((a, b) => a.estado.localeCompare(b.estado));
    };

    const estadosAgrupados = agruparPorEstado();

    // Limpiar visibleItems cuando cambian los filtros
    React.useEffect(() => {
        setVisibleItems({});
    }, [selectedStatesFilter, selectedFallasFilter]);

    const handleLoadMore = async (estado: string) => {
        setLoadingMore(prev => ({ ...prev, [estado]: true }));

        // Simular pequeño delay para mejor UX
        await new Promise(resolve => setTimeout(resolve, 300));

        setVisibleItems(prev => {
            const currentVisible = prev[estado] || ITEMS_PER_PAGE;
            const grupo = estadosAgrupados.find(g => g.estado === estado);
            const newVisible = Math.min(currentVisible + ITEMS_PER_PAGE, grupo?.totalFallas || 0);

            return {
                ...prev,
                [estado]: newVisible
            };
        });

        setLoadingMore(prev => ({ ...prev, [estado]: false }));
    };

    const getFallasVisibles = (grupo: EstadoGroup) => {
        const visibleCount = visibleItems[grupo.estado] || ITEMS_PER_PAGE;
        return grupo.fallas.slice(0, visibleCount);
    };

    const hasMoreItems = (grupo: EstadoGroup) => {
        const visibleCount = visibleItems[grupo.estado] || ITEMS_PER_PAGE;
        return visibleCount < grupo.totalFallas;
    };

    // Función para limpiar todos los filtros
    const handleClearAllFilters = () => {
        setSelectedStatesFilter([]);
        setSelectedFallasFilter([]);
        setMultiselectKey(prev => prev + 1); // Forzar re-render
    };

    // Función para limpiar filtro de estados
    const handleClearStatesFilter = () => {
        setSelectedStatesFilter([]);
        setMultiselectKey(prev => prev + 1); // Forzar re-render
    };

    // Función para limpiar filtro de fallas
    const handleClearFallasFilter = () => {
        setSelectedFallasFilter([]);
        setMultiselectKey(prev => prev + 1); // Forzar re-render
    };

    // Función para truncar las fallas manteniendo la estructura original
    const truncateFallasLabels = (fallas: Falla[], maxLength: number = 30): Falla[] => {
        return fallas.map(falla => ({
            ...falla,
            label: falla.label.length > maxLength
                ? falla.label.substring(0, maxLength) + '...'
                : falla.label
        }));
    };

    // Usar la función para crear las fallas con labels truncados
    const fallasTruncadas = truncateFallasLabels(fallas, 30);

    // Función para verificar si una URL es válida
    const isValidImageUrl = (url: string): boolean => {
        if (!url) return false;

        // Patrones de URLs que sabemos que fallan
        const invalidPatterns = [
            'not-found',
            '404',
            'error',
            'placeholder',
            'default-image',
            'app.linkaform.com' // Agregar este dominio problemático
        ];

        return !invalidPatterns.some(pattern => url.toLowerCase().includes(pattern));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Cargando imágenes...</span>
            </div>
        );
    }

    if (estadosAgrupados.length === 0) {
        const totalFallasConImagenes = fallasDetalle.filter(f => f.imagenes.length > 0).length;
        const hayFiltrosActivos = selectedStatesFilter.length > 0 || selectedFallasFilter.length > 0;
        const mensajeNoResultados = hayFiltrosActivos && totalFallasConImagenes > 0
            ? "No hay imágenes que coincidan con los filtros seleccionados"
            : "No hay imágenes disponibles";

        return (
            <div className="space-y-4">
                {/* Sección de Filtros */}
                {(states.length > 0 || fallas.length > 0) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-5 h-5 text-gray-600" />
                                <h3 className="font-semibold text-gray-800">Filtros</h3>
                            </div>
                            {(selectedStatesFilter.length > 0 || selectedFallasFilter.length > 0) && (
                                <button
                                    onClick={handleClearAllFilters}
                                    className="text-sm text-red-600 hover:text-red-800 underline"
                                >
                                    Limpiar todos los filtros
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {/* Filtro por Estados */}
                            {states.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">Por Estado</label>
                                        {selectedStatesFilter.length > 0 && (
                                            <button
                                                onClick={handleClearStatesFilter}
                                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                                            >
                                                Limpiar
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1">
                                            <Multiselect
                                                key={`states-${multiselectKey}`} // Agregar esta línea
                                                options={states}
                                                displayValue="name"
                                                placeholder="Seleccionar estados..."
                                                selectedValues={selectedStatesFilter}
                                                onSelect={setSelectedStatesFilter}
                                                onRemove={setSelectedStatesFilter}
                                                style={{
                                                    chips: { background: '#3B82F6', color: 'white' },
                                                    searchBox: { border: '1px solid #D1D5DB', borderRadius: '6px' }
                                                }}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-600 min-w-max">
                                            {selectedStatesFilter.length > 0
                                                ? `${selectedStatesFilter.length} estado(s)`
                                                : 'Todos'
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Filtro por Fallas */}
                            {fallas.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">Por Tipo de Falla</label>
                                        {selectedFallasFilter.length > 0 && (
                                            <button
                                                onClick={handleClearFallasFilter}
                                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                                            >
                                                Limpiar
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="flex-1">
                                            <Multiselect
                                                key={`fallas-${multiselectKey}`} // Agregar esta línea
                                                options={fallasTruncadas}
                                                displayValue="label"
                                                placeholder="Seleccionar fallas..."
                                                selectedValues={selectedFallasFilter}
                                                onSelect={setSelectedFallasFilter}
                                                onRemove={setSelectedFallasFilter}
                                                style={{
                                                    chips: { background: '#EF4444', color: 'white', fontSize: '12px' },
                                                    searchBox: { border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }
                                                }}
                                            />
                                        </div>
                                        <div className="text-xs text-gray-600 min-w-max">
                                            {selectedFallasFilter.length > 0
                                                ? `${selectedFallasFilter.length} falla(s)`
                                                : 'Todas'
                                            }
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="text-center text-gray-500 py-12">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <div className="text-lg font-medium">{mensajeNoResultados}</div>
                    <div className="text-sm">
                        {hayFiltrosActivos
                            ? "Intenta ajustar los filtros o limpia la selección."
                            : "No se encontraron fallas con fotografías en los datos seleccionados."
                        }
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Sección de Filtros */}
            {(states.length > 0 || fallas.length > 0) && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-800">Filtros</h3>
                        </div>
                        {(selectedStatesFilter.length > 0 || selectedFallasFilter.length > 0) && (
                            <button
                                onClick={handleClearAllFilters}
                                className="text-sm text-red-600 hover:text-red-800 underline"
                            >
                                Limpiar todos los filtros
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Filtro por Estados */}
                        {states.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        Por Estado
                                    </label>
                                    {selectedStatesFilter.length > 0 && (
                                        <button
                                            onClick={handleClearStatesFilter}
                                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                                        >
                                            Limpiar
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className="flex-1">
                                        <Multiselect
                                            key={`states-${multiselectKey}`} // Agregar esta línea
                                            options={states}
                                            displayValue="name"
                                            placeholder="Seleccionar estados..."
                                            selectedValues={selectedStatesFilter}
                                            onSelect={setSelectedStatesFilter}
                                            onRemove={setSelectedStatesFilter}
                                            style={{
                                                chips: { background: '#3B82F6', color: 'white', fontSize: '12px' },
                                                searchBox: { border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }
                                            }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-600 min-w-max">
                                        {selectedStatesFilter.length > 0
                                            ? `${selectedStatesFilter.length} estado(s)`
                                            : 'Todos'
                                        }
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Filtro por Fallas */}
                        {fallas.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        Por Tipo de Falla
                                    </label>
                                    {selectedFallasFilter.length > 0 && (
                                        <button
                                            onClick={handleClearFallasFilter}
                                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                                        >
                                            Limpiar
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2 items-center">
                                    <div className="flex-1">
                                        <Multiselect
                                            key={`fallas-${multiselectKey}`} // Agregar esta línea
                                            options={fallasTruncadas}
                                            displayValue="label"
                                            placeholder="Seleccionar fallas..."
                                            selectedValues={selectedFallasFilter}
                                            onSelect={setSelectedFallasFilter}
                                            onRemove={setSelectedFallasFilter}
                                            style={{
                                                chips: { background: '#EF4444', color: 'white', fontSize: '12px' },
                                                searchBox: { border: '1px solid #D1D5DB', borderRadius: '6px', fontSize: '14px' }
                                            }}
                                        />
                                    </div>
                                    <div className="text-xs text-gray-600 min-w-max">
                                        {selectedFallasFilter.length > 0
                                            ? `${selectedFallasFilter.length} falla(s)`
                                            : 'Todas'
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Resumen general */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-blue-800">Resumen de Imágenes</h3>
                        {(selectedStatesFilter.length > 0 || selectedFallasFilter.length > 0) && (
                            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                                Filtrado
                            </span>
                        )}
                    </div>
                    <div className="text-sm text-blue-700">
                        <span className="font-medium">{estadosAgrupados.length}</span> estados •
                        <span className="font-medium ml-1">
                            {estadosAgrupados.reduce((sum, grupo) => sum + grupo.totalImagenes, 0)}
                        </span> imágenes •
                        <span className="font-medium ml-1">
                            {estadosAgrupados.reduce((sum, grupo) => sum + grupo.totalFallas, 0)}
                        </span> fallas
                    </div>
                </div>
            </div>

            {/* Grupos por estado */}
            {estadosAgrupados.map((grupo) => {
                const fallasVisibles = getFallasVisibles(grupo);
                const tieneMore = hasMoreItems(grupo);
                const isLoadingState = loadingMore[grupo.estado];
                const visibleCount = visibleItems[grupo.estado] || ITEMS_PER_PAGE;

                return (
                    <div key={grupo.estado} className="border rounded-lg overflow-hidden">
                        {/* Header del estado */}
                        <div className="bg-gray-50 border-b px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        {grupo.estado}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="text-xs bg-gray-200 px-2 py-1 rounded">
                                        Mostrando {visibleCount} de {grupo.totalFallas}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Camera className="w-4 h-4" />
                                        <span>{grupo.totalImagenes} fotos</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>{grupo.totalFallas} fallas</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grid de fallas con imágenes */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {fallasVisibles.map((falla, fallaIndex) => (
                                    <div
                                        key={`${falla.id}-${fallaIndex}`}
                                        className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        {/* Header de la falla */}
                                        <div className="p-4 border-b bg-gray-50">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-sm font-medium text-blue-600">
                                                    Area: {falla.nes}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {falla.fecha}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-800 line-clamp-2" title={falla.falla}>
                                                {falla.falla.length > 80
                                                    ? `${falla.falla.substring(0, 80)}...`
                                                    : falla.falla
                                                }
                                            </div>
                                            {falla.folio && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Folio: {falla.folio}
                                                </div>
                                            )}
                                        </div>

                                        {/* Grid de imágenes */}
                                        <div className="p-4">
                                            <div className="grid grid-cols-2 gap-2">
                                                {falla.imagenes
                                                    .filter(imageUrl => isValidImageUrl(imageUrl)) // FILTRAR ANTES DE RENDERIZAR
                                                    .slice(0, 4)
                                                    .map((imageUrl, imgIndex) => (
                                                        <FallaImagesModal
                                                            key={imgIndex}
                                                            falla={{
                                                                ...falla,
                                                                imagenes: falla.imagenes.filter(img => isValidImageUrl(img)) // Solo imágenes válidas
                                                            }}
                                                            selectedImageIndex={imgIndex}
                                                        >
                                                            <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                                                                <Image
                                                                    width={200}
                                                                    height={200}
                                                                    src={imageUrl}
                                                                    alt={`Falla ${fallaIndex}-${imgIndex}`}
                                                                    className="w-full h-full object-cover bg-gray-200"
                                                                    loading="lazy"
                                                                    unoptimized
                                                                />
                                                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                                                                    <Camera className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                                                                </div>
                                                            </div>
                                                        </FallaImagesModal>
                                                    ))
                                                }

                                                {/* Botón "más imágenes" solo si hay imágenes válidas adicionales */}
                                                {falla.imagenes.filter(img => isValidImageUrl(img)).length > 4 && (
                                                    <FallaImagesModal
                                                        falla={{
                                                            ...falla,
                                                            imagenes: falla.imagenes.filter(img => isValidImageUrl(img))
                                                        }}
                                                        selectedImageIndex={4}
                                                    >
                                                        <div className="aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-600 text-sm font-medium cursor-pointer hover:bg-gray-200 transition-colors">
                                                            <Camera className="w-6 h-6 mb-1" />
                                                            <span>+{falla.imagenes.filter(img => isValidImageUrl(img)).length - 4} más</span>
                                                        </div>
                                                    </FallaImagesModal>
                                                )}
                                            </div>

                                            {/* Comentario si existe */}
                                            {falla.comentario && (
                                                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                                                    <div className="flex items-start gap-2">
                                                        <MessageSquare className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                                        <div className="text-yellow-800">
                                                            <strong>Comentario:</strong> {falla.comentario}
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
                                        onClick={() => handleLoadMore(grupo.estado)}
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
                                                Ver más ({grupo.totalFallas - visibleCount} restantes)
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Indicador cuando se han mostrado todas */}
                            {!tieneMore && grupo.totalFallas > ITEMS_PER_PAGE && (
                                <div className="mt-8 text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                                        ✓ Se han mostrado todas las {grupo.totalFallas} fallas de {grupo.estado}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ImagesSection;