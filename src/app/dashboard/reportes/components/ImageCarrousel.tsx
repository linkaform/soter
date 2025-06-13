import React, { useState } from 'react';
import Image from "next/image";

const PAGE_SIZE = 20;

interface ImageCarrouselProps {
    hotelName: string
    images: HotelImage[]
    cols?: string
}

interface HotelImage {
    name: string
    url: string
}

const ImageCarrousel = ({ hotelName, images, cols = '6' }: ImageCarrouselProps) => {
    const [page, setPage] = useState(1);
    const gridCols = {
        '1': 'grid-cols-1',
        '2': 'grid-cols-2',
        '3': 'grid-cols-3',
        '4': 'grid-cols-4',
        '5': 'grid-cols-5',
        '6': 'grid-cols-[repeat(auto-fill,minmax(120px,1fr))]',
    }[cols] || 'grid-cols-[repeat(auto-fill,minmax(120px,1fr))]';

    const imagesToShow = images.slice(0, page * PAGE_SIZE);

    return (
        <div className="mx-6">
            <div className="flex justify-between mt-4">
                <div className="text-2xl">
                    {hotelName ?? ''} <span className="text-gray-500 ms-4">{images.length ?? 0} imágenes</span>
                </div>
            </div>
            {imagesToShow.length === 0 ? (
                <div className="text-gray-400 text-center my-8">No hay imágenes para este hotel.</div>
            ) : (
                <div className={`grid ${gridCols} gap-4 mt-4`}>
                    {imagesToShow.map((image, idx) => (
                        <div key={idx}>
                            <Image
                                width={200}
                                height={200}
                                src={image.url}
                                alt={image.name || "Imagen"}
                                className="w-full h-full object-contain bg-gray-200 rounded-lg"
                            />
                        </div>
                    ))}
                </div>
            )}
            {imagesToShow.length < images.length && (
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