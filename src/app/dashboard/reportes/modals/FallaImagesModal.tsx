import React, { useState, useMemo } from 'react';
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { MapPin, AlertTriangle, MessageSquare, Calendar, Camera } from 'lucide-react';

interface FallaDetalles {
    id: string;
    nes?: any;
    falla: string;
    comentario?: string | undefined;
    fecha?: string | undefined;
    imagenes: string[];
    folio?: string | undefined;
    estado?: string | undefined;
}

interface FallaImagesModalProps {
    children: React.ReactNode;
    falla: FallaDetalles;
    selectedImageIndex?: number; // Para empezar en una imagen específica
}

export const FallaImagesModal: React.FC<FallaImagesModalProps> = ({
    children,
    falla,
    selectedImageIndex = 0
}) => {
    const [open, setOpen] = useState(false);

    // Reordenar imágenes para que la seleccionada esté primera
    const orderedImages = useMemo(() => {
        if (!falla.imagenes?.length || selectedImageIndex === 0) {
            return falla.imagenes;
        }

        const reorderedImages = [...falla.imagenes];
        const selectedImage = reorderedImages.splice(selectedImageIndex, 1)[0];
        return [selectedImage, ...reorderedImages];
    }, [falla.imagenes, selectedImageIndex]);

    if (!falla.imagenes?.length) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-7xl h-[90vh] max-h-[90vh] flex flex-col overflow-hidden p-6">
                <DialogHeader className="flex-shrink-0 pb-4">
                    <DialogTitle className="text-xl font-bold text-center">
                        Detalles de la Falla
                    </DialogTitle>
                </DialogHeader>

                {/* Layout 50/50 */}
                <div className="flex flex-1 min-h-0 gap-6 overflow-hidden">
                    {/* Panel izquierdo - Información (50%) */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 border overflow-y-auto">
                        <div className="space-y-4">
                            {/* Información básica en grid */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-sm font-medium text-gray-700">Estado</span>
                                        <p className="text-base font-semibold text-blue-600 truncate">{falla.estado}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-blue-600 rounded text-white text-sm flex items-center justify-center font-bold flex-shrink-0">
                                        N
                                    </div>
                                    <div className="min-w-0">
                                        <span className="text-sm font-medium text-gray-700">NES</span>
                                        <p className="text-base font-semibold truncate">{falla.nes}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-green-600 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <span className="text-sm font-medium text-gray-700">Fecha</span>
                                        <p className="text-base">{falla.fecha}</p>
                                    </div>
                                </div>

                                {falla.folio && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-gray-600 rounded text-white text-sm flex items-center justify-center font-bold flex-shrink-0">
                                            F
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-sm font-medium text-gray-700">Folio</span>
                                            <p className="text-base truncate">{falla.folio}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Descripción de la falla */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-start gap-3 mb-3">
                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm font-medium text-gray-700">Descripción de la Falla</span>
                                </div>
                                <p className="text-sm text-gray-800 leading-relaxed">
                                    {falla.falla}
                                </p>
                            </div>

                            {/* Comentario si existe */}
                            {falla.comentario && (
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-start gap-3 mb-3">
                                        <MessageSquare className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm font-medium text-gray-700">Comentario</span>
                                    </div>
                                    <p className="text-sm text-gray-800 leading-relaxed">
                                        {falla.comentario}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Panel derecho - Carrusel de imágenes (50%) */}
                    <div className="flex-1 min-w-0 relative">
                        <Carousel className="w-full h-full">
                            <CarouselContent className="h-full">
                                {orderedImages.map((imageUrl, index) => (
                                    <CarouselItem key={index} className="h-full flex flex-col">
                                        {/* Contenedor de imagen con altura controlada */}
                                        <div className="flex-1 flex items-center justify-center min-h-0 p-4">
                                            <div className="relative flex items-center justify-center max-h-[70vh] max-w-full">
                                                <Image
                                                    src={imageUrl}
                                                    alt={`Falla ${index + 1}`}
                                                    width={600}
                                                    height={450}
                                                    className="object-contain rounded-lg shadow-lg"
                                                    style={{
                                                        maxHeight: "70vh",
                                                        maxWidth: "100%",
                                                        width: "auto",
                                                        height: "auto"
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Contador en la parte inferior */}
                                        <div className="flex-shrink-0 py-2 text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full shadow-md text-sm text-gray-700 border">
                                                <Camera className="w-4 h-4" />
                                                <span className="font-medium">
                                                    {index + 1} de {orderedImages.length}
                                                </span>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {/* Botones de navegación */}
                            {orderedImages.length > 1 && (
                                <>
                                    <CarouselPrevious
                                        className="left-2 w-8 h-8 bg-white/90 hover:bg-white shadow-lg border"
                                    />
                                    <CarouselNext
                                        className="right-2 w-8 h-8 bg-white/90 hover:bg-white shadow-lg border"
                                    />
                                </>
                            )}
                        </Carousel>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FallaImagesModal;