"use client";

import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; 

export interface Evidencia {
  file_url: string;
  file_name: string;
}

interface EvidenciaCarouselProps {
    evidencia: Evidencia[];
    w:string;
    h:string;
}

const EvidenciaCarousel: React.FC<EvidenciaCarouselProps> = ({ evidencia ,w,h}) => {
  const showNavigation = evidencia.length > 1;

  return (
    <Carousel className={`${w}`}>
      <CarouselContent>
        {evidencia.map((item, index) => {
          const isVideo = item.file_url?.match(/\.(mp4|webm|ogg|mov|avi)$/i);
          return (
            <CarouselItem key={index}>
              <div className="p-1 relative">
                {isVideo ? (
                  <video
                    controls
                    className={`${w} `+`${h} object-cover rounded-lg`}
                  >
                    <source src={item.file_url} type="video/mp4" />
                    Tu navegador no soporta la reproducción de video.
                  </video>
                ) : (
                  <Image
                    height={160}
                    width={160}
                    src={item.file_url || "/nouser.svg"}
                    alt="Imagen"
                    className={`${w} `+`${h} object-cover rounded-lg`}
                  />
                )}
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {showNavigation && (
        <>
          <CarouselPrevious />
          <CarouselNext />
        </>
      )}
    </Carousel>
  );
};

export default EvidenciaCarousel;