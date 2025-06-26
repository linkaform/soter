import React, { useState, useMemo } from 'react';
import Image from "next/image";
import { ImageModal } from '../modals/image-modal';
import Multiselect from "multiselect-react-dropdown";

interface ImageCarrouselProps {
    images: {
        hotel: string;
        habitacion: string;
        falla: string;
        image: { name: string; url: string };
    }[];
    cols?: string;
}

const PAGE_SIZE = 20;

const ImageCarrousel = ({ images, cols = '6' }: ImageCarrouselProps) => {
    const [page, setPage] = useState(1);
    const [selectedFallas, setSelectedFallas] = useState<string[]>([]);

    // 1. Obtener fallas únicas
    const fallas = useMemo(
        () =>
            Array.from(
                new Set(
                    images.map(img => img.falla).filter(Boolean)
                )
            ),
        [images]
    );

    // 2. Filtrar imágenes por falla seleccionada
    const filteredImages = useMemo(() => {
        if (selectedFallas.length === 0) return images;
        return images.filter(img => selectedFallas.includes(img.falla));
    }, [images, selectedFallas]);

    const gridCols = {
        '1': 'grid-cols-1',
        '2': 'grid-cols-2',
        '3': 'grid-cols-3',
        '4': 'grid-cols-4',
        '5': 'grid-cols-5',
        '6': 'grid-cols-[repeat(auto-fill,minmax(120px,1fr))]',
    }[cols] || 'grid-cols-[repeat(auto-fill,minmax(120px,1fr))]';

    const imagesToShow = filteredImages.slice(0, page * PAGE_SIZE);

    return (
        <div className="mx-6">
            <div className="flex mt-4 items-center flex-wrap gap-10">
                <div className="text-2xl">
                    Fotografías <span className="text-gray-500 ms-4">{filteredImages.length ?? 0} imágenes</span>
                </div>
                {/* 3. Multiselect de fallas */}
                <div className="min-w-[220px]">
                    <Multiselect
                        options={fallas}
                        isObject={false}
                        placeholder="Fallas"
                        selectedValues={selectedFallas}
                        onSelect={setSelectedFallas}
                        onRemove={setSelectedFallas}
                        showCheckbox
                        style={{
                            chips: { background: "#2563eb" },
                            multiselectContainer: { color: "#000" },
                        }}
                    />
                </div>
            </div>
            {imagesToShow.length === 0 ? (
                <div className="text-gray-400 text-center my-8">No hay imágenes para este hotel.</div>
            ) : (
                <div className={`grid ${gridCols} gap-4 mt-4`}>
                    {imagesToShow.map((imgObj, idx) => (
                        <ImageModal
                            key={idx}
                            title={"Hotel: " + (imgObj?.hotel || "Imagen")}
                            imgData={imgObj}
                            carrouselData={imagesToShow}
                        >
                            <Image
                                width={600}
                                height={600}
                                src={imgObj.image.url}
                                alt={imgObj.image.name || "Imagen"}
                                className="w-full h-full object-contain bg-gray-200 rounded-lg cursor-pointer"
                            />
                        </ImageModal>
                    ))}
                </div>
            )}
            {imagesToShow.length < filteredImages.length && (
                <div className="flex justify-center my-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        onClick={() => setPage(page + 1)}
                    >
                        Ver más
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageCarrousel;