import * as React from "react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";

interface HabitacionImageCarouselProps {
    images: {
        url: string;
        name?: string;
        falla?: string; // <-- Añade esto
    }[];
    initialImageUrl?: string;
}

const HabitacionImageCarousel: React.FC<HabitacionImageCarouselProps> = ({ images, initialImageUrl }) => {
    // Reordena el array para que la imagen seleccionada esté primero
    const orderedImages = React.useMemo(() => {
        if (!initialImageUrl) return images;
        const idx = images.findIndex(img => img.url === initialImageUrl);
        if (idx === -1) return images;
        const rest = images.filter((img, i) => i !== idx);
        return [images[idx], ...rest];
    }, [images, initialImageUrl]);

    if (!orderedImages || orderedImages.length === 0) {
        return <div className="text-center text-gray-500 my-8">No hay imágenes.</div>;
    }

    return (
        <div className="flex flex-col items-center w-full">
            <Carousel className="w-full max-w-[90vw] md:max-w-[600px]">
                <CarouselContent>
                    {orderedImages.map((img, idx) => (
                        <CarouselItem key={idx}>
                            <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] max-h-[80vh]">
                                <Image
                                    src={img.url}
                                    alt={img.name || "Imagen"}
                                    width={580}
                                    height={580}
                                    className="object-contain rounded-lg w-full h-auto max-h-[70vh] bg-gray-100"
                                    style={{ maxWidth: "100%", maxHeight: "70vh" }}
                                />
                                {img.falla && (
                                    <div className="mt-2 text-center text-sm text-red-600 font-semibold">
                                        <span className="text-black">Falla: </span>{img.falla}
                                    </div>
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default HabitacionImageCarousel;