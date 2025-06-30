import * as React from "react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";

interface CarrouselItem {
    falla: string;
    habitacion: string;
    hotel: string;
    comentario: string;
    image: { name: string; url: string };
}

interface SimpleCarrouselProps {
    data: CarrouselItem[];
}

const SimpleCarrousel: React.FC<SimpleCarrouselProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center text-gray-500 my-8">No hay imágenes.</div>;
    }

    return (
        <div className="flex flex-col items-center w-full">
            <Carousel className="w-full max-w-[90vw] md:max-w-[600px]">
                <CarouselContent>
                    {data.map((item, idx) => (
                        <CarouselItem key={idx}>
                            <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px] max-h-[80vh]">
                                <Image
                                    src={item.image.url}
                                    alt={item.image.name || "Imagen"}
                                    width={580}
                                    height={580}
                                    className="object-contain rounded-lg w-full h-auto max-h-[70vh] bg-gray-100"
                                    style={{ maxWidth: "100%", maxHeight: "70vh" }}
                                />
                                <div className="mt-4 text-center">
                                    <div className="font-semibold">Habitacion: {item.habitacion}</div>
                                    {item.falla && item.falla.trim() !== "" && (
                                        <div className="text-gray-600">
                                            Falla: {item.falla}
                                        </div>
                                    )}
                                    {item.comentario && item.comentario.trim() !== "" && (
                                        <div className="text-gray-600">
                                            Comentario: {item.comentario}
                                        </div>
                                    )}
                                </div>
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

export default SimpleCarrousel;