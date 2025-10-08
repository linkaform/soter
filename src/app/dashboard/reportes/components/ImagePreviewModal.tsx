import React from "react";
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImagePreviewModalProps {
  open: boolean;
  onClose: () => void;
  images: { src: string; alt?: string }[];
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  open,
  onClose,
  images,
}) => (
  <Dialog open={open} onOpenChange={(open) => (!open ? onClose() : undefined)}>
    <DialogContent className="max-w-2xl flex flex-col items-center">
      <DialogHeader>
        <DialogTitle className="text-lg font-bold">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <span className="text-3xl">🧑‍✈️</span>
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>
      <div className="w-full flex justify-center">
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
          }}
          className="w-full max-w-[500px]"
        >
          <CarouselContent className="px-6 py-2">
            {images.map((img, idx) => {
                if (!img.src) return null;

                return (
                <CarouselItem key={idx} className="w-full px-1">
                    <div className="flex flex-col items-center">
                    <Image
                        src={img.src}
                        alt={img.alt ?? `Imagen ${idx + 1}`}
                        width={600}
                        height={400}
                        className="rounded-lg object-contain max-h-[70vh] w-auto h-auto"
                    />
                    <span className="mt-2 text-xs text-gray-500">{img.alt ?? `Imagen ${idx + 1}`}</span>
                    </div>
                </CarouselItem>
                )
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <DialogClose asChild>
        <Button variant="outline" className="mt-4 w-full" onClick={onClose}>
          Cerrar
        </Button>
      </DialogClose>
    </DialogContent>
  </Dialog>
);

export default ImagePreviewModal;