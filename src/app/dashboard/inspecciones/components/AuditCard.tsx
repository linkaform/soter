import {
    FileCheck,
    FileDown,
    Calendar,
    MapPin,
    AlertTriangle,
    CheckCircle,
    MessageSquare,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import FallaImagesModal from '@/app/dashboard/inspecciones/modals/FallaImagesModal';
import CommentsModal from '@/app/dashboard/inspecciones/modals/CommentsModal';
import { FallaDetalle } from '../utils/dataProcessors';

interface AuditCardProps {
    auditData: any;
    onDownloadReport?: (auditId: string) => void;
    onImageModal?: (imageUrl: string, auditData: any) => void;
}

const AuditCard = ({ auditData, onDownloadReport, onImageModal }: AuditCardProps) => {
    const [downloading, setDownloading] = useState(false);
    const [imgIndexes, setImgIndexes] = useState([0, 1, 2, 3]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const shouldRotateRef = useRef(true);

    // Extraer datos principales ANTES de cualquier return
    const audit = auditData?.audit?.[0] || {};
    const recordId = auditData?._id || '';
    const folio = auditData?.folio || 'Sin folio';
    const zona = auditData?.zona || 'Sin zona';
    const createdAt = auditData?.created_at || '';
    const nes = auditData?.nes || 'Sin NES';
    const accionesCorrectivas = auditData?.acciones_correctivas || 0;

    // Extraer datos de la auditoría
    const aciertos = audit.aciertos || 0;
    const fallasCount = audit.fallas || 0;
    const maxPoints = audit.max_points || 0;
    const obtainedPoints = audit.obtained_points || 0;

    // Extraer fallas del field_label
    const fieldLabel = audit.field_label || {};
    const fallas = Object.entries(fieldLabel).map(([id, descripcion]) => ({
        id,
        descripcion: String(descripcion)
    }));

    // Extraer todas las URLs de media
    const media = audit.media || {};
    const allMediaUrls: string[] = Object.values(media)
        .flatMap((arr: any) =>
            Array.isArray(arr)
                ? arr.map((item: any) => item.file_url).filter(Boolean)
                : []
        );

    const allMediaUrlsLength = allMediaUrls.length;
    const allMediaUrlsJoined = allMediaUrls.join(",");

    // Función para formatear la data de auditoría al formato FallaDetalle - MOVIDA AQUÍ
    const formatAuditDataToFallaDetalle = (auditData: any): FallaDetalle[] => {
        if (!auditData?.audit?.[0]) return [];

        const audit = auditData.audit[0];
        const fieldLabel = audit.field_label || {};
        const comments = audit.comments || {};
        const media = audit.media || {};

        const fallasDetalle: FallaDetalle[] = [];

        Object.keys(fieldLabel).forEach(fallaId => {
            const falla = fieldLabel[fallaId];
            const comentario = comments[fallaId] || '';
            const mediaArray = media[fallaId] || [];

            // Extraer URLs de imágenes
            const imagenes: string[] = [];
            if (Array.isArray(mediaArray)) {
                mediaArray.forEach(mediaItem => {
                    if (mediaItem.file_url) {
                        imagenes.push(mediaItem.file_url);
                    }
                });
            }

            // Solo crear FallaDetalle si tiene falla (descripción)
            if (falla) {
                const fallaDetalle: FallaDetalle = {
                    id: fallaId,
                    falla: falla,
                    comentario: comentario,
                    imagenes: imagenes,
                    folio: auditData.folio || 'Sin folio',
                    fecha: auditData.created_at || '',
                    estado: auditData.zona || 'Sin zona',
                    nes: auditData.nes || 'Sin NES'
                };

                fallasDetalle.push(fallaDetalle);
            }
        });

        return fallasDetalle;
    };

    // TODOS LOS HOOKS DEBEN IR ANTES DE CUALQUIER RETURN CONDICIONAL

    // Crear fallas formateadas una sola vez y memorizarlas - MOVIDO AQUÍ
    const fallasFormateadas = React.useMemo(() => {
        return formatAuditDataToFallaDetalle(auditData);
    }, [auditData]);

    // Función para encontrar la falla específica por URL de imagen - MOVIDA AQUÍ
    const findFallaByImageUrl = (imageUrl: string): FallaDetalle | null => {
        for (const falla of fallasFormateadas) {
            const imageIndex = falla.imagenes.indexOf(imageUrl);
            if (imageIndex !== -1) {
                return falla;
            }
        }
        return null;
    };

    // Función para obtener el índice de imagen dentro de la falla - MOVIDA AQUÍ
    const getImageIndexInFalla = (imageUrl: string, falla: FallaDetalle): number => {
        return falla.imagenes.indexOf(imageUrl);
    };

    // Función para pausar/reanudar rotación
    const pauseRotation = () => {
        shouldRotateRef.current = false;
    };

    const resumeRotation = () => {
        shouldRotateRef.current = true;
    };

    // useEffect modificado - solo cambia imgIndexes, no afecta el modal
    useEffect(() => {
        if (allMediaUrlsLength <= 4) {
            setImgIndexes([0, 1, 2, 3]);
            return;
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            if (shouldRotateRef.current) {
                setImgIndexes(() => {
                    const newIndexes: number[] = [];
                    while (newIndexes.length < 4) {
                        const idx = Math.floor(Math.random() * allMediaUrlsLength);
                        if (!newIndexes.includes(idx)) {
                            newIndexes.push(idx);
                        }
                    }
                    return newIndexes;
                });
            }
        }, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [allMediaUrlsLength, allMediaUrlsJoined]);

    // Limpiar al desmontar
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    // AHORA SÍ, verificar si hay datos de auditoría DESPUÉS de todos los hooks
    if (!auditData || !auditData.audit || auditData.audit.length === 0) {
        return (
            <div className="flex w-full h-80 items-center justify-center">
                <div className="text-center text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <div className="text-lg font-medium">No hay auditoría realizada</div>
                    <div className="text-sm">Selecciona un elemento con auditoría completada</div>
                </div>
            </div>
        );
    }

    // Función para descargar reporte
    const handleDownloadReport = async () => {
        if (downloading || !onDownloadReport) return;
        setDownloading(true);
        try {
            await onDownloadReport(recordId);
        } catch (error) {
            console.error('Error descargando reporte:', error);
        } finally {
            setDownloading(false);
        }
    };

    // Función modificada para manejar click en imagen
    const handleImageClick = (url: string) => {
        const falla = findFallaByImageUrl(url);
        if (falla) {
            // El modal se abrirá automáticamente al hacer click
            return;
        }

        // Fallback al método original si no se encuentra la falla
        if (onImageModal) {
            onImageModal(url, auditData);
        }
    };

    // Determinar el estado simple: Con fallas o Sin fallas
    const getAuditStatus = () => {
        if (fallasCount > 0) {
            return {
                label: 'Con Fallas',
                icon: <AlertTriangle className="w-4 h-4" />,
                bgColor: 'bg-red-100 text-red-800 border-red-300'
            };
        }
        return {
            label: 'Sin Fallas',
            icon: <CheckCircle className="w-4 h-4" />,
            bgColor: 'bg-green-100 text-green-800 border-green-300'
        };
    };

    const auditStatus = getAuditStatus();
    const porcentajeCalificacion = maxPoints > 0 ? (obtainedPoints / maxPoints) * 100 : 0;

    return (
        <div className="flex w-full h-full gap-4"> {/* Cambiar h-80 por h-full */}
            {/* Sección de imágenes */}
            <div
                className="w-2/5 flex items-center justify-center"
                onMouseEnter={pauseRotation}
                onMouseLeave={resumeRotation}
            >
                <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">
                    {[0, 1, 2, 3].map(gridIndex => {
                        const imgUrl = allMediaUrls[imgIndexes[gridIndex]];
                        const falla = imgUrl ? findFallaByImageUrl(imgUrl) : null;
                        const imageIndex = falla && imgUrl ? getImageIndexInFalla(imgUrl, falla) : 0;

                        return falla && imgUrl ? (
                            // Key estable basado en la posición del grid, no en la imagen
                            <FallaImagesModal
                                key={`grid-${gridIndex}`}
                                falla={falla}
                                selectedImageIndex={imageIndex}
                            >
                                <Image
                                    width={100}
                                    height={100}
                                    src={imgUrl}
                                    alt={`Auditoría ${folio}`}
                                    className="w-full h-full bg-gray-200 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                />
                            </FallaImagesModal>
                        ) : (
                            <Image
                                key={`grid-empty-${gridIndex}`}
                                width={100}
                                height={100}
                                src={imgUrl || "/nouser.svg"}
                                alt={`Auditoría ${folio}`}
                                className="w-full h-full bg-gray-200 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => imgUrl && handleImageClick(imgUrl)}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Sección de información */}
            <div className="w-3/5">
                <ScrollArea className="w-full h-full">
                    <div className="p-4 flex flex-col gap-4">
                        {/* Header con folio y acciones */}
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-2xl font-semibold">{folio}</div>
                                <div className="text-sm text-gray-600 flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {zona} - {nes}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    {createdAt}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {onDownloadReport && (
                                    <Button
                                        onClick={handleDownloadReport}
                                        disabled={downloading}
                                        size="sm"
                                        variant="outline"
                                        className={downloading ? "opacity-50 cursor-not-allowed" : ""}
                                        title="Descargar Reporte PDF"
                                    >
                                        <FileDown className="w-4 h-4" />
                                    </Button>
                                )}

                                <CommentsModal auditData={auditData}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        title="Ver Comentarios Detallados"
                                        className="hover:bg-yellow-50 hover:border-yellow-300"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                    </Button>
                                </CommentsModal>

                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${auditStatus.bgColor}`}>
                                    <div className="flex items-center gap-1">
                                        {auditStatus.icon}
                                        {auditStatus.label}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Métricas principales */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="text-blue-600 font-medium">Calificación</div>
                                <div className="text-xl font-bold text-blue-800">
                                    {porcentajeCalificacion.toFixed(1)}%
                                </div>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                                <div className="text-green-600 font-medium">Aciertos</div>
                                <div className="text-xl font-bold text-green-800">{aciertos}</div>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg">
                                <div className="text-red-600 font-medium">Fallas</div>
                                <div className="text-xl font-bold text-red-800">{fallasCount}</div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-gray-600 font-medium">Acciones correctivas</div>
                                <div className="text-xl font-bold text-gray-800">{accionesCorrectivas}</div>
                            </div>
                        </div>

                        {/* Barra de progreso */}
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Progreso General</span>
                                <span className="text-sm font-bold text-gray-900">
                                    {porcentajeCalificacion.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-500 ${porcentajeCalificacion >= 80 ? 'bg-green-500' :
                                        porcentajeCalificacion >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                    style={{ width: `${Math.min(porcentajeCalificacion, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Lista de fallas - keys estables */}
                        {fallas.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <FileCheck className="w-4 h-4 text-red-600" />
                                    <span className="font-medium text-sm">
                                        Fallas Detectadas ({fallas.length})
                                    </span>
                                </div>
                                {/* REMOVIDO: max-h-40 overflow-y-auto - ahora se extiende naturalmente */}
                                <div className="space-y-1">
                                    {fallas.map((falla, index) => {
                                        const fallaFormateada = fallasFormateadas.find(f => f.id === falla.id);
                                        const hasDetalle = fallaFormateada && (
                                            (fallaFormateada.imagenes && fallaFormateada.imagenes.length > 0)
                                        );

                                        return hasDetalle ? (
                                            <FallaImagesModal
                                                key={`falla-${falla.id}`}
                                                falla={fallaFormateada}
                                                selectedImageIndex={0}
                                            >
                                                <div
                                                    className="bg-red-50 border border-red-200 rounded p-2 text-xs cursor-pointer hover:bg-red-100 transition-colors"
                                                    title={`${falla.descripcion} - Click para ver detalles e imágenes`}
                                                >
                                                    <div className="text-red-800 font-medium">
                                                        {index + 1}. {falla.descripcion.length > 80
                                                            ? `${falla.descripcion.substring(0, 80)}...`
                                                            : falla.descripcion
                                                        }
                                                    </div>
                                                </div>
                                            </FallaImagesModal>
                                        ) : (
                                            <div
                                                key={`falla-no-modal-${falla.id}`}
                                                className="bg-red-50 border border-red-200 rounded p-2 text-xs"
                                                title={falla.descripcion}
                                            >
                                                <div className="text-red-800 font-medium">
                                                    {index + 1}. {falla.descripcion.length > 80
                                                        ? `${falla.descripcion.substring(0, 80)}...`
                                                        : falla.descripcion
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="font-medium text-sm text-green-700">
                                        ¡Sin Fallas Detectadas!
                                    </span>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
                                    <div className="text-green-800 text-sm">
                                        Esta auditoría fue completada exitosamente sin fallas.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default AuditCard;